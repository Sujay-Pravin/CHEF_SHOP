import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables first
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Rest of the imports
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

// Import routes after environment variables are loaded
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import paymentRouter from './routes/PaymentRoute.js';
import promoRouter from './routes/promoRoute.js';

//app config
const app = express()
const port = process.env.PORT || 4000


// middleware
app.use(express.json());
app.use(cors());


// DB config
connectDB();

// API Endpoints

app.use("/api/food",foodRouter);
app.use("/images",express.static("uploads"));
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/payment", paymentRouter);
app.use('/api/promo', promoRouter);

app.get("/",(req,res)=>{
    res.send("API working")
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)    
})

