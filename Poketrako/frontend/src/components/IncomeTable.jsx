import { useState, useEffect } from 'react';
import { getIncomes, deleteIncome } from '../api';
import { FiArrowDownLeft, FiTrash2 } from 'react-icons/fi';
import '../styles/IncomeTable.css';
import { useData } from '../context/DataContext';

const IncomeTable = () => {
  const [incomes, setIncomes] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const { tick, refresh } = useData();

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const data = await getIncomes({ _sort: 'date:DESC', _limit: 5 });
        setIncomes(data);
      } catch (error) {
        console.error("Erreur de récupération des revenus :", error);
      }
    };
    fetchIncomes();
  }, [tick]);

  const handleDelete = async (id) => {
    try {
      await deleteIncome(id);
      refresh();
    } catch (err) {
      console.error("Erreur de suppression : " + err.message);
    }
  };

  return (
    <div className="gpay-activity-container">
      <h3>Revenus récents</h3>
      <div className="gpay-activity-list">
        {incomes.map((income, index) => (
          <div key={income.id} className="gpay-activity-item-wrapper">
            <div className="gpay-activity-item" onClick={() => setExpandedId(expandedId === income.id ? null : income.id)}>
            <div className={`gpay-activity-avatar income-avatar`}>
              <FiArrowDownLeft />
            </div>
            <div className="gpay-activity-details">
              <span className="gpay-activity-title">{income.source || 'Revenu'}</span>
              <span className="gpay-activity-date">
                {new Date(income.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="gpay-activity-amount positive">
              +{parseFloat(income.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar
            </div>
            <button 
              className="gpay-activity-delete-btn" 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(income.id);
              }}
              title="Supprimer le revenu"
            >
              <FiTrash2 />
            </button>
            </div>
            {expandedId === income.id && (
              <div className="gpay-activity-expanded-details">
                <p><strong>Description :</strong> {income.description || 'Aucune description'}</p>
              </div>
            )}
          </div>
        ))}
        {incomes.length === 0 && (
          <div className="gpay-activity-empty">Aucun revenu récent</div>
        )}
      </div>
    </div>
  );
};

export default IncomeTable;
