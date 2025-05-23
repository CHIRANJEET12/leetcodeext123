import express, { Request, Response } from 'express';
const router = express.Router();
import generateContent from '../service/aiservice';


router.post('/ask', async (req: Request, res: Response): Promise<any> => {
    try {
        const { messages } = req.body;
        if (!Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid or missing messages array' });
        }
        const prompt = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
        //use of join: ["user: Hello", "assistant: Hi!", "user: What's 2 + 2?"]

        const response = await generateContent([{ sender: 'user', text: prompt }]);
        res.json({ response });
    } catch (error) {
        console.error('AI error:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
});

export default router;
