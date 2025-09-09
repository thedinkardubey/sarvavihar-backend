const mongoose = require('mongoose');
const Item = require('./models/Item');
const User = require('./models/User');
require('dotenv').config();

const sampleItems = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 16599,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    stock: 50,
    tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
    rating: 4.5,
    reviewCount: 128
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt available in multiple colors.',
    price: 2499,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    stock: 100,
    tags: ['organic', 'cotton', 'sustainable', 'casual'],
    rating: 4.2,
    reviewCount: 89
  },
  {
    name: 'JavaScript: The Definitive Guide',
    description: 'Comprehensive guide to JavaScript programming for beginners and experts.',
    price: 4149,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop',
    stock: 25,
    tags: ['javascript', 'programming', 'web development', 'guide'],
    rating: 4.7,
    reviewCount: 203
  },
  {
    name: 'Smart Home Security Camera',
    description: '1080p HD security camera with night vision and mobile app control.',
    price: 7469,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    stock: 30,
    tags: ['security', 'camera', 'smart home', '1080p'],
    rating: 4.3,
    reviewCount: 156
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip premium yoga mat with extra cushioning for comfortable practice.',
    price: 3319,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
    stock: 75,
    tags: ['yoga', 'fitness', 'exercise', 'mat'],
    rating: 4.4,
    reviewCount: 92
  },
  {
    name: 'Ceramic Plant Pot Set',
    description: 'Beautiful set of 3 ceramic plant pots with drainage holes and saucers.',
    price: 2079,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop',
    stock: 40,
    tags: ['plants', 'ceramic', 'home decor', 'garden'],
    rating: 4.1,
    reviewCount: 67
  },
  {
    name: 'Natural Face Moisturizer',
    description: 'Hydrating face moisturizer with natural ingredients for all skin types.',
    price: 2904,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    stock: 60,
    tags: ['skincare', 'moisturizer', 'natural', 'beauty'],
    rating: 4.6,
    reviewCount: 134
  },
  {
    name: 'Educational Building Blocks',
    description: 'Colorful building blocks set that promotes creativity and learning for kids.',
    price: 1659,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1558877385-1c2d7b8e7b7a?w=300&h=300&fit=crop',
    stock: 80,
    tags: ['educational', 'toys', 'kids', 'building'],
    rating: 4.8,
    reviewCount: 245
  },
  {
    name: 'Gourmet Coffee Beans',
    description: 'Premium single-origin coffee beans roasted to perfection.',
    price: 1410,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
    stock: 120,
    tags: ['coffee', 'gourmet', 'beans', 'premium'],
    rating: 4.5,
    reviewCount: 178
  },
  {
    name: 'Wireless Phone Charger',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 2079,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1609592806596-4b8e1b5e8b7a?w=300&h=300&fit=crop',
    stock: 90,
    tags: ['wireless', 'charger', 'phone', 'qi'],
    rating: 4.2,
    reviewCount: 98
  },
  {
    name: 'Denim Jacket Classic',
    description: 'Timeless denim jacket with a modern fit and vintage wash.',
    price: 6639,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
    stock: 45,
    tags: ['denim', 'jacket', 'classic', 'vintage'],
    rating: 4.3,
    reviewCount: 112
  },
  {
    name: 'Cookbook: Healthy Meals',
    description: 'Collection of 100+ healthy and delicious recipes for everyday cooking.',
    price: 2323,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
    stock: 35,
    tags: ['cookbook', 'healthy', 'recipes', 'cooking'],
    rating: 4.4,
    reviewCount: 87
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches for gaming and typing.',
    price: 10789,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop',
    stock: 25,
    tags: ['gaming', 'keyboard', 'mechanical', 'rgb'],
    rating: 4.6,
    reviewCount: 189
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight running shoes with advanced cushioning and breathable mesh.',
    price: 12449,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    stock: 60,
    tags: ['running', 'shoes', 'sports', 'lightweight'],
    rating: 4.7,
    reviewCount: 234
  },
  {
    name: 'Leather Wallet Minimalist',
    description: 'Slim leather wallet with RFID blocking and multiple card slots.',
    price: 3817,
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    stock: 85,
    tags: ['wallet', 'leather', 'minimalist', 'rfid'],
    rating: 4.3,
    reviewCount: 156
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle that keeps drinks cold for 24h or hot for 12h.',
    price: 2738,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
    stock: 120,
    tags: ['water bottle', 'insulated', 'stainless steel', 'eco-friendly'],
    rating: 4.5,
    reviewCount: 298
  },
  {
    name: 'Vintage Sunglasses',
    description: 'Classic aviator sunglasses with UV protection and polarized lenses.',
    price: 7469,
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
    stock: 40,
    tags: ['sunglasses', 'vintage', 'aviator', 'uv protection'],
    rating: 4.4,
    reviewCount: 167
  },
  {
    name: 'Scented Candle Set',
    description: 'Set of 3 luxury scented candles with lavender, vanilla, and eucalyptus.',
    price: 2406,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1602874801006-2bd9c2f3c4b4?w=300&h=300&fit=crop',
    stock: 70,
    tags: ['candles', 'scented', 'luxury', 'aromatherapy'],
    rating: 4.2,
    reviewCount: 143
  },
  {
    name: 'Protein Powder Vanilla',
    description: 'High-quality whey protein powder with 25g protein per serving.',
    price: 4564,
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&h=300&fit=crop',
    stock: 95,
    tags: ['protein', 'supplement', 'fitness', 'vanilla'],
    rating: 4.6,
    reviewCount: 312
  },
  {
    name: 'Wooden Cutting Board',
    description: 'Large bamboo cutting board with juice groove and non-slip feet.',
    price: 3070,
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop',
    stock: 55,
    tags: ['cutting board', 'bamboo', 'kitchen', 'eco-friendly'],
    rating: 4.5,
    reviewCount: 189
  },
  {
    name: 'Bluetooth Speaker Portable',
    description: 'Waterproof portable speaker with 360-degree sound and 20-hour battery.',
    price: 6639,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    stock: 45,
    tags: ['bluetooth', 'speaker', 'portable', 'waterproof'],
    rating: 4.4,
    reviewCount: 201
  },
  {
    name: 'Cotton Bed Sheets Set',
    description: 'Soft 100% cotton bed sheets set with deep pockets and wrinkle resistance.',
    price: 5809,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=300&fit=crop',
    stock: 30,
    tags: ['bed sheets', 'cotton', 'bedding', 'comfortable'],
    rating: 4.3,
    reviewCount: 124
  },
  {
    name: 'Digital Drawing Tablet',
    description: 'Professional drawing tablet with pressure-sensitive stylus for digital art.',
    price: 16599,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
    stock: 20,
    tags: ['drawing tablet', 'digital art', 'stylus', 'creative'],
    rating: 4.7,
    reviewCount: 156
  },
  {
    name: 'Green Tea Organic',
    description: 'Premium organic green tea leaves with antioxidants and natural flavor.',
    price: 1576,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop',
    stock: 150,
    tags: ['green tea', 'organic', 'antioxidants', 'healthy'],
    rating: 4.5,
    reviewCount: 267
  },
  {
    name: 'Fitness Resistance Bands',
    description: 'Set of 5 resistance bands with different strengths for full-body workouts.',
    price: 2079,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    stock: 100,
    tags: ['resistance bands', 'fitness', 'workout', 'exercise'],
    rating: 4.4,
    reviewCount: 198
  },
  {
    name: 'Essential Oil Diffuser',
    description: 'Ultrasonic aromatherapy diffuser with LED lights and timer settings.',
    price: 3568,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&h=300&fit=crop',
    stock: 65,
    tags: ['diffuser', 'aromatherapy', 'essential oils', 'wellness'],
    rating: 4.3,
    reviewCount: 145
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Insert sample items
    await Item.insertMany(sampleItems);
    console.log(`Inserted ${sampleItems.length} sample items`);

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const adminUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      await adminUser.save();
      console.log('Created admin user (email: admin@example.com, password: admin123)');
    }

    // Create test user if it doesn't exist
    const testUserExists = await User.findOne({ email: 'user@example.com' });
    if (!testUserExists) {
      const testUser = new User({
        username: 'testuser',
        email: 'user@example.com',
        password: 'user123',
        role: 'user'
      });
      await testUser.save();
      console.log('Created test user (email: user@example.com, password: user123)');
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();