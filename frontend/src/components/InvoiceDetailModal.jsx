import React from 'react';
import { FaTimes, FaPrint, FaCheck, FaBan } from 'react-icons/fa';

export default function InvoiceDetailModal({ invoice, company, onClose, onUpdateStatus }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const currency = company?.currency || 'Ar';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <h3>Facture {invoice.invoiceNumber}</h3>
            <span className={`status-badge ${invoice.status}`}>{invoice.status}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="secondary-btn" onClick={handlePrint} title="Imprimer">
              <FaPrint /> Imprimer
            </button>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Action Status buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {invoice.status !== 'PAID' && (
            <button
              className="primary-btn"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
              onClick={() => onUpdateStatus(invoice.id, 'PAID')}
            >
              <FaCheck /> Marquer comme Payée
            </button>
          )}
          {invoice.status !== 'CANCELLED' && (
            <button
              className="secondary-btn"
              style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
              onClick={() => onUpdateStatus(invoice.id, 'CANCELLED')}
            >
              <FaBan /> Annuler la Facture
            </button>
          )}
        </div>

        {/* Printable View */}
        <div className="invoice-print-card">
          <div className="invoice-print-header">
            <div className="company-brand">
              <h2>{company?.companyName || 'Mon Entreprise'}</h2>
              <div className="company-meta">
                {company?.nif && <div>NIF : {company.nif}</div>}
                {company?.stat && <div>STAT : {company.stat}</div>}
                {company?.address && <div>{company.address}</div>}
                {company?.phone && <div>Tél : {company.phone}</div>}
                {company?.email && <div>Email : {company.email}</div>}
              </div>
            </div>
            <div className="invoice-meta">
              <h3>FACTURE</h3>
              <div><strong>N° :</strong> {invoice.invoiceNumber}</div>
              <div><strong>Date :</strong> {new Date(invoice.issueDate).toLocaleDateString()}</div>
              {invoice.dueDate && (
                <div><strong>Échéance :</strong> {new Date(invoice.dueDate).toLocaleDateString()}</div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#475569', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Facturé à :
            </h4>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a' }}>
              {invoice.client?.name || 'Client Général'}
            </div>
            {invoice.client?.email && <div style={{ fontSize: '0.85rem', color: '#475569' }}>{invoice.client.email}</div>}
            {invoice.client?.phone && <div style={{ fontSize: '0.85rem', color: '#475569' }}>{invoice.client.phone}</div>}
            {invoice.client?.address && <div style={{ fontSize: '0.85rem', color: '#475569' }}>{invoice.client.address}</div>}
          </div>

          <table className="invoice-table-print">
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ textAlign: 'center' }}>Qté</th>
                <th style={{ textAlign: 'right' }}>Prix Unitaire</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((item, idx) => (
                <tr key={idx}>
                  <td>{item.description}</td>
                  <td style={{ textAlign: 'center' }}>{Number(item.quantity)}</td>
                  <td style={{ textAlign: 'right' }}>{Number(item.unitPrice).toLocaleString()} {currency}</td>
                  <td style={{ textAlign: 'right' }}>{Number(item.totalPrice).toLocaleString()} {currency}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <div style={{ width: '250px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.9rem' }}>
                <span>Sous-total HT :</span>
                <span>{Number(invoice.subtotal).toLocaleString()} {currency}</span>
              </div>
              {Number(invoice.taxRate) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.9rem' }}>
                  <span>TVA ({Number(invoice.taxRate)}%) :</span>
                  <span>{Number(invoice.taxAmount).toLocaleString()} {currency}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '2px solid #0f172a', fontWeight: 'bold', fontSize: '1.1rem', color: '#0f172a' }}>
                <span>Total TTC :</span>
                <span>{Number(invoice.totalAmount).toLocaleString()} {currency}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#64748b' }}>
              <strong>Notes :</strong> {invoice.notes}
            </div>
          )}

          {(invoice.attachmentUrl || invoice.fileDataUrl) && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.5rem' }}>📎 Pièce Jointe :</strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={invoice.attachmentUrl || invoice.fileDataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-btn"
                  style={{ color: '#4f46e5', borderColor: '#818cf8', textDecoration: 'none', display: 'inline-flex' }}
                >
                  📥 Voir / Télécharger {invoice.attachmentName ? `(${invoice.attachmentName})` : 'le fichier'}
                </a>
                {(invoice.attachmentUrl || invoice.fileDataUrl).match(/\.(jpeg|jpg|png|gif|webp)|data:image/i) && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={invoice.attachmentUrl || invoice.fileDataUrl}
                      alt="Aperçu de la pièce jointe"
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

