import express from 'express';
import router from './routes/chat';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


app.use('/ai', router);
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
