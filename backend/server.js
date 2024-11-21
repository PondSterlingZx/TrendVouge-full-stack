import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import fs from 'fs' // Add this import
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true })
}

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Initialize connections
const initializeApp = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Connect to Cloudinary
        await connectCloudinary();

        // Middlewares
        app.use(express.json({ limit: '50mb' }));
        app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        app.use(cors());
        
        // Serve static files from uploads directory (remove the duplicate line)
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

        // API endpoints
        app.use('/api/user', userRouter);
        app.use('/api/product', productRouter);
        app.use('/api/cart', cartRouter);
        app.use('/api/order', orderRouter);

        // Health check endpoint
        app.get('/', (req, res) => {
            res.json({ 
                status: 'healthy',
                message: "API Working",
                timestamp: new Date().toISOString()
            });
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({
                success: false,
                message: 'Something went wrong!',
                error: process.env.NODE_ENV === 'development' ? err.message : null
            });
        });

        // Start server
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
            console.log(`📁 Upload directory: ${uploadsDir}`);
        });

    } catch (error) {
        console.error('Failed to initialize app:', error);
        process.exit(1);
    }
};

// Start the application
initializeApp();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});