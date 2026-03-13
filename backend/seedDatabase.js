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

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
// Mock location (Delhi)
const USER_LAT = 28.6139;
const USER_LNG = 77.2090;

const MEDICINE_NAMES = [
  'Paracetamol', 'Dolo 650', 'Crocin', 'Azithromycin', 'Augmentin', 'Metformin', 'Amoxicillin', 'Ibuprofen', 
  'Pantoprazole', 'Cetirizine', 'Atorvastatin', 'Aspirin', 'Omeprazole', 'Montelukast', 'Levocetirizine',
  'Amlodipine', 'Telmisartan', 'Vildagliptin', 'Metoprolol', 'Rosuvastatin', 'Glimepiride', 'Losartan',
  'Ramipril', 'Clopidogrel', 'Ciprofloxacin', 'Ofloxacin', 'Cefixime', 'Azithral', 'Pan-40', 'Omez',
  'Glycomet', 'Lipitor', 'Zantac', 'Nexium', 'Plavix', 'Singulair', 'Advair', 'Spiriva', 'Januvia', 'Humalog'
];

const CATEGORIES = [
  'Pain Relief', 'Antibiotics', 'Diabetes', 'Blood Pressure', 'Cold & Flu', 'Allergy', 'Digestive Health', 'Vitamins', 'Heart Health'
];

const BRANDS = ['Cipla', 'Sun Pharma', 'Dr. Reddys', 'Lupin', 'Abbott', 'GSK', 'Pfizer', 'Novartis', 'Sanofi', 'Alkem'];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Cleaning database...');
    await Order.deleteMany();
    await Inventory.deleteMany();
    await Pharmacy.deleteMany();
    await Medicine.deleteMany();
    await User.deleteMany();
    await PriceHistory.deleteMany();

    // 1. Fetch top 5 pharmacies (Mocking as we don't use external axios for this seed)
    let pharmacyData = [];
    console.log('Using mock pharmacy data for local seeding...');
    pharmacyData = [
      { name: 'Apollo Pharmacy Central', address: 'Connaught Place, Delhi', lat: 28.6327, lng: 77.2197, rating: 4.5, totalReviews: 120, googlePlaceId: 'mock_1' },
      { name: 'MedPlus Pharmacy', address: 'South Ext, Delhi', lat: 28.5684, lng: 77.2215, rating: 4.3, totalReviews: 85, googlePlaceId: 'mock_2' },
      { name: 'Guardian Pharmacy', address: 'Saket, Delhi', lat: 28.5245, lng: 77.2066, rating: 4.6, totalReviews: 210, googlePlaceId: 'mock_3' },
      { name: 'Netmeds Store', address: 'Rohini, Delhi', lat: 28.7041, lng: 77.1025, rating: 4.2, totalReviews: 65, googlePlaceId: 'mock_4' },
      { name: 'Wellness Forever', address: 'Dwarka, Delhi', lat: 28.5823, lng: 77.0500, rating: 4.4, totalReviews: 140, googlePlaceId: 'mock_5' }
    ];

    // 2. Create Users for Pharmacies
    console.log('Creating pharmacy users...');
    const pharmacyUsers = await Promise.all(pharmacyData.map(async (p, i) => {
      return await User.create({
        name: `${p.name} Admin`,
        email: `pharmacy${i+1}@medifind.com`,
        password: 'password123',
        role: 'pharmacy'
      });
    }));

    // 3. Create Pharmacies
    console.log('Inserting pharmacies into database...');
    const createdPharmacies = await Promise.all(pharmacyData.map(async (p, i) => {
      return await Pharmacy.create({
        user: pharmacyUsers[i]._id,
        name: p.name,
        address: p.address,
        location: { type: 'Point', coordinates: [p.lng, p.lat] },
        email: `contact@${p.name.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+91 ${9876500000 + i}`,
        rating: p.rating,
        numReviews: p.totalReviews,
        googlePlaceId: p.googlePlaceId,
        isTopRated: p.rating >= 4.4
      });
    }));

    // 4. Create 200 Medicines
    console.log('Generating 200 best-selling medicines...');
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
        description: `Highly effective ${cat.toLowerCase()} medicine used for treating common symptoms.`,
        dosage: `${dosage}mg`,
        image: `/images/meds/med_${(i % 10) + 1}.jpg`,
        mrp: Math.floor(Math.random() * (1200 - 20) + 20)
      });
    }
    const createdMedicines = await Medicine.insertMany(medicineDocs);

    // 5. Assign Medicines & Generate Inventory + Price History
    console.log('Generating inventory and price history...');
    const inventoryDocs = [];
    const historyDocs = [];
    const today = new Date();

    createdPharmacies.forEach((pharmacy, pIdx) => {
      // Each pharmacy gets ~40 unique medicines
      const startIndex = pIdx * 40;
      const pharmacyMeds = createdMedicines.slice(startIndex, startIndex + 40);

      pharmacyMeds.forEach(med => {
        const currentPrice = Math.floor(med.mrp * (0.8 + Math.random() * 0.2)); // 0-20% off MRP
        const discount = Math.floor(Math.random() * 21);

        inventoryDocs.push({
          pharmacy: pharmacy._id,
          medicine: med._id,
          price: currentPrice,
          stock: Math.floor(Math.random() * 191) + 10,
          discount: discount
        });

        // Generate 30 days of history
        for (let d = 0; d < 30; d++) {
          const date = new Date(today);
          date.setDate(today.getDate() - d);
          
          // Small fluctuations (+/- 5%)
          const historicalPrice = Math.floor(currentPrice * (0.95 + Math.random() * 0.1));
          
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

    console.log(`Seeding complete: 5 Pharmacies, 200 Medicines, ${inventoryDocs.length} Inventory items.`);
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
