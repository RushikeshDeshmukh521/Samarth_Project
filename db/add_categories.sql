USE farmdirect;

-- Insert missing categories
INSERT INTO categories (name) VALUES ('Fruits'), ('Vegetables'), ('Dairy')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Get IDs
SET @fruits_id = (SELECT id FROM categories WHERE name = 'Fruits' LIMIT 1);
SET @veg_id    = (SELECT id FROM categories WHERE name = 'Vegetables' LIMIT 1);
SET @dairy_id  = (SELECT id FROM categories WHERE name = 'Dairy' LIMIT 1);

-- Fruits products
INSERT INTO groceries (name, description, price, imageUrl, categoryId, stock) VALUES
('Banana - Organic', 'Sweet and fresh organic bananas, rich in potassium', 49.00, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&q=80', @fruits_id, 300),
('Mango - Alphonso', 'Premium Alphonso mangos from Ratnagiri, king of fruits', 350.00, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80', @fruits_id, 80),
('Apple - Shimla', 'Fresh and crunchy Shimla apples, naturally sweet', 180.00, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80', @fruits_id, 200),
('Grapes - Black', 'Juicy black seedless grapes, perfect for snacking', 120.00, 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=500&q=80', @fruits_id, 150),
('Watermelon', 'Farm-fresh whole watermelon, sweet and hydrating', 80.00, 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=500&q=80', @fruits_id, 60)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Vegetables products
INSERT INTO groceries (name, description, price, imageUrl, categoryId, stock) VALUES
('Tomato - Fresh', 'Ripe, red farm-fresh tomatoes for cooking and salads', 40.00, 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&q=80', @veg_id, 500),
('Potato - White', 'Fresh white potatoes, perfect for curries and fries', 30.00, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80', @veg_id, 600),
('Onion - Red', 'Pungent red onions, a kitchen essential', 35.00, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&q=80', @veg_id, 700),
('Spinach - Palak', 'Fresh green spinach leaves, iron-rich superfood', 25.00, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80', @veg_id, 400),
('Carrot - Orange', 'Crunchy fresh carrots, great for juicing and cooking', 50.00, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80', @veg_id, 350),
('Capsicum - Mixed', 'Colourful mix of red, yellow and green capsicums', 90.00, 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80', @veg_id, 200)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Dairy products
INSERT INTO groceries (name, description, price, imageUrl, categoryId, stock) VALUES
('Amul Tazza Milk 1L', 'Fresh pasteurised full-cream milk from Amul', 68.00, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80', @dairy_id, 800),
('Paneer - Fresh', 'Soft and fresh cottage cheese, 200g block', 80.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80', @dairy_id, 300),
('Curd - Dahi 1kg', 'Thick and creamy set curd, probiotic-rich', 65.00, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80', @dairy_id, 400),
('Butter - Amul', 'Classic Amul salted butter, 100g pack', 55.00, 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=500&q=80', @dairy_id, 600),
('Cheese Slices', 'Amul processed cheese slices, pack of 10', 110.00, 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=500&q=80', @dairy_id, 250)
ON DUPLICATE KEY UPDATE name=VALUES(name);
