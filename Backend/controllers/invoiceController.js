const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ==================== INVOICES ====================

// Get all invoices for user
exports.getInvoices = async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            where: { userId: req.userId },
            include: {
                client: true,
                items: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new invoice
exports.createInvoice = async (req, res) => {
    try {
        const { invoiceNumber, issueDate, dueDate, status, taxRate, notes, clientId, items, attachmentUrl: bodyAttachmentUrl, attachmentName: bodyAttachmentName } = req.body;

        // Parse items if stringified in FormData
        let parsedItems = items;
        if (typeof items === 'string') {
            try { parsedItems = JSON.parse(items); } catch (e) { parsedItems = []; }
        }

        // Calculate subtotal, taxAmount, and totalAmount
        let subtotal = 0;
        const formattedItems = (parsedItems || []).map(item => {
            const qty = parseFloat(item.quantity || 1);
            const price = parseFloat(item.unitPrice || 0);
            const lineTotal = qty * price;
            subtotal += lineTotal;
            return {
                description: item.description || '',
                quantity: qty,
                unitPrice: price,
                totalPrice: lineTotal
            };
        });

        const rate = parseFloat(taxRate || 0);
        const taxAmount = (subtotal * rate) / 100;
        const totalAmount = subtotal + taxAmount;

        let attachmentUrl = bodyAttachmentUrl || null;
        let attachmentName = bodyAttachmentName || null;

        if (req.file) {
            attachmentUrl = `/uploads/invoices/${req.file.filename}`;
            attachmentName = req.file.originalname;
        }

        const invoice = await prisma.invoice.create({
            data: {
                userId: req.userId,
                invoiceNumber: invoiceNumber || `FACT-${Date.now().toString().slice(-6)}`,
                issueDate: issueDate ? new Date(issueDate) : new Date(),
                dueDate: dueDate ? new Date(dueDate) : null,
                status: status || 'PENDING',
                taxRate: rate,
                subtotal,
                taxAmount,
                totalAmount,
                notes,
                attachmentUrl,
                attachmentName,
                clientId: clientId ? parseInt(clientId) : null,
                items: {
                    create: formattedItems
                }
            },
            include: {
                client: true,
                items: true
            }
        });

        res.status(201).json(invoice);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update invoice status
exports.updateInvoiceStatus = async (req, res) => {
    try {
        const invoiceId = parseInt(req.params.id);
        const { status } = req.body;

        const invoice = await prisma.invoice.updateMany({
            where: { id: invoiceId, userId: req.userId },
            data: { status }
        });

        if (invoice.count === 0) {
            return res.status(404).json({ error: 'Facture non trouvée' });
        }

        const updated = await prisma.invoice.findFirst({
            where: { id: invoiceId, userId: req.userId },
            include: { client: true, items: true }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const invoiceId = parseInt(req.params.id);
        const deleted = await prisma.invoice.deleteMany({
            where: { id: invoiceId, userId: req.userId }
        });

        if (deleted.count === 0) {
            return res.status(404).json({ error: 'Facture non trouvée' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==================== CLIENTS ====================

// Get all clients/suppliers
exports.getClients = async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            where: { userId: req.userId },
            include: {
                invoices: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a client/supplier
exports.createClient = async (req, res) => {
    try {
        const { name, email, phone, address, nif, stat, type } = req.body;

        const client = await prisma.client.create({
            data: {
                userId: req.userId,
                name,
                email,
                phone,
                address,
                nif,
                stat,
                type: type || 'CLIENT'
            }
        });

        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a client
exports.deleteClient = async (req, res) => {
    try {
        const clientId = parseInt(req.params.id);
        const deleted = await prisma.client.deleteMany({
            where: { id: clientId, userId: req.userId }
        });

        if (deleted.count === 0) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
