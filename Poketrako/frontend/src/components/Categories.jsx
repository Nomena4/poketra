import React, { useEffect, useState, useMemo } from 'react';
import { 
  FiCoffee, 
  FiTruck, 
  FiActivity, 
  FiPlayCircle, 
  FiShoppingBag, 
  FiHome, 
  FiBook, 
  FiNavigation, 
  FiMonitor, 
  FiGift, 
  FiZap, 
  FiFolder,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiCheck,
  FiX,
  FiPlus,
  FiTrendingUp
} from 'react-icons/fi';
import '../styles/Categories.css';
import { useData } from '../context/DataContext';
import { getCategories as fetchCategoriesApi, createCategory as createCategoryApi, updateCategory as updateCategoryApi, deleteCategory as deleteCategoryApi } from '../api';

// React icons pour chaque catégorie selon le nom
const getCategoryIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('food') || n.includes('manger') || n.includes('aliment') || n.includes('repas') || n.includes('resto') || n.includes('nourriture') || n.includes('alimentation')) return <FiCoffee />;
  if (n.includes('transport') || n.includes('voiture') || n.includes('bus') || n.includes('taxi')) return <FiTruck />;
  if (n.includes('sante') || n.includes('santé') || n.includes('médic') || n.includes('medic') || n.includes('pharm') || n.includes('doctor')) return <FiActivity />;
  if (n.includes('loisir') || n.includes('sport') || n.includes('gym') || n.includes('cinema') || n.includes('film') || n.includes('jeu') || n.includes('play')) return <FiPlayCircle />;
  if (n.includes('vetement') || n.includes('vêtement') || n.includes('habit') || n.includes('mode') || n.includes('shopping') || n.includes('vêtements')) return <FiShoppingBag />;
  if (n.includes('logement') || n.includes('loyer') || n.includes('maison') || n.includes('appart') || n.includes('rent')) return <FiHome />;
  if (n.includes('education') || n.includes('école') || n.includes('livr') || n.includes('cours') || n.includes('etude') || n.includes('éducation')) return <FiBook />;
  if (n.includes('voyage') || n.includes('hotel') || n.includes('avion') || n.includes('vacance') || n.includes('trip') || n.includes('voyages')) return <FiNavigation />;
  if (n.includes('tech') || n.includes('informatique') || n.includes('phone') || n.includes('abonnement') || n.includes('abonnements')) return <FiMonitor />;
  if (n.includes('cadeau') || n.includes('gift') || n.includes('cadeaux')) return <FiGift />;
  if (n.includes('facture') || n.includes('electr') || n.includes('eau') || n.includes('gaz') || n.includes('bills')) return <FiZap />;
  return <FiFolder />;
};

const Categories = ({ token }) => {
  const { refresh } = useData();
  const [categories, setCategories] = useState([]);
  const [newName, setNewName]     = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName]   = useState('');
  const [loading, setLoading]     = useState(true);
  const [creating, setCreating]   = useState(false);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [sortAZ, setSortAZ]       = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategoriesApi();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setError('Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    setError('');
    try {
      await createCategoryApi(newName.trim());
      setNewName('');
      fetchCategories();
      refresh();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  const updateCategory = async (id) => {
    if (!editName.trim()) return;
    setError('');
    try {
      await updateCategoryApi(id, editName.trim());
      setEditingId(null);
      setEditName('');
      fetchCategories();
      refresh();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const deleteCategory = async (id) => {
    setError('');
    try {
      await deleteCategoryApi(id);
      fetchCategories();
      refresh();
    } catch (err) {
      setError(err.message || 'Impossible de supprimer cette catégorie');
    }
  };

  // Filtered + sorted list
  const displayed = useMemo(() => {
    let list = categories.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    if (sortAZ) list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [categories, search, sortAZ]);

  return (
    <div className="cat-page">

      {/* ── Header ── */}
      <div className="cat-page-header">
        <div className="cat-page-title-group">
          <h1><FiFolder className="cat-header-icon" /> Mes Catégories</h1>
          <p>Organisez vos dépenses par catégorie</p>
        </div>
        <div className="cat-page-badge">
          <FiTrendingUp />
          {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="cat-stats-row">
        <div className="cat-stat-card glass-panel hover-lift">
          <div className="cat-stat-icon blue"><FiFolder /></div>
          <div>
            <div className="cat-stat-label">Total catégories</div>
            <div className="cat-stat-value">{categories.length}</div>
          </div>
        </div>
        <div className="cat-stat-card glass-panel hover-lift">
          <div className="cat-stat-icon purple"><FiSearch /></div>
          <div>
            <div className="cat-stat-label">Résultats filtrés</div>
            <div className="cat-stat-value">{displayed.length}</div>
          </div>
        </div>
        <div className="cat-stat-card glass-panel hover-lift">
          <div className="cat-stat-icon green"><FiCheck /></div>
          <div>
            <div className="cat-stat-label">Statut</div>
            <div className="cat-stat-value" style={{ fontSize: '0.95rem', color: '#10b981' }}>Actif</div>
          </div>
        </div>
      </div>

      {/* ── Add Form ── */}
      <div className="cat-add-form glass-panel">
        <div className="cat-add-label"><FiPlus /> Nouvelle catégorie</div>
        <div className="cat-add-row">
          <input
            type="text"
            className="cat-input"
            placeholder="Ex : Alimentation, Transport, Loisirs…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createCategory()}
          />
          <button
            className="cat-btn-add"
            onClick={createCategory}
            disabled={creating || !newName.trim()}
          >
            {creating ? (
              <>
                <span style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'catSpin 0.7s linear infinite'
                }} />
                Création…
              </>
            ) : (
              <><FiPlus /> Ajouter</>
            )}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="cat-error glass-panel">
          <FiX /> {error}
          <button
            onClick={() => setError('')}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center' }}
          ><FiX /></button>
        </div>
      )}

      {/* ── Search + Sort ── */}
      {!loading && categories.length > 0 && (
        <div className="cat-search-row">
          <div className="cat-search-wrap">
            <span className="cat-search-icon"><FiSearch /></span>
            <input
              type="text"
              className="cat-search"
              placeholder="Rechercher une catégorie…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="cat-sort-btn"
            onClick={() => setSortAZ(s => !s)}
            title="Trier A→Z"
          >
            {sortAZ ? 'Trier par ordre d\'ajout' : 'Trier de A à Z'}
          </button>
        </div>
      )}

      {/* ── List ── */}
      {loading ? (
        <div className="cat-loading">
          <div className="cat-loading-spinner" />
          Chargement des catégories…
        </div>
      ) : displayed.length === 0 ? (
        <div className="cat-empty glass-panel">
          <span className="cat-empty-icon"><FiFolder /></span>
          <h3>{search ? 'Aucun résultat' : 'Aucune catégorie'}</h3>
          <p>{search ? `Rien pour "${search}"` : 'Créez votre première catégorie ci-dessus !'}</p>
        </div>
      ) : (
        <div className="cat-grid">
          {displayed.map((cat, idx) => (
            <div key={cat.id} className={`cat-card glass-panel hover-lift accent-${idx % 6}`}>
              {editingId === cat.id ? (
                /* ── Edit mode ── */
                <div className="cat-edit-row">
                  <input
                    type="text"
                    className="cat-input-sm"
                    value={editName}
                    autoFocus
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateCategory(cat.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <button className="cat-btn-sm confirm" onClick={() => updateCategory(cat.id)} title="Confirmer"><FiCheck /></button>
                  <button className="cat-btn-sm cancel"  onClick={() => setEditingId(null)}     title="Annuler"><FiX /></button>
                </div>
              ) : (
                /* ── View mode ── */
                <>
                  <div className="cat-card-top">
                    <div className="cat-card-icon">{getCategoryIcon(cat.name)}</div>
                    <div className="cat-card-actions">
                      <button
                        className="cat-icon-btn"
                        title="Modifier"
                        onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                      ><FiEdit2 /></button>
                      <button
                        className="cat-icon-btn danger"
                        title="Supprimer"
                        onClick={() => deleteCategory(cat.id)}
                      ><FiTrash2 /></button>
                    </div>
                  </div>
                  <div className="cat-card-name">{cat.name}</div>
                  <div className="cat-card-meta">
                    Ajoutée le {new Date(cat.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
