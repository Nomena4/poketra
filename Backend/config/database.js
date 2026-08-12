const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connexion Prisma OK !");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
  } catch (err) {
    console.error("❌ Erreur Prisma :", err);
  }
}

startServer();
