import express from 'express';
import mongoose from 'mongoose';
import connectMongo from './database/MongoDB'
import cors from 'cors';
import corsOptions from './config/corsOptions';
import bodyParser from 'body-parser';
import accountRoutes from './routes/AccountRoutes'
import scheduleRoutes from './routes/ScheduleRoutes'

const app = express();
const PORT = 5000;
app.use(cors(corsOptions));
app.use(bodyParser.json());
connectMongo();

app.use("/api/account", accountRoutes);
app.use("/api/schedule", scheduleRoutes);

async function gracefulExit() {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
}

process.on('exit', gracefulExit);
process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);

mongoose.connection.once('open', () => {
  app.listen(PORT, () =>
    console.log(`start listening on port : ${PORT}`));
});