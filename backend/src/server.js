import 'dotenv/config';
import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 5001;

// Only start the server if not running in a serverless environment like Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const startServer = async () => {
        try {
            await prisma.$connect();
            console.log('✅ PostgreSQL connected via Prisma');
            app.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
            });
        } catch (error) {
            console.error('❌ Failed to connect to database:', error.message);
            process.exit(1);
        }
    };
    startServer();
}

export default app;
