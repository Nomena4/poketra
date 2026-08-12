import React, { useState, useEffect } from 'react';
import {
  FaBuilding,
  FaFileInvoiceDollar,
  FaUsers,
  FaPlus,
  FaEye,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSave
} from 'react-icons/fa';
import {
  getCompanyProfile,
  upsertCompanyProfile,
  getInvoices,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  getClients,
  createClient,
  deleteClient
} from '../api';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import NewInvoiceModal from '../components/NewInvoiceModal';
import InvoiceDetailModal from '../components/InvoiceDetailModal';
import NewClientModal from '../components/NewClientModal';
import '../styles/Dashboard.css';
import '../styles/Enterprise.css';


export default function EnterprisePage() {

  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices', 'clients', 'profile'
  const [company, setCompany] = useState({
    companyName: '',
    nif: '',
    stat: '',
    address: '',
    phone: '',
    email: '',
    logoUrl: '',
    currency: 'Ar'
  });
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadEnterpriseData();
  }, []);

  const loadEnterpriseData = async () => {
    try {
      setLoading(true);
      const [compRes, invRes, cliRes] = await Promise.all([
        getCompanyProfile().catch(() => ({})),
        getInvoices().catch(() => []),
        getClients().catch(() => [])
      ]);

      if (compRes) setCompany({ ...company, ...compRes });
      if (Array.isArray(invRes)) setInvoices(invRes);
      if (Array.isArray(cliRes)) setClients(cliRes);
    } catch (err) {
      console.error('Erreur chargement entreprise:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    try {
      const updated = await upsertCompanyProfile(company);
      setCompany(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Erreur lors de la sauvegarde du profil d\'entreprise');
    }
  };

  const handleCreateInvoice = async (invoiceData) => {
    try {
      const newInv = await createInvoice(invoiceData);
      setInvoices([newInv, ...invoices]);
      setShowNewInvoiceModal(false);
    } catch (err) {
      alert('Erreur lors de la création de la facture');
    }
  };

  const handleUpdateInvoiceStatus = async (id, status) => {
    try {
      const updated = await updateInvoiceStatus(id, status);
      setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
      if (selectedInvoice && selectedInvoice.id === id) {
        setSelectedInvoice({ ...selectedInvoice, status });
      }
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette facture ?')) return;
    try {
      await deleteInvoice(id);
      setInvoices(invoices.filter((inv) => inv.id !== id));
      if (selectedInvoice && selectedInvoice.id === id) setSelectedInvoice(null);
    } catch (err) {
      alert('Erreur de suppression');
    }
  };

  const handleCreateClient = async (clientData) => {
    try {
      const newCli = await createClient(clientData);
      setClients([...clients, newCli]);
      setShowNewClientModal(false);
    } catch (err) {
      alert('Erreur lors de la création du client');
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Voulez-vous supprimer ce client ?')) return;
    try {
      await deleteClient(id);
      setClients(clients.filter((cli) => cli.id !== id));
    } catch (err) {
      alert('Erreur de suppression du client');
    }
  };

  // Stats calculation
  const totalInvoiced = invoices.reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0);
  const totalPending = invoices
    .filter((inv) => inv.status === 'PENDING' || inv.status === 'OVERDUE')
    .reduce((acc, inv) => acc + Number(inv.totalAmount || 0), 0);

  const currency = company.currency || 'Ar';

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-scroll">
          <div className="enterprise-container">
            {/* Header */}
            <div className="enterprise-header">
              <div className="enterprise-title">
                <h1>Espace Entreprise & Facturation</h1>
                <p>Gérez vos factures, vos clients, et le suivi financier de votre société.</p>
              </div>
            </div>


      {/* Stats Summary Cards */}
      <div className="enterprise-stats">
        <div className="stat-card">
          <div className="stat-icon-wrapper invoices">
            <FaFileInvoiceDollar />
          </div>
          <div className="stat-info">
            <h4>Total Facturé</h4>
            <div className="stat-value">{totalInvoiced.toLocaleString()} {currency}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper paid">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h4>Total Encaissé (Payé)</h4>
            <div className="stat-value" style={{ color: '#4ade80' }}>
              {totalPaid.toLocaleString()} {currency}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper pending">
            <FaClock />
          </div>
          <div className="stat-info">
            <h4>En Attente de Règlement</h4>
            <div className="stat-value" style={{ color: '#fbbf24' }}>
              {totalPending.toLocaleString()} {currency}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper clients">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h4>Clients / Fournisseurs</h4>
            <div className="stat-value">{clients.length}</div>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="enterprise-nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          <FaFileInvoiceDollar /> Factures ({invoices.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          <FaUsers /> Clients & Fournisseurs ({clients.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaBuilding /> Profil Société
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Chargement des données entreprise...
        </div>
      ) : (
        <>
          {/* TAB 1: INVOICES */}
          {activeTab === 'invoices' && (
            <div>
              <div className="section-actions">
                <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>Liste des Factures</h3>
                <button
                  className="primary-btn"
                  onClick={() => setShowNewInvoiceModal(true)}
                >
                  <FaPlus /> Créer une Facture
                </button>
              </div>

              <div className="table-card">
                {invoices.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Aucune facture enregistrée pour le moment. Cliquez sur "Créer une Facture" pour commencer.
                  </div>
                ) : (
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th>N° Facture</th>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Échéance</th>
                        <th>Montant Total</th>
                        <th>Statut</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 'bold', color: '#818cf8' }}>
                            {inv.invoiceNumber}
                          </td>
                          <td>{inv.client?.name || 'Client Général'}</td>
                          <td>{new Date(inv.issueDate).toLocaleDateString()}</td>
                          <td>
                            {inv.dueDate
                              ? new Date(inv.dueDate).toLocaleDateString()
                              : '-'}
                          </td>
                          <td style={{ fontWeight: 'bold' }}>
                            {Number(inv.totalAmount).toLocaleString()} {currency}
                          </td>
                          <td>
                            <span className={`status-badge ${inv.status}`}>
                              {inv.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                              <button
                                className="secondary-btn"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                onClick={() => setSelectedInvoice(inv)}
                                title="Voir / Imprimer"
                              >
                                <FaEye /> Voir
                              </button>
                              <button
                                className="icon-danger-btn"
                                style={{ width: '32px', height: '32px' }}
                                onClick={() => handleDeleteInvoice(inv.id)}
                                title="Supprimer"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CLIENTS & SUPPLIERS */}
          {activeTab === 'clients' && (
            <div>
              <div className="section-actions">
                <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>
                  Répertoire Clients & Fournisseurs
                </h3>
                <button
                  className="primary-btn"
                  onClick={() => setShowNewClientModal(true)}
                >
                  <FaPlus /> Nouveau Contact
                </button>
              </div>

              <div className="table-card">
                {clients.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Aucun client ou fournisseur enregistré.
                  </div>
                ) : (
                  <table className="enterprise-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Nom / Raison Sociale</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Adresse</th>
                        <th>NIF / STAT</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((cli) => (
                        <tr key={cli.id}>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                background: cli.type === 'CLIENT' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)',
                                color: cli.type === 'CLIENT' ? '#818cf8' : '#fbbf24'
                              }}
                            >
                              {cli.type}
                            </span>
                          </td>
                          <td style={{ fontWeight: 'bold' }}>{cli.name}</td>
                          <td>{cli.email || '-'}</td>
                          <td>{cli.phone || '-'}</td>
                          <td>{cli.address || '-'}</td>
                          <td>
                            {cli.nif || cli.stat ? `${cli.nif || ''} / ${cli.stat || ''}` : '-'}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="icon-danger-btn"
                              style={{ width: '32px', height: '32px', marginLeft: 'auto' }}
                              onClick={() => handleDeleteClient(cli.id)}
                              title="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: COMPANY PROFILE */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: '650px', margin: '0 auto' }}>
              <div className="table-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', marginBottom: '1.2rem' }}>
                  Informations Légales de la Société
                </h3>
                {savedSuccess && (
                  <div
                    style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      color: '#4ade80',
                      padding: '0.8rem 1rem',
                      borderRadius: '10px',
                      marginBottom: '1.2rem'
                    }}
                  >
                    ✅ Profil d'entreprise enregistré avec succès !
                  </div>
                )}
                <form onSubmit={handleSaveCompany}>
                  <div className="form-group">
                    <label>Raison Sociale / Nom de l'Entreprise</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: Poketrako Solutions SARL"
                      value={company.companyName}
                      onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>NIF (Numéro d'Identification Fiscale)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: 3000123456"
                        value={company.nif || ''}
                        onChange={(e) => setCompany({ ...company, nif: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>STAT (Statistique)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ex: 70200 11 2020 0 12345"
                        value={company.stat || ''}
                        onChange={(e) => setCompany({ ...company, stat: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Adresse du Siège Social</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: Antananarivo 101, Madagascar"
                      value={company.address || ''}
                      onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Téléphone Professionnel</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="+261 34 00 000 00"
                        value={company.phone || ''}
                        onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email de Contact</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="contact@poketrako.mg"
                        value={company.email || ''}
                        onChange={(e) => setCompany({ ...company, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Devise Principale</label>
                    <select
                      className="form-control"
                      value={company.currency || 'Ar'}
                      onChange={(e) => setCompany({ ...company, currency: e.target.value })}
                    >
                      <option value="Ar">Ariary (Ar)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar ($)</option>
                      <option value="XOF">Franc CFA (FCFA)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="primary-btn"
                    style={{ marginTop: '1.2rem', width: '100%', justifyContent: 'center' }}
                  >
                    <FaSave /> Enregistrer les Modifications
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showNewInvoiceModal && (
        <NewInvoiceModal
          clients={clients}
          currency={currency}
          onClose={() => setShowNewInvoiceModal(false)}
          onSubmit={handleCreateInvoice}
        />
      )}

      {showNewClientModal && (
        <NewClientModal
          onClose={() => setShowNewClientModal(false)}
          onSubmit={handleCreateClient}
        />
      )}

          {selectedInvoice && (
            <InvoiceDetailModal
              invoice={selectedInvoice}
              company={company}
              onClose={() => setSelectedInvoice(null)}
              onUpdateStatus={handleUpdateInvoiceStatus}
            />
          )}
          </div>
        </div>
        <BottomNavbar />
      </div>
    </div>
  );
}

