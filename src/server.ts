import express from 'express';
import userRouter from '@/routes/user.routes';
import customerRouter from '@/routes/customer.routes';
import categoryRouter from '@/routes/category.routes';
import locationRouter from '@/routes/location.routes';
import manufacturerRouter from '@/routes/manufacturer.routes';
import productRouter from '@/routes/product.routes';
import stockRouter from '@/routes/stock.routes';
import saleRouter from '@/routes/sale.routes';
import returnRouter from '@/routes/return.routes';
import supplierRouter from '@/routes/supplier.routes';
import unitOfMeasureRouter from '@/routes/unitOfMeasure.routes';
import purchaseOrderRouter from '@/routes/purchaseOrder.routes';
import { errorHandler } from '@/middleware/errorHandler.middleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  // Replace with your actual frontend URL in production
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true, // <-- THIS IS ESSENTIAL
}));

// Routes
app.use('/api/auth', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/customers', customerRouter);
app.use('/api/locations', locationRouter);
app.use('/api/manufacturers', manufacturerRouter);
app.use('/api/products', productRouter);
app.use('/api/purchase-orders', purchaseOrderRouter);
app.use('/api/returns', returnRouter);
app.use('/api/sales', saleRouter);
app.use('/api/stock', stockRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/units', unitOfMeasureRouter);

// Central error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});