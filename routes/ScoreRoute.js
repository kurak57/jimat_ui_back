import express from 'express';
import { 
    getScores, 
    getScoreById, 
    updateScore, 
    deleteScore, 
    createScore 
} from '../controllers/Scores.js';
import { verifyUser } from '../middleware/AuthUser.js';
import { AvgFakMbkm, AvgUiMbkm } from '../controllers/ScoresAvg.js';

const router = express.Router();

router.get('/scores', verifyUser, getScores);
router.get('/scores/:id',verifyUser, getScoreById);
router.get('/scores/:id/fakultas', verifyUser, AvgFakMbkm);
router.get('/scores/:id/univ', verifyUser, AvgUiMbkm);
router.post('/scores',verifyUser, createScore);
router.patch('/scores/:id', verifyUser, updateScore);
router.delete('/scores/:id', verifyUser, deleteScore);

export default router;