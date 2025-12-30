import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import healthRoutes from './src/routes/health.js';
import pastesRoutes from './src/routes/pastes.js';
import { viewPasteHtml } from './src/controllers/pasteController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// Database connection
connectDB().then(() => {
  // Start server after successful connection
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

// Routes
app.get('/api/healthz', healthRoutes);
app.use('/api/pastes', pastesRoutes);
app.get('/api/paste/:id', viewPasteHtml);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
