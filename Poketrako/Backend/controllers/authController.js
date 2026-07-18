const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Email Transporter ────────────────────────────────────────────────────────
let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  const isRealEmail = process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('votre.email');

  if (isRealEmail) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('📧 Email: using real SMTP credentials');
  } else {
    // Create an Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('📧 Email: using Ethereal test account →', testAccount.user);
  }

  return transporter;
}

// ─── Email / Password Auth ─────────────────────────────────────────────────

async function signup(req, res) {
  try {
    const { email, password, fullName } = req.body;
    console.log("Signup attempt:", req.body);

    if (!email || !password)
      return res.status(400).json({ message: "Email et mot de passe requis" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Utilisateur déjà existant" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, fullName },
    });

    console.log("User created:", user);
    res.status(201).json({ message: "Utilisateur créé", userId: user.id });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Erreur serveur lors de la création" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password });

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("User found:", user);

    if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
}

// ─── Google OAuth ──────────────────────────────────────────────────────────

async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Jeton Google manquant" });
    }

    // Verify the Google ID Token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      user = await prisma.user.create({
        data: { email, password: randomPassword, fullName: name },
      });
      console.log("New user created via Google:", user.email);
    }

    // Issue a standard JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName } });
  } catch (err) {
    console.error("Google Login error:", err);
    res.status(500).json({ message: "Erreur serveur lors de la connexion Google" });
  }
}

// ─── Profile & Settings ────────────────────────────────────────────────────

async function getMe(req, res) {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    res.json({ email: user.email, id: user.id, fullName: user.fullName, budget: user.budget, avatar: user.avatar });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function updateBudget(req, res) {
  try {
    const userId = req.userId;
    const { budget } = req.body;

    if (budget === undefined) {
      return res.status(400).json({ message: "Budget requis" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { budget: parseFloat(budget) },
      select: { id: true, email: true, fullName: true, budget: true }
    });

    res.json(user);
  } catch (err) {
    console.error("UpdateBudget error:", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du budget" });
  }
}

async function updateAvatar(req, res) {
  try {
    const userId = req.userId;
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }
    const avatarFilename = req.file.path; // Cloudinary URL
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarFilename },
      select: { id: true, email: true, fullName: true, budget: true, avatar: true }
    });
    res.json(user);
  } catch (err) {
    console.error('UpdateAvatar error:', err);
    res.status(500).json({ message: 'Erreur lors du téléversement de la photo' });
  }
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email requis" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ message: "Si cet email est enregistré, un lien de réinitialisation a été envoyé." });
    }

    // Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: expires,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/#/reset-password?token=${rawToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Poketrako – Réinitialisation de votre mot de passe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1115; color: #f5f6fa; padding: 40px; border-radius: 16px;">
          <h2 style="color: #6c5ce7; margin-bottom: 8px;">Poketrako</h2>
          <h3 style="margin-bottom: 16px;">Réinitialisation de mot de passe</h3>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous :</p>
          <a href="${resetUrl}" style="display:inline-block; margin: 24px 0; padding: 14px 28px; background: linear-gradient(135deg, #6c5ce7, #8e44ad); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Réinitialiser mon mot de passe</a>
          <p style="color: #a4b0be; font-size: 0.88rem;">Ce lien expire dans <strong>1 heure</strong>. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
          <hr style="border-color: rgba(255,255,255,0.08); margin: 24px 0;">
          <p style="color: #a4b0be; font-size: 0.78rem;">Poketrako – Portefeuille Électronique</p>
        </div>
      `,
    };

    try {
      const t = await getTransporter();
      const info = await t.sendMail(mailOptions);
      console.log(`✉️  Reset email sent to ${email}`);
      // If using Ethereal, print the preview URL
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`\n📬 [ETHEREAL PREVIEW] Cliquez pour lire l'email de test :\n   ${previewUrl}\n`);
      }
    } catch (emailErr) {
      console.error('Email send error:', emailErr.message);
      console.log(`\n🔗 [DEV FALLBACK] Lien de réinitialisation :\n   ${resetUrl}\n`);
    }

    res.json({ message: "Si cet email est enregistré, un lien de réinitialisation a été envoyé." });
  } catch (err) {
    console.error("ForgotPassword error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

// ─── Reset Password ───────────────────────────────────────────────────────────

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Jeton et nouveau mot de passe requis" });

    if (password.length < 6)
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user)
      return res.status(400).json({ message: "Lien de réinitialisation invalide ou expiré" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    console.log(`✅ Password reset for user: ${user.email}`);
    res.json({ message: "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter." });
  } catch (err) {
    console.error("ResetPassword error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { signup, login, getMe, updateBudget, updateAvatar, googleLogin, forgotPassword, resetPassword };
