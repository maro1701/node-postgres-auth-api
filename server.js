import express from 'express';
import authRoutes from './routes/auth.routes.js';
import todoRoutes from './routes/todo.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import 'dotenv/config';

const app = express();

app.use(express.json());

app.use((req,res,next)=>{
   console.log('1');
   next();
})

app.use('/auth',authRoutes);

app.use('/todos',todoRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT,()=>{console.log(`The server is running on ${PORT}`)});