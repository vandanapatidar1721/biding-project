## Backend Overview

This backend implements a real-time auction system with:

- **Node.js + TypeScript** on Express
- **PostgreSQL** as the SQL database
- **Redis** for Pub/Sub to broadcast WebSocket events
- **JWT authentication** with **RBAC** (roles `ADMIN` and `DEALER`)
- **Transactional bidding engine** using **database transactions** and **row-level locking**
- **Swagger docs** at `/docs`

### Main Features

- **Authentication**: `/api/auth/signup`, `/api/auth/login` (JWT-based).
- **RBAC**:
  - Only `ADMIN` can create/start/close auctions.
  - Only `DEALER` can place bids.
- **Bidding engine**:
  - Each bid runs inside a DB transaction.
  - Uses `SELECT ... FOR UPDATE` on the auction row to guarantee row-level locking.
  - Enforces **strictly higher** bid amounts than the current price.
  - Rejects negative bids, bids below current price, and bids on closed/expired auctions.
  - Uses an `idempotencyKey` per bid to safely handle double-clicks.
- **WebSockets**:
  - All connections require a valid JWT (socket handshake).
  - Clients join an `auction:{id}` room via the `join_auction` event.
  - Bid events are published to Redis (`auction.{id}.bids`) and broadcast to the room.

### Run locally (without Docker)

```bash
cd backend
npm install
npm run dev
```

The server runs on `http://localhost:4000`.

- Health check: `GET /health`
- API docs: `GET /docs`

### Run with Docker Compose

```bash
cd backend
docker-compose up --build
```

This starts PostgreSQL, Redis, and the backend service.

