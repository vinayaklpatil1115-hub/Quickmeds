import Pharmacy from '../models/Pharmacy.js';
import Inventory from '../models/Inventory.js';
import Order from '../models/Order.js';

// @desc    Get top rated pharmacies
// @route   GET /api/pharmacies/top
// @access  Public
export const getTopPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ isTopRated: true })
      .sort({ rating: -1, numReviews: -1 })
      .limit(5);
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby pharmacies
// @route   GET /api/pharmacies/nearby
// @access  Public
export const getNearbyPharmacies = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    
    if (!lat || !lng) {
      // Return all if no location provided
      const pharmacies = await Pharmacy.find({}).limit(10);
      return res.json(pharmacies);
    }

    const pharmacies = await Pharmacy.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius)
        }
      }
    }).limit(10);
    
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single pharmacy and its inventory
// @route   GET /api/pharmacies/:id
// @access  Public
export const getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }
    const inventory = await Inventory.find({ pharmacy: pharmacy._id }).populate('medicine');
    res.json({ pharmacy, inventory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register pharmacy profile
// @route   POST /api/pharmacies
// @access  Private/Pharmacy
export const registerPharmacy = async (req, res) => {
  const { name, address, location, phone, email } = req.body;
  try {
    const pharmacyExists = await Pharmacy.findOne({ email });
    if (pharmacyExists) {
      return res.status(400).json({ message: 'Pharmacy already exists' });
    }
    const pharmacy = await Pharmacy.create({
      user: req.user._id,
      name,
      address,
      location,
      phone,
      email,
    });
    res.status(201).json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update pharmacy inventory
// @route   POST /api/pharmacies/inventory
// @access  Private/Pharmacy
export const updateInventory = async (req, res) => {
  const { medicine, price, stock, discount } = req.body;
  try {
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy profile not found' });
    }
    let item = await Inventory.findOne({ pharmacy: pharmacy._id, medicine });
    if (item) {
      item.price = price || item.price;
      item.stock = stock || item.stock;
      item.discount = discount !== undefined ? discount : item.discount;
      await item.save();
    } else {
      item = await Inventory.create({
        pharmacy: pharmacy._id,
        medicine,
        price,
        stock,
        discount,
      });
    }
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pharmacy orders
// @route   GET /api/pharmacies/orders
// @access  Private/Pharmacy
export const getPharmacyOrders = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy profile not found' });
    }
    const orders = await Order.find({ 'orderItems.pharmacy': pharmacy._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
