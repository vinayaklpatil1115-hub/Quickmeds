import User from '../models/User.js';
import Order from '../models/Order.js';
import Pharmacy from '../models/Pharmacy.js';
import Medicine from '../models/Medicine.js';
import Coupon from '../models/Coupon.js';

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAdminAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const popularMedicines = await Order.aggregate([
        { $unwind: '$orderItems' },
        { $group: { _id: '$orderItems.medicine', count: { $sum: '$orderItems.qty' }, name: { $first: '$orderItems.name' } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);
    const activeUsers = await User.countDocuments();
    const activePharmacies = await Pharmacy.countDocuments();

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
      popularMedicines,
      activeUsers,
      activePharmacies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manage coupons
// @route   POST /api/admin/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
    const { code, discountPercentage, expirationDate } = req.body;
    try {
        const coupon = await Coupon.create({ code, discountPercentage, expirationDate });
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
