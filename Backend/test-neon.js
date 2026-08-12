require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  console.log('\n🔍 Test de connexion à Neon (PostgreSQL)...\n');
  
  try {
    // Test 1: connexion de base
    const result = await prisma.$queryRaw`SELECT current_database() as db, current_user as usr, version() as ver`;
    
    console.log('✅ Connexion réussie à Neon !');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 Base de données :', result[0].db);
    console.log('👤 Utilisateur     :', result[0].usr);
    console.log('🐘 PostgreSQL ver  :', result[0].ver.split(' ').slice(0, 2).join(' '));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Test 2: comptage des tables
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const expenseCount = await prisma.expense.count();
    const incomeCount = await prisma.income.count();

    console.log('\n📊 Données en base :');
    console.log(`   • Utilisateurs  : ${userCount}`);
    console.log(`   • Catégories    : ${categoryCount}`);
    console.log(`   • Dépenses      : ${expenseCount}`);
    console.log(`   • Revenus       : ${incomeCount}`);

    // Test 3: vérification du champ avatar (ajout récent)
    const userWithAvatar = await prisma.user.findFirst({
      select: { id: true, email: true, fullName: true, avatar: true }
    });
    console.log('\n🖼️  Champ avatar présent :', userWithAvatar !== null ? 'Oui (colonne existe)' : 'Table vide (colonne existe)');

    console.log('\n✅ Tous les tests sont passés avec succès !');
    console.log('🔗 URL Neon :', process.env.DATABASE_URL.split('@')[1].split('/')[0]);
    
  } catch (err) {
    console.error('❌ Erreur de connexion :', err.message);
    if (err.message.includes('avatar')) {
      console.error('⚠️  La colonne "avatar" n\'existe pas encore. Lancez: npx prisma db push');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
