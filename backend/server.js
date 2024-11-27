import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import sizeRecommendationRouter from './routes/sizeRecommendationRoute.js';
import reviewRouter from "./routes/reviewRoute.js";
import wishlistRouter from './routes/wishlistRoute.js'
import notifyRouter from './routes/notifyRoute.js';
import profileRouter from './routes/profileRoute.js';

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/size-recommendation', sizeRecommendationRouter)
app.use("/api/review", reviewRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/notify', notifyRouter);
app.use('/api/profile', profileRouter);

app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))