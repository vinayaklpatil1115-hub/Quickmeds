import Medicine from '../models/Medicine.js';
import Inventory from '../models/Inventory.js';
import Pharmacy from '../models/Pharmacy.js';
import PriceHistory from '../models/PriceHistory.js';

// @desc    Get medicine suggestions for auto-complete
// @route   GET /api/medicines/suggestions
// @access  Public
export const getMedicineSuggestions = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const suggestions = await Medicine.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { genericName: { $regex: query, $options: 'i' } }
      ]
    })
    .select('name genericName brand')
    .limit(10);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bestseller medicines
// @route   GET /api/medicines/bestsellers
// @access  Public
export const getBestsellerMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({}).limit(10); // Simple logic for bestseller
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch all medicines
// @route   GET /api/medicines
// @access  Public
export const getMedicines = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { brand: { $regex: req.query.keyword, $options: 'i' } },
            { genericName: { $regex: req.query.keyword, $options: 'i' } },
            { symptoms: { $regex: req.query.keyword, $options: 'i' } },
            { category: { $regex: req.query.keyword, $options: 'i' } }
          ],
        }
      : {};

    const medicines = await Medicine.find({ ...keyword });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single medicine
// @route   GET /api/medicines/:id
// @access  Public
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
      res.json(medicine);
    } else {
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pharmacy inventory for a medicine
// @route   GET /api/medicines/:id/inventory
// @access  Public
export const getMedicineInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find({ medicine: req.params.id }).populate('pharmacy', 'name address location rating numReviews');
        
        // Return sorted by price (cheapest first)
        const sortedInventory = inventory.sort((a, b) => a.price - b.price);
        res.json(sortedInventory);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get generic alternatives and recommended medicines
// @route   GET /api/medicines/:id/recommended
// @access  Public
export const getRecommendedMedicines = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }

        // Generic Alternatives: Same genericName, different brand
        const genericAlternatives = await Medicine.find({
            genericName: medicine.genericName,
            _id: { $ne: medicine._id }
        }).limit(5);

        // Similar Medicines: Same category, different genericName
        const similarMedicines = await Medicine.find({
            category: medicine.category,
            genericName: { $ne: medicine.genericName },
            _id: { $ne: medicine._id }
        }).limit(5);

        res.json({
            genericAlternatives,
            similarMedicines
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get price history for a medicine
// @route   GET /api/medicines/:id/history
// @access  Public
export const getMedicinePriceHistory = async (req, res) => {
    try {
        const history = await PriceHistory.find({ medicine: req.params.id })
            .sort({ date: 1 })
            .limit(30);
        
        // Group by date and get average price if multiple pharmacies have entries
        const groupedHistory = history.reduce((acc, curr) => {
            const dateStr = curr.date.toISOString().split('T')[0];
            if (!acc[dateStr]) {
                acc[dateStr] = { date: dateStr, price: 0, count: 0 };
            }
            acc[dateStr].price += curr.price;
            acc[dateStr].count += 1;
            return acc;
        }, {});

        const result = Object.values(groupedHistory).map(item => ({
            name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: Math.round(item.price / item.count)
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
