USE farmdirect;

-- Insert Categories
INSERT INTO categories (name, imageUrl) VALUES
  ('Fresh Vegetables', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&q=80'),
  ('Seasonal Fruits', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80'),
  ('Organic Produce', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80'),
  ('Dairy & Eggs', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80'),
  ('Herbs & Spices', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80')
ON DUPLICATE KEY UPDATE name=VALUES(name), imageUrl=VALUES(imageUrl);

-- Get IDs for the new categories
SET @vegetables_id = (SELECT id FROM categories WHERE name = 'Fresh Vegetables' LIMIT 1);
SET @fruits_id = (SELECT id FROM categories WHERE name = 'Seasonal Fruits' LIMIT 1);
SET @organic_id = (SELECT id FROM categories WHERE name = 'Organic Produce' LIMIT 1);
SET @dairy_id = (SELECT id FROM categories WHERE name = 'Dairy & Eggs' LIMIT 1);
SET @herbs_id = (SELECT id FROM categories WHERE name = 'Herbs & Spices' LIMIT 1);

-- Insert Fresh Vegetables
INSERT INTO groceries (name, description, price, imageUrl, categoryId, stock) VALUES
('Tomatoes', 'Fresh red tomatoes, perfect for cooking and salads', 40.00, 'https://images.unsplash.com/photo-1546470427-e9e826f9b49b?w=500&q=80', @vegetables_id, 200),
('Potatoes', 'Premium quality potatoes, ideal for various dishes', 30.00, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80', @vegetables_id, 300),
('Onions', 'Fresh red onions with excellent flavor', 25.00, 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&q=80', @vegetables_id, 250),
('Carrots', 'Crunchy and sweet carrots, rich in nutrients', 35.00, 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&q=80', @vegetables_id, 180),
('Spinach', 'Fresh green spinach leaves, packed with vitamins', 20.00, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80', @vegetables_id, 150);

-- Insert Seasonal Fruits
INSERT INTO groceries (name, description, price, imageUrl, categoryId, stock) VALUES
('Apples', 'Crisp and juicy red apples from local orchards', 80.00, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80', @fruits_id, 120),
('Bananas', 'Sweet and ripe bananas, perfect for snacking', 45.00, 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=500&q=80', @fruits_id, 200),
('Oranges', 'Fresh oranges bursting with vitamin C', 60.00, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500&q=80', @fruits_id, 150),
('Mangoes', 'Sweet and juicy seasonal mangoes', 120.00, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&q=80', @fruits_id, 80),
('Grapes', 'Seedless grapes, sweet and refreshing', 90.00, 'https://images.unsplash.com/photo-1537640538966-79f36943f303?w=500&q=80', @fruits_id, 100);

-- Insert Organic Produce
INSERT INTO groceries (name, description, price, imageUrl, categoryId, stock) VALUES
('Organic Tomatoes', 'Chemical-free organic tomatoes grown naturally', 60.00, 'https://images.unsplash.com/photo-1546470427-e9e826f9b49b?w=500&q=80', @organic_id, 100),
('Organic Spinach', 'Pesticide-free organic spinach leaves', 35.00, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80', @organic_id, 80),
('Organic Carrots', 'Naturally grown organic carrots', 50.00, 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&q=80', @organic_id, 90),
('Organic Lettuce', 'Fresh organic lettuce for healthy salads', 40.00, 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=500&q=80', @organic_id, 70);

-- Insert Dairy & Eggs
INSERT INTO groceries (name, description, price, imageUrl, categoryId, stock) VALUES
('Fresh Milk', 'Pure cow milk, fresh from local dairy farms', 55.00, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80', @dairy_id, 50),
('Farm Fresh Eggs', 'Free-range eggs from healthy chickens', 70.00, 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&q=80', @dairy_id, 120),
('Butter', 'Fresh homemade butter from farm cream', 120.00, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80', @dairy_id, 40),
('Cheese', 'Artisanal farm cheese, aged to perfection', 180.00, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&q=80', @dairy_id, 30);

-- Insert Herbs & Spices
INSERT INTO groceries (name, description, price, imageUrl, categoryId, stock) VALUES
('Fresh Coriander', 'Aromatic coriander leaves, freshly plucked', 15.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80', @herbs_id, 200),
('Curry Leaves', 'Fresh curry leaves for authentic flavor', 20.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80', @herbs_id, 150),
('Ginger', 'Fresh ginger root, perfect for cooking', 80.00, 'https://images.unsplash.com/photo-1618375569909-3c8616cf09ae?w=500&q=80', @herbs_id, 100),
('Garlic', 'Fresh garlic bulbs with strong aroma', 60.00, 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=500&q=80', @herbs_id, 120),
('Turmeric', 'Fresh turmeric root, natural and healthy', 40.00, 'https://images.unsplash.com/photo-1618375569909-3c8616cf09ae?w=500&q=80', @herbs_id, 80);
