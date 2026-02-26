-- Users: dealers and admins (JWT auth)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'DEALER') NOT NULL DEFAULT 'DEALER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auctions: created by admins, bid on by dealers
CREATE TABLE IF NOT EXISTS auctions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('DRAFT', 'OPEN', 'CLOSED') NOT NULL DEFAULT 'DRAFT',
  starting_price DECIMAL(14, 2) NOT NULL,
  current_price DECIMAL(14, 2) NOT NULL,
  end_time DATETIME NOT NULL,
  created_by INT NOT NULL,
  winner_user_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (winner_user_id) REFERENCES users(id)
);

-- Bids: one per dealer per auction (idempotency by idempotency_key)
CREATE TABLE IF NOT EXISTS bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  auction_id INT NOT NULL,
  dealer_id INT NOT NULL,
  amount DECIMAL(14, 2) NOT NULL,
  idempotency_key VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (auction_id) REFERENCES auctions(id),
  FOREIGN KEY (dealer_id) REFERENCES users(id),
  UNIQUE KEY uq_bid_idempotency (auction_id, dealer_id, idempotency_key)
);
