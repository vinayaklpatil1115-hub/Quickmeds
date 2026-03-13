import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { users, medicines } from './data/mockData.js';
import User from './models/User.js';
import Medicine from './models/Medicine.js';
import Pharmacy from './models/Pharmacy.js';
import Inventory from './models/Inventory.js';
import Order from './models/Order.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Inventory.deleteMany();
    await Pharmacy.deleteMany();
    await Medicine.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const pharmacyUser = createdUsers[1]._id;

    const sampleMedicines = medicines.map((med) => {
      return { ...med };
    });

    const createdMedicines = await Medicine.insertMany(sampleMedicines);
    
    // Create a pharmacy linked to the pharmacy user
    const pharmacy = await Pharmacy.create({
        user: pharmacyUser,
        name: 'Apollo Pharmacy Central',
        address: '123 Health St, Medical District',
        location: {
            type: 'Point',
            coordinates: [77.2090, 28.6139] // Delhi coords roughly
        },
        phone: '0987654321',
        email: 'apollo@medifind.com',
        rating: 4.5,
        numReviews: 12
    });

    // Add inventory for the pharmacy
    const inventories = createdMedicines.map((med) => {
        return {
            pharmacy: pharmacy._id,
            medicine: med._id,
            price: med.mrp - (med.mrp * 0.1), // 10% discount
            discount: 10,
            stock: 100
        }
    });

    await Inventory.insertMany(inventories);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Inventory.deleteMany();
    await Pharmacy.deleteMany();
    await Medicine.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
