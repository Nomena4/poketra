import React, { useEffect, useState } from 'react';
import { getCaisseTransactions, deleteCaisseTransaction } from '../api';
import { useData } from '../context/DataContext';
import { FiTrash2 } from 'react-icons/fi';
import '../styles/ExpenseTable.css'; // Reusing list container styles
import '../styles/Caisse.css';

const CaisseTable = () => {
  const { tick, refresh } = useData();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getCaisseTransactions();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur chargement caisse:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [tick]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Supprimer cette transaction ?")) return;
    try {
      await deleteCaisseTransaction(id);
      refresh();
    } catch (err) {
      alert("Erreur de suppression");
    }
  };

  if (loading) return <div className="gpay-activity-empty">Chargement...</div>;

  return (
    <div className="gpay-activity-container">
      <h3>Historique de Caisse</h3>
      {transactions.length === 0 ? (
        <div className="gpay-activity-empty">Aucune transaction de caisse.</div>
      ) : (
        <div className="gpay-activity-list">
          {transactions.map(t => (
            <div key={t.id} className="gpay-activity-item-wrapper" onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}>
              <div className="gpay-activity-item">
                <div className={`gpay-activity-avatar ${t.type === 'WITHDRAWAL' ? 'expense-avatar' : 'income-avatar'}`}>
                  {t.operator ? t.operator.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="gpay-activity-details">
                  <span className="gpay-activity-title">{t.operator}</span>
                  <span className="gpay-activity-date">
                    {new Date(t.date).toLocaleDateString()}
                    {' • '}
                    <span className={`caisse-badge ${t.type.toLowerCase()}`}>
                      {t.type === 'DEPOSIT' ? 'Dépôt' : t.type === 'WITHDRAWAL' ? 'Retrait' : 'Transfert'}
                    </span>
                  </span>
                </div>
                <div className={`gpay-activity-amount ${t.type === 'WITHDRAWAL' ? 'negative' : 'positive'}`}>
                  {t.type === 'WITHDRAWAL' ? '-' : '+'}{parseFloat(t.amount).toLocaleString('fr-FR')} Ar
                </div>
              </div>
              
              {expandedId === t.id && (
                <div className="gpay-activity-expanded-details">
                  {t.reference && <p><strong>Référence:</strong> {t.reference}</p>}
                  {t.commission > 0 && <p><strong>Commission:</strong> {parseFloat(t.commission).toLocaleString('fr-FR')} Ar</p>}
                  {t.description && <p><strong>Description:</strong> {t.description}</p>}
                  <button className="gpay-activity-delete-btn" onClick={(e) => handleDelete(t.id, e)} title="Supprimer">
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaisseTable;
