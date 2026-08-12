import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTrash, FaPaperclip } from 'react-icons/fa';

export default function NewInvoiceModal({ clients, onClose, onSubmit, currency = 'Ar' }) {
  const [invoiceNumber, setInvoiceNumber] = useState(`FACT-${Date.now().toString().slice(-6)}`);
  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [items, setItems] = useState([
    { description: 'Prestation de service / Produit', quantity: 1, unitPrice: 0 }
  ]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileDataUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Subtotal & totals
  const subtotal = items.reduce((acc, item) => {
    const qty = parseFloat(item.quantity || 0);
    const price = parseFloat(item.unitPrice || 0);
    return acc + (qty * price);
  }, 0);

  const rate = parseFloat(taxRate || 0);
  const taxAmount = (subtotal * rate) / 100;
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      invoiceNumber,
      clientId: clientId ? parseInt(clientId) : null,
      issueDate,
      dueDate: dueDate || null,
      taxRate: rate,
      notes,
      file,
      fileDataUrl,
      items
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Nouvelle Facture</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Numéro de Facture</label>
              <input
                type="text"
                className="form-control"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Client</label>
              <select
                className="form-control"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">-- Sélectionner un client --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.email ? `(${c.email})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Date d'émission</label>
              <input
                type="date"
                className="form-control"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Date d'échéance</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>TVA (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="form-control"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
          </div>

          <div className="items-section">
            <h4 style={{ marginBottom: '0.8rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
              Articles / Services
            </h4>
            {items.map((item, index) => (
              <div key={index} className="item-row">
                <input
                  type="text"
                  placeholder="Description du produit ou service"
                  className="form-control"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  required
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Qté"
                  className="form-control"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                />
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder={`Prix unit. (${currency})`}
                  className="form-control"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="icon-danger-btn"
                  onClick={() => handleRemoveItem(index)}
                  title="Supprimer la ligne"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="secondary-btn"
              style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
              onClick={handleAddItem}
            >
              <FaPlus /> Ajouter une ligne
            </button>
          </div>

          {/* Attachment File Input */}
          <div className="form-group" style={{ marginTop: '1.2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaPaperclip /> Pièce Jointe (PDF, Image / Photo)
            </label>
            <input
              type="file"
              accept=".pdf, image/*"
              className="form-control"
              onChange={handleFileChange}
              style={{ padding: '0.4rem' }}
            />
            {file && (
              <div style={{ fontSize: '0.85rem', color: '#818cf8', marginTop: '0.3rem' }}>
                📎 Fichier sélectionné : {file.name} ({(file.size / 1024).toFixed(1)} Ko)
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Notes / Conditions de règlement</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Ex: Payer sous 30 jours. Virement bancaire ou Mobile Money."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="invoice-summary-box">
            <div className="summary-line">
              <span>Sous-total :</span>
              <span>{subtotal.toLocaleString()} {currency}</span>
            </div>
            {rate > 0 && (
              <div className="summary-line">
                <span>TVA ({rate}%) :</span>
                <span>{taxAmount.toLocaleString()} {currency}</span>
              </div>
            )}
            <div className="summary-line total">
              <span>Total TTC :</span>
              <span>{totalAmount.toLocaleString()} {currency}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
            <button type="button" className="secondary-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="primary-btn">
              Créer la Facture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

