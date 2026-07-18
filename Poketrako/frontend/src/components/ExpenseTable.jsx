import { useState, useEffect } from 'react';
import { getExpenses, deleteExpense } from '../api';
import { FiArrowUpRight, FiTrash2 } from 'react-icons/fi';
import '../styles/ExpenseTable.css';
import { useData } from '../context/DataContext';
import Receipts from './Receipts';

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const { tick, refresh } = useData();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses({ _sort: 'date:DESC', _limit: 5 });
        setExpenses(data);
      } catch (error) {
        console.error("Erreur de récupération des dépenses :", error);
      }
    };
    fetchExpenses();
  }, [tick]);

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      refresh();
    } catch (err) {
      console.error("Erreur de suppression : " + err.message);
    }
  };

  return (
    <div className="gpay-activity-container">
      <h3>Dépenses récentes</h3>
      <div className="gpay-activity-list">
        {expenses.map((exp, index) => (
          <div key={exp.id} className="gpay-activity-item-wrapper">
            <div className="gpay-activity-item" onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}>
            <div className={`gpay-activity-avatar expense-avatar`}>
              <FiArrowUpRight />
            </div>
            <div className="gpay-activity-details">
              <span className="gpay-activity-title">{exp.description || 'Dépense'}</span>
              <span className="gpay-activity-date">
                {exp.date ? new Date(exp.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </span>
            </div>
            <div className="gpay-activity-amount negative">
              -{parseFloat(exp.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar
            </div>
            <button 
              className="gpay-activity-delete-btn" 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(exp.id);
              }}
              title="Supprimer la dépense"
            >
              <FiTrash2 />
            </button>
            </div>
            {expandedId === exp.id && (
              <div className="gpay-activity-expanded-details">
                <p><strong>Catégorie :</strong> {exp.category?.name || 'Non catégorisé'}</p>
                <p><strong>Type :</strong> {exp.type === 'RECURRING' ? 'Récurrente' : 'Ponctuelle'}</p>
                <p><strong>Description :</strong> {exp.description || 'Aucune description'}</p>
                {exp.receiptUpload && (
                   <div style={{ marginTop: '10px' }}>
                     <Receipts idExpense={exp.id} />
                   </div>
                )}
              </div>
            )}
          </div>
        ))}
        {expenses.length === 0 && (
          <div className="gpay-activity-empty">Aucune dépense récente</div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTable;
