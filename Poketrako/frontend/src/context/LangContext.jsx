import { createContext, useContext, useState } from 'react';

const translations = {
  fr: {
    // Sidebar & Nav
    dashboard: 'Tableau de bord',
    wallets: 'Portefeuilles',
    expenses: 'Dépenses',
    incomes: 'Revenus',
    caisse: 'Caisse',
    sessions: 'Sessions',
    stock: 'Stock',
    categories: 'Catégories',
    profile: 'Profil',
    logout: 'Déconnexion',
    home: 'Accueil',

    // Dashboard
    quickActions: 'Actions rapides',
    pay: 'Payer',
    receive: 'Recevoir',
    recentExpenses: 'Dépenses récentes',
    recentIncomes: 'Revenus récents',
    noRecentExpense: 'Aucune dépense récente',
    noRecentIncome: 'Aucun revenu récent',

    // SummaryCards
    netBalance: 'Solde net disponible',
    monthlyIncome: 'Revenus du mois',
    monthlyExpenses: 'Dépenses du mois',
    remainingBudget: 'Budget restant',
    notConfigured: 'Non configuré',

    // NewExpense
    newExpense: 'Nouvelle dépense',
    amount: 'Montant (Ar)',
    description: 'Description (optionnel)',
    addExpense: 'Ajouter la dépense',
    punctual: 'Ponctuelle',
    recurring: 'Récurrente',
    start: 'Début',
    end: 'Fin (optionnel)',
    receipt: 'Justificatif (PDF, JPG, PNG)',
    saving: 'Enregistrement...',
    noCategory: '-- Aucune catégorie disponible --',

    // NewIncome
    newIncome: 'Nouveau revenu',
    source: 'Source (ex: Salaire, Freelance)',
    addIncome: 'Ajouter le revenu',

    // Profile
    accountInfo: 'Informations du compte',
    fullName: 'Nom complet',
    email: 'Adresse email',
    uniqueId: 'Identifiant unique',
    monthlyBudget: 'Budget mensuel',
    budgetPlaceholder: 'Montant du budget (Ar)',
    save: 'Enregistrer',
    appMode: "Mode de l'application",
    offlineMode: 'Mode Hors-Ligne',
    offlineActive: 'Actif — données stockées localement',
    offlineInactive: 'Inactif — connecté au serveur distant',
    offlineHint: "💡 Le mode hors-ligne est idéal pour l'application mobile. Il utilise le stockage local (LocalStorage) sans connexion internet.",
    disconnect: 'Se déconnecter',
    loading: 'Chargement...',
    profileLoading: 'Chargement du profil...',
    profileError: 'Impossible de charger le profil. Veuillez vous reconnecter.',

    // Categories
    myCategories: 'Mes Catégories',
    organizeCategories: 'Organisez vos dépenses par catégorie',
    totalCategories: 'Total catégories',
    filteredResults: 'Résultats filtrés',
    status: 'Statut',
    active: 'Actif',
    newCategory: 'Nouvelle catégorie',
    categoryPlaceholder: 'Ex : Alimentation, Transport, Loisirs…',
    add: 'Ajouter',
    creating: 'Création…',
    searchCategory: 'Rechercher une catégorie…',
    sortAZ: 'Trier de A à Z',
    sortByDate: "Trier par ordre d'ajout",
    addedOn: 'Ajoutée le',
    noCategory2: 'Aucune catégorie',
    noResult: 'Aucun résultat',
    createFirst: 'Créez votre première catégorie ci-dessus !',
    loadingCategories: 'Chargement des catégories…',

    // Expenses page
    myExpenses: '💸 Mes Dépenses',
    manageExpenses: 'Ajoutez de nouvelles dépenses et gérez votre budget',

    // Incomes page
    myIncomes: '💰 Mes Revenus',
    trackIncomes: "Suivez vos rentrées d'argent mensuelles et vos sources de revenus",

    // Language
    language: 'Langue',
    french: 'Français',
    malagasy: 'Malagasy',
  },
  mg: {
    // Sidebar & Nav
    dashboard: 'Dashboard',
    wallets: 'Poketra',
    expenses: 'Fandaniana',
    incomes: 'Vola miditra',
    caisse: 'Caisse',
    sessions: 'Sessions',
    stock: 'Tahiry & Varatra',
    categories: 'Sokajy',
    profile: 'Mombamomba',
    logout: 'Hiala',
    home: 'Fandraisana',

    // Dashboard
    quickActions: 'Hetsika haingana',
    pay: 'Mandoa',
    receive: 'Mandray',
    recentExpenses: 'Fandaniana farany',
    recentIncomes: 'Vola miditra farany',
    noRecentExpense: 'Tsy misy fandaniana farany',
    noRecentIncome: 'Tsy misy vola miditra farany',

    // SummaryCards
    netBalance: 'Taham-bola sisa',
    monthlyIncome: 'Vola miditra amin\'ity volana ity',
    monthlyExpenses: 'Fandaniana amin\'ity volana ity',
    remainingBudget: 'Tetibola sisa',
    notConfigured: 'Tsy voafaritra',

    // NewExpense
    newExpense: 'Fandaniana vaovao',
    amount: 'Habetsaka (Ar)',
    description: 'Famaritana (tsy voatery)',
    addExpense: 'Hanampy fandaniana',
    punctual: 'Indray mandeha',
    recurring: 'Miverimberina',
    start: 'Fiandohana',
    end: 'Farany (tsy voatery)',
    receipt: 'Porofo (PDF, JPG, PNG)',
    saving: 'Fandraharahana...',
    noCategory: '-- Tsy misy sokajy --',

    // NewIncome
    newIncome: 'Vola miditra vaovao',
    source: 'Loharano (ohatra: Karama, Freelance)',
    addIncome: 'Hanampy vola miditra',

    // Profile
    accountInfo: 'Mombamomba ny kaonty',
    fullName: 'Anarana feno',
    email: 'Adiresy mailaka',
    uniqueId: 'Fanamarinana manokana',
    monthlyBudget: 'Tetibola isam-bolana',
    budgetPlaceholder: 'Habetsakin\'ny tetibola (Ar)',
    save: 'Tehirizo',
    appMode: 'Fomba fampiasana',
    offlineMode: 'Fomba tsy an-tserasera',
    offlineActive: 'Mavitrika — voatahiry eo an-toerana',
    offlineInactive: 'Tsy mavitrika — mifandray amin\'ny server',
    offlineHint: '💡 Ny fomba tsy an-tserasera dia mety amin\'ny finday. Mampiasa fitahirizana eo an-toerana (LocalStorage) tsy mila internet.',
    disconnect: 'Hiala',
    loading: 'Miandry...',
    profileLoading: 'Ampidirana mombamomba...',
    profileError: 'Tsy afaka nahazo ny mombamomba. Mametraha fandraisana indray.',

    // Categories
    myCategories: 'Sokajiko',
    organizeCategories: 'Omeo sokajy ny fandanianao',
    totalCategories: 'Sokajy rehetra',
    filteredResults: 'Vokatra nosfidiana',
    status: 'Toetry',
    active: 'Mavitrika',
    newCategory: 'Sokajy vaovao',
    categoryPlaceholder: 'Ohatra: Sakafo, Fitaterana, Fialamboly…',
    add: 'Hanampy',
    creating: 'Famoronana…',
    searchCategory: 'Hikaroka sokajy…',
    sortAZ: 'Milajara A hatramin\'i Z',
    sortByDate: 'Milajara araka ny daty nanampiany',
    addedOn: 'Nampiana ny',
    noCategory2: 'Tsy misy sokajy',
    noResult: 'Tsy misy vokatra',
    createFirst: 'Mamorona sokajy voalohany eto ambony!',
    loadingCategories: 'Ampidirana sokajy…',

    // Expenses page
    myExpenses: '💸 Ny Fandanianako',
    manageExpenses: 'Hanampy fandaniana vaovao sy hitantana ny tetibolanao',

    // Incomes page
    myIncomes: '💰 Ny Vola Miditra',
    trackIncomes: 'Araho ny vola miditra isam-bolana sy ny loharanon\'ny volao',

    // Language
    language: 'Fiteny',
    french: 'Frantsay',
    malagasy: 'Malagasy',
  }
};

const LangContext = createContext(null);

export const LangProvider = ({ children }) => {
  const stored = localStorage.getItem('poketrako_lang') || 'fr';
  const [lang, setLang] = useState(stored);

  const setLanguage = (l) => {
    setLang(l);
    localStorage.setItem('poketrako_lang', l);
  };

  const t = (key) => translations[lang]?.[key] ?? translations['fr'][key] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
};
