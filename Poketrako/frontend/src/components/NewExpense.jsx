import React, { useState, useEffect } from 'react';
import '../styles/NewExpense.css';
import { useData } from '../context/DataContext';
import { getCategories, createExpense } from '../api';

const NewExpense = ({ token, onExpenseAdded }) => {
  const { refresh } = useData();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    date: '',
    categoryId: '',
    description: '',
    type: 'one-time',
    startDate: '',
    endDate: '',
    receipt: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setForm(prev => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (err) {
        console.error("Erreur chargement categories:", err);
      }
    };
    if (token) {
      fetchCategories();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'file' ? (files && files.length > 0 ? files[0] : null) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') data.append(key, value);
    });

    try {
      await createExpense(data);
      console.log('✅ Dépense enregistrée avec succès');
      
      // Reset form
      setForm({
        amount: '',
        date: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        description: '',
        type: 'one-time',
        startDate: '',
        endDate: '',
        receipt: null,
      });

      if (onExpenseAdded) onExpenseAdded();
      refresh();
    } catch (err) {
      console.error(err);
      console.log('❌ Erreur : ' + err.message);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>Nouvelle dépense</h3>
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
      
      <select 
        name="categoryId" 
        value={form.categoryId} 
        onChange={handleChange} 
        required
      >
        {categories.length === 0 ? (
          <option value="">-- Aucune catégorie disponible --</option>
        ) : (
          categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))
        )}
      </select>

      <input 
        type="text" 
        name="description" 
        placeholder="Description (optionnel)" 
        value={form.description} 
        onChange={handleChange} 
      />
      
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="one-time">Ponctuelle</option>
        <option value="recurring">Récurrente</option>
      </select>

      {form.type === 'recurring' && (
        <>
          <label>Début</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
          <label>Fin (optionnel)</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
        </>
      )}

      <label>Justificatif (PDF, JPG, PNG)</label>
      <input type="file" name="receipt" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} />

      <button type="submit">Ajouter la dépense</button>
    </form>
  );
};

export default NewExpense;
