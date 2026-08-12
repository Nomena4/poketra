import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

export default function NewClientModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [nif, setNif] = useState('');
  const [stat, setStat] = useState('');
  const [type, setType] = useState('CLIENT');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, phone, address, nif, stat, type });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Nouveau Client / Fournisseur</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <select
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="CLIENT">Client</option>
              <option value="SUPPLIER">Fournisseur</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nom complet / Raison Sociale</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: Societe ABC ou Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="contact@societe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="text"
                className="form-control"
                placeholder="+261 34 00 000 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <input
              type="text"
              className="form-control"
              placeholder="Adresse géographique"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>NIF (optionnel)</label>
              <input
                type="text"
                className="form-control"
                value={nif}
                onChange={(e) => setNif(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>STAT (optionnel)</label>
              <input
                type="text"
                className="form-control"
                value={stat}
                onChange={(e) => setStat(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
            <button type="button" className="secondary-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="primary-btn">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
