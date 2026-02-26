import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import { runMigrations } from './db/migrate';
import authRoutes from './routes/auth';
import auctionRoutes from './routes/auctions';
import bidsRoutes from './routes/bids';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import YAML from 'yamljs';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: '*',
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/auctions/:id/bids', bidsRoutes);

const openapiPath = path.join(__dirname, 'docs', 'openapi.yaml');
const swaggerDocument = YAML.load(openapiPath);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export async function initApp(): Promise<void> {
  await runMigrations();
}

