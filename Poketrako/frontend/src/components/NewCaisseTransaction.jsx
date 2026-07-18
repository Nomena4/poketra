import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { createCaisseTransaction } from '../api';
import { Capacitor } from '@capacitor/core';
import { SMSInboxReader } from 'capacitor-sms-inbox';
import '../styles/NewExpense.css';

const NewCaisseTransaction = ({ onTransactionAdded }) => {
  const { refresh } = useData();
  const [form, setForm] = useState({
    type: 'DEPOSIT',
    amount: '',
    operator: '',
    commission: '',
    reference: '',
    description: '',
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAutoFillSMS = async () => {
    if (!Capacitor.isNativePlatform()) {
      alert("La lecture automatique des SMS n'est disponible que sur l'application Android native.");
      return;
    }

    try {
      const permission = await SMSInboxReader.requestPermissions();
      if (permission.sms !== 'granted') {
        alert("Permission refusée pour lire les SMS.");
        return;
      }

      const { smsList } = await SMSInboxReader.getSmsInbox({
        filter: {
          box: 'inbox',
          maxCount: 20,
        }
      });

      const mmSms = smsList.find(sms => {
        const addr = (sms.address || '').toLowerCase();
        return addr.includes('164') || addr.includes('orange') || addr.includes('airtel');
      });

      if (!mmSms) {
        alert("Aucun SMS de Mobile Money récent trouvé.");
        return;
      }

      const text = mmSms.body.toLowerCase();
      let detectedOperator = 'MVola';
      const addr = (mmSms.address || '').toLowerCase();
      if (addr.includes('orange')) detectedOperator = 'Orange Money';
      if (addr.includes('airtel')) detectedOperator = 'Airtel Money';

      let amountMatch = text.match(/(?:de|recu)\s+([\d\s]+(?:,\d+)?)\s*ar/i) || text.match(/([\d\s]+)\s*ar/i);
      let refMatch = text.match(/ref(?:\.|:)?\s*([a-z0-9]+)/i);
      let commMatch = text.match(/(?:commission|frais)(?:\s*de)?\s*([\d\s]+(?:,\d+)?)\s*ar/i);

      let amount = amountMatch ? amountMatch[1].replace(/\s/g, '') : '';
      let reference = refMatch ? refMatch[1].toUpperCase() : '';
      let commission = commMatch ? commMatch[1].replace(/\s/g, '') : '0';
      
      let type = 'TRANSFER';
      if (text.includes('depot') || text.includes('dépôt') || text.includes('recu') || text.includes('reçu')) type = 'DEPOSIT';
      if (text.includes('retrait')) type = 'WITHDRAWAL';

      setForm(prev => ({
        ...prev,
        type: type,
        amount: amount,
        operator: detectedOperator,
        commission: commission,
        reference: reference,
        description: `Auto-rempli via SMS`
      }));

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la lecture des SMS : " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCaisseTransaction(form);
      setForm({
        type: 'DEPOSIT',
        amount: '',
        operator: '',
        commission: '',
        reference: '',
        description: '',
        date: ''
      });
      if (onTransactionAdded) onTransactionAdded();
      refresh();
    } catch (err) {
      console.error(err);
      alert('Erreur : ' + err.message);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>Nouvelle Transaction Caisse</h3>

      {Capacitor.isNativePlatform() && (
        <button 
          type="button" 
          onClick={handleAutoFillSMS}
          style={{ background: 'linear-gradient(135deg, #00d2d3, #0984e3)', marginBottom: '1rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          className="glass-button"
        >
          🪄 Remplir depuis les SMS
        </button>
      )}
      
      <select name="type" value={form.type} onChange={handleChange} required>
        <option value="DEPOSIT">Dépôt</option>
        <option value="WITHDRAWAL">Retrait</option>
        <option value="TRANSFER">Transfert</option>
      </select>
      
      <input 
        type="number" 
        name="amount" 
        placeholder="Montant (Ar)" 
        value={form.amount} 
        onChange={handleChange} 
        required 
      />
      
      <input 
        type="text" 
        name="operator" 
        placeholder="Opérateur (MVola, Orange Money...)" 
        value={form.operator} 
        onChange={handleChange} 
        required 
      />
      
      <input 
        type="number" 
        name="commission" 
        placeholder="Commission (Ar)" 
        value={form.commission} 
        onChange={handleChange} 
      />
      
      <input 
        type="text" 
        name="reference" 
        placeholder="Référence SMS" 
        value={form.reference} 
        onChange={handleChange} 
      />
      
      <input 
        type="text" 
        name="description" 
        placeholder="Description" 
        value={form.description} 
        onChange={handleChange} 
      />
      
      <input 
        type="date" 
        name="date" 
        value={form.date} 
        onChange={handleChange} 
      />
      
      <button type="submit">Valider</button>
    </form>
  );
};

export default NewCaisseTransaction;
