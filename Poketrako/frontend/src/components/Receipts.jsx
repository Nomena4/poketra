import { useEffect, useState } from 'react';
import { getReceiptForExpense, deleteReceipt, getReceiptFileUrl } from '../api';
import '../styles/Receipts.css';

const Receipts = ({ idExpense }) => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!idExpense) return;
      try {
        setLoading(true);
        const data = await getReceiptForExpense(idExpense);
        setReceipt(data);
      } catch (err) {
        console.error('Erreur justificatif :', err);
        setReceipt(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [idExpense]);

  const handleDelete = async () => {
    if (!receipt) return;
    try {
      await deleteReceipt(receipt.id);
      console.log('✅ Justificatif supprimé');
      setReceipt(null);
    } catch (err) {
      console.error('Erreur suppression :', err);
    }
  };

  if (loading) return <p>Chargement du justificatif...</p>;
  if (!receipt) return <p>Aucun justificatif trouvé.</p>;

  const fileUrl = getReceiptFileUrl(receipt);

  return (
    <div className="receipt-preview">
      <h3>Justificatif</h3>
      <div style={{ margin: '15px 0' }}>
        {receipt.contentType && receipt.contentType.includes('image') ? (
          <img src={fileUrl} alt="Justificatif" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid #ddd' }} />
        ) : (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="view-pdf-btn">
            📄 Voir le fichier PDF ({((receipt.size || 0) / 1024).toFixed(1)} KB)
          </a>
        )}
      </div>
      <button onClick={handleDelete} className="delete-receipt-btn" style={{ marginTop: '10px' }}>
        🗑️ Supprimer le justificatif
      </button>
    </div>
  );
};

export default Receipts;
