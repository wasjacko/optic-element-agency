import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Restrict in production
}));
app.use(express.json());

// Routes
app.use('/api', router);

// Health Check
app.get('/', (req, res) => {
    res.send('Booking API is running');
});

// Start Server
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
