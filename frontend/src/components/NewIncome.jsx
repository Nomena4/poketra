import React, { useState } from 'react';
import '../styles/NewExpense.css'; // Re-use expense form styling or customize if needed
import { createIncome } from '../api';
import { useData } from '../context/DataContext';

const NewIncome = ({ onIncomeAdded }) => {
  const { refresh } = useData();
  const [form, setForm] = useState({
    amount: '',
    date: '',
    source: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createIncome({
        amount: parseFloat(form.amount),
        date: new Date(form.date),
        source: form.source,
        description: form.description
      });
      console.log('✅ Revenu enregistré avec succès');
      setForm({
        amount: '',
        date: '',
        source: '',
        description: '',
      });
      if (onIncomeAdded) onIncomeAdded();
      refresh();
    } catch (err) {
      console.error(err);
      console.log('❌ Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>Nouveau revenu</h3>
      <input 
        type="number" 
        name="amount" 
        placeholder="Montant (Ar)" 
        value={form.amount}
        onChange={handleChange} 
        required 
      />
      <input 
        type="date" 
        name="date" 
        value={form.date}
        onChange={handleChange} 
        required 
      />
      <input 
        type="text" 
        name="source" 
        placeholder="Source (ex: Salaire, Freelance)" 
        value={form.source}
        onChange={handleChange} 
        required 
      />
      <input 
        type="text" 
        name="description" 
        placeholder="Description (optionnel)" 
        value={form.description}
        onChange={handleChange} 
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Enregistrement...' : 'Ajouter le revenu'}
      </button>
    </form>
  );
};

export default NewIncome;
