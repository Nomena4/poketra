import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMonthlySummary, getProfile } from '../api';
import { FiTrendingUp, FiTrendingDown, FiTarget } from 'react-icons/fi';
import '../styles/SummaryCards.css';
import { useData } from '../context/DataContext';
import { useLang } from '../context/LangContext';

const SummaryCards = () => {
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0, budget: 0, remainingBudget: 0 });
  const [profile, setProfile] = useState(null);
  const { tick } = useData();
  const { t } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getMonthlySummary();
        setSummary(data);
      } catch (error) {
        console.error("Erreur de récupération du résumé mensuel :", error);
      }
    };
    
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Erreur de récupération du profil :", error);
      }
    };

    fetchSummary();
    fetchProfile();
  }, [tick]);

  const balance = parseFloat(summary.balance || 0);
  const remainingBudget = parseFloat(summary.remainingBudget || 0);
  const isBudgetConfigured = parseFloat(summary.budget || 0) > 0;

  return (
    <div className="summary-section">
      {/* Cartes de statistiques secondaires */}
      <div className="summary-stats-grid">
        <div className="gpay-stat-card card-income clickable" onClick={() => navigate('/incomes')}>
          <div className="gpay-stat-header">
            <span className="gpay-stat-icon-wrapper income">
              <FiTrendingUp />
            </span>
            <span className="gpay-stat-label">{t('monthlyIncome')}</span>
          </div>
          <div className="gpay-stat-value positive">
            +{parseFloat(summary.income || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar
          </div>
        </div>

        <div className="gpay-stat-card card-expense clickable" onClick={() => navigate('/expenses')}>
          <div className="gpay-stat-header">
            <span className="gpay-stat-icon-wrapper expense">
              <FiTrendingDown />
            </span>
            <span className="gpay-stat-label">{t('monthlyExpenses')}</span>
          </div>
          <div className="gpay-stat-value negative">
            -{parseFloat(summary.expenses || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar
          </div>
        </div>

        <div className={`gpay-stat-card card-budget ${!isBudgetConfigured || remainingBudget >= 0 ? 'positive-border' : 'negative-border'}`}>
          <div className="gpay-stat-header">
            <span className="gpay-stat-icon-wrapper budget">
              <FiTarget />
            </span>
            <span className="gpay-stat-label">{t('remainingBudget')}</span>
          </div>
          <div className={`gpay-stat-value ${!isBudgetConfigured || remainingBudget >= 0 ? 'positive' : 'negative'}`}>
            {isBudgetConfigured 
              ? `${remainingBudget >= 0 ? '+' : ''}${remainingBudget.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} Ar`
              : t('notConfigured')
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
