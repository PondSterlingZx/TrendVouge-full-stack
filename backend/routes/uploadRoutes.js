import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images allowed'));
  }
}).single('profilePicture');

router.post('/upload-photo', async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      await userModel.findByIdAndUpdate(req.user._id, { profilePicture: imageUrl });

      res.json({
        success: true,
        imageUrl,
        message: 'Profile picture updated successfully'
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;