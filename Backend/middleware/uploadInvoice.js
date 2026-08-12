const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Local storage fallback + Cloudinary setup
const uploadsDir = process.env.USER_DATA_PATH 
  ? path.join(process.env.USER_DATA_PATH, 'uploads', 'invoices')
  : path.join(__dirname, '..', 'uploads', 'invoices');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'invoice-' + uniqueSuffix + ext);
  }
});

const uploadInvoice = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Formats acceptés : PDF, PNG, JPG, WEBP'));
    }
  }
}).single('attachment');

module.exports = uploadInvoice;
