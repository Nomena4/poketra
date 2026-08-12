const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'poketrako_receipts', // Folder name for receipts
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'pdf'],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('receipt'); // 'receipt' is the field name

module.exports = upload;
