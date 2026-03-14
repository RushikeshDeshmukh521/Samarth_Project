-- MySQL Schema for FarmDirect
-- Run: mysql -u root -p farmdirect < schema.sql

CREATE DATABASE IF NOT EXISTS farmdirect;
USE farmdirect;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  imageUrl VARCHAR(500)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'deliveryboy') DEFAULT 'user',
  phone VARCHAR(20),
  address JSON,
  isVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE groceries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  imageUrl VARCHAR(500),
  categoryId INT,
  stock INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'picked', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  address JSON NOT NULL,
  paymentStatus ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  deliveryBoyId INT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (deliveryBoyId) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  groceryId INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (groceryId) REFERENCES groceries(id)
);

CREATE TABLE delivery_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL UNIQUE,
  deliveryBoyId INT NOT NULL,
  status ENUM('pending', 'accepted', 'completed') DEFAULT 'pending',
  assignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (deliveryBoyId) REFERENCES users(id)
);

CREATE TABLE chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT UNIQUE NOT NULL,
  userId INT NOT NULL,
  deliveryBoyId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (deliveryBoyId) REFERENCES users(id)
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chatId INT NOT NULL,
  senderId INT NOT NULL,
  receiverType ENUM('user', 'deliveryboy', 'ai') NOT NULL,
  content TEXT NOT NULL,
  isAIMessage BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chatId) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (senderId) REFERENCES users(id)
);

-- Sample data
INSERT INTO categories (name) VALUES ('Fruits'), ('Vegetables'), ('Dairy');

INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$hash', 'admin'),
('Delivery Boy', 'delivery@example.com', '$2a$10$hash', 'deliveryboy');
