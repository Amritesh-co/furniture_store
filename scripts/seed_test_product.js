import connectDB from './lib/mongodb.js';
import Product from './lib/models/Product.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
  await connectDB();
  const prod = await Product.create({
    name: 'TEST PRODUCT FOR DELETION',
    price: 999,
    description: 'This is a test product to be deleted by the browser subagent.',
    category: 'Sofas',
    material: 'Test Material',
    dimensions: '1x1x1',
    stock: 10,
    images: ['https://via.placeholder.com/150'],
    isFeatured: false
  });
  console.log('Created test product:', prod._id);
  mongoose.connection.close();
}
seed().catch(console.error);
