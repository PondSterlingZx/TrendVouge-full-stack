import express from 'express';
import { 
    saveSizeRecommendation, 
    getUserSizeRecommendation 
} from '../controllers/sizeRecommendationController.js';

const router = express.Router();

router.post('/save', saveSizeRecommendation);
router.get('/get', getUserSizeRecommendation);

export default router;