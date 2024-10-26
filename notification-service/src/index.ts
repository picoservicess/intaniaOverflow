import dotenv from 'dotenv';
import express, { Application } from 'express';
import mongoose from 'mongoose';

import { main as startMQ } from './mq';
import notificationRouter from './routes/notifications';

dotenv.config();

const app: Application = express();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE_URL as string);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

app.use('/notifications', notificationRouter);

// Start the server
const port = process.env.PORT || 5002;
app.listen(port, () => console.log(`Server started on port ${port}`));

// Start RabbitMQ connection and message processing
startMQ().catch((error) => {
    console.error('❌ Failed to start RabbitMQ:', error);
    process.exit(1);
});
