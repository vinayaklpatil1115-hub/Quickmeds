import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Medicine from './models/Medicine.js';
import Pharmacy from './models/Pharmacy.js';
import Inventory from './models/Inventory.js';
import Order from './models/Order.js';
import PriceHistory from './models/PriceHistory.js';

dotenv.config();

const PHARMACIES = [
  { name: 'Omkar Medical Store', address: 'Market Yard, Pune', lat: 18.4895, lng: 73.8682, phone: '+91 9822011111', rating: 4.8 },
  { name: 'Vinyak Medical Store', address: 'Kothrud, Pune', lat: 18.5074, lng: 73.8077, phone: '+91 9822022222', rating: 4.6 },
  { name: 'Darshan Medical Store', address: 'Baner, Pune', lat: 18.5590, lng: 73.7799, phone: '+91 9822033333', rating: 4.7 },
  { name: 'Suraj Medical Store', address: 'Hinjewadi, Pune', lat: 18.5913, lng: 73.7389, phone: '+91 9822044444', rating: 4.5 },
  { name: 'Pajji Medical Store', address: 'Viman Nagar, Pune', lat: 18.5679, lng: 73.9143, phone: '+91 9822055555', rating: 4.9 }
];

const MEDICINE_NAMES = [
  'Paracetamol', 'Dolo 650', 'Crocin', 'Azithromycin', 'Augmentin', 'Metformin', 'Amoxicillin', 'Ibuprofen', 
  'Pantoprazole', 'Cetirizine', 'Atorvastatin', 'Aspirin', 'Omeprazole', 'Montelukast', 'Levocetirizine',
  'Amlodipine', 'Telmisartan', 'Vildagliptin', 'Metoprolol', 'Rosuvastatin', 'Glimepiride', 'Losartan',
  'Ramipril', 'Clopidogrel', 'Ciprofloxacin', 'Ofloxacin', 'Cefixime', 'Azithral', 'Pan-40', 'Omez',
  'Glycomet', 'Lipitor', 'Zantac', 'Nexium', 'Plavix', 'Singulair', 'Advair', 'Spiriva', 'Januvia', 'Humalog',
  'Combiflam', 'Saridon', 'Vicks Action 500', 'Limcee', 'Zincovit', 'Neurobion Forte', 'Liv 52', 'Cystone', 'Septilin', 'Confido'
];

const CATEGORIES = [
  'Pain Relief', 'Antibiotics', 'Diabetes', 'Blood Pressure', 'Cold & Flu', 'Allergy', 'Digestive Health', 'Vitamins', 'Heart Health'
];

const BRANDS = ['Cipla', 'Sun Pharma', 'Dr. Reddys', 'Lupin', 'Abbott', 'GSK', 'Pfizer', 'Novartis', 'Sanofi', 'Alkem'];

const seedFinal = async () => {
  try {
    console.log('--- START SEEDING ---');
    console.log('Connecting to database with URI:', process.env.MONGO_URI);
    await connectDB();
    console.log('Database connected successfully.');
    
    console.log('Cleaning database...');
    await Promise.all([
      Order.deleteMany(),
      Inventory.deleteMany(),
      Pharmacy.deleteMany(),
      Medicine.deleteMany(),
      User.deleteMany(),
      PriceHistory.deleteMany()
    ]);
    console.log('Database cleaned.');

    // 1. Create Users
    console.log('Creating users...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@medifind.com',
      password: 'password123',
      role: 'admin'
    });

    const pharmacyUsers = await Promise.all(PHARMACIES.map(async (p, i) => {
      return await User.create({
        name: `${p.name} Admin`,
        email: `store${i+1}@medifind.com`,
        password: 'password123',
        role: 'pharmacy'
      });
    }));

    // 2. Create Pharmacies
    console.log('Inserting pharmacies...');
    const createdPharmacies = await Promise.all(PHARMACIES.map(async (p, i) => {
      return await Pharmacy.create({
        user: pharmacyUsers[i]._id,
        name: p.name,
        address: p.address,
        location: { type: 'Point', coordinates: [p.lng, p.lat] },
        email: `contact@${p.name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: p.phone,
        rating: p.rating,
        numReviews: Math.floor(Math.random() * 500) + 50,
        isTopRated: p.rating >= 4.7
      });
    }));

    // 3. Create 200 Medicines
    console.log('Generating 200 medicines...');
    const medicineDocs = [];
    for (let i = 1; i <= 200; i++) {
      const baseName = MEDICINE_NAMES[i % MEDICINE_NAMES.length];
      const dosage = [50, 100, 250, 500, 650][Math.floor(Math.random() * 5)];
      const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
      
      medicineDocs.push({
        name: `${baseName} ${dosage}mg`,
        brand: brand,
        genericName: baseName,
        category: cat,
        description: `High-quality ${cat.toLowerCase()} medicine for effective treatment.`,
        dosage: `${dosage}mg`,
        image: `/images/meds/med_${(i % 10) + 1}.jpg`,
        mrp: Math.floor(Math.random() * (1200 - 20) + 20)
      });
    }
    const createdMedicines = await Medicine.insertMany(medicineDocs);

    // 4. Create Inventory & Price History
    console.log('Generating inventory...');
    const inventoryDocs = [];
    const historyDocs = [];
    const today = new Date();

    createdPharmacies.forEach((pharmacy) => {
      // Each pharmacy gets ~150 random medicines from the 200
      const shuffledMeds = [...createdMedicines].sort(() => 0.5 - Math.random());
      const pharmacyMeds = shuffledMeds.slice(0, 150);

      pharmacyMeds.forEach(med => {
        const discount = Math.floor(Math.random() * 21); // 0-20%
        const price = Math.floor(med.mrp * (1 - discount/100));

        inventoryDocs.push({
          pharmacy: pharmacy._id,
          medicine: med._id,
          price: price,
          stock: Math.floor(Math.random() * 191) + 10,
          discount: discount
        });

        // Generate 30 days of history
        for (let d = 0; d < 30; d++) {
          const date = new Date(today);
          date.setDate(today.getDate() - d);
          const historicalPrice = Math.floor(price * (0.95 + Math.random() * 0.1));
          historyDocs.push({
            medicine: med._id,
            pharmacy: pharmacy._id,
            price: historicalPrice,
            date: date
          });
        }
      });
    });

    await Inventory.insertMany(inventoryDocs);
    await PriceHistory.insertMany(historyDocs);

    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedFinal();
