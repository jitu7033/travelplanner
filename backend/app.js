// backend/app.js
import express from 'express';
import cors from 'cors';
import { formatName } from '../shared/utils.js';
import useRoutes from './routes/user.routes.js';
import tripRoutes from './routes/tripPlanner.routes.js';
import hotelRoutes from './routes/hotel.routes.js'
import ratingRoutes from './routes/rating.routes.js'
import adminRoutes from './routes/admin.routes.js'
import menueRoutes from './routes/menu.routes.js';
import blogRRoutes from './routes/blog.routes.js';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// app.use(cors({
//   origin : 'https://3124-152-59-83-203.ngrok-free.app'
// }))

// middleware
app.use(express.json());

// Routes
app.use('/api/signUp', useRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/hotels',hotelRoutes);
app.use('/api/rating',ratingRoutes);
app.use('/api/register-admin',adminRoutes);
app.use('/api/hotels/menu',menueRoutes);
app.use('/api/blogs',blogRRoutes);


app.listen(3000, () => console.log(`Server is running on port https,${PORT}`));