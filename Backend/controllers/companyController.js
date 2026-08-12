const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get Company Profile
exports.getCompanyProfile = async (req, res) => {
    try {
        let profile = await prisma.companyProfile.findUnique({
            where: { userId: req.userId }
        });
        if (!profile) {
            // Return empty profile object if not created yet
            profile = {
                companyName: '',
                nif: '',
                stat: '',
                address: '',
                phone: '',
                email: '',
                logoUrl: '',
                currency: 'Ar'
            };
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create or Update Company Profile
exports.upsertCompanyProfile = async (req, res) => {
    try {
        const { companyName, nif, stat, address, phone, email, logoUrl, currency } = req.body;

        const profile = await prisma.companyProfile.upsert({
            where: { userId: req.userId },
            update: {
                companyName,
                nif,
                stat,
                address,
                phone,
                email,
                logoUrl,
                currency: currency || 'Ar'
            },
            create: {
                userId: req.userId,
                companyName,
                nif,
                stat,
                address,
                phone,
                email,
                logoUrl,
                currency: currency || 'Ar'
            }
        });

        res.json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
