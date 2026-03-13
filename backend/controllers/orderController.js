import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';
import Pharmacy from '../models/Pharmacy.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    couponCode,
    deliveryType
  } = req.body;

  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    } else {
      let discount = 0;
      
      // Automatic discounts
      if (itemsPrice >= 2000) {
        discount = itemsPrice * 0.15;
      } else if (itemsPrice >= 1000) {
        discount = itemsPrice * 0.10;
      } else if (itemsPrice >= 500) {
        discount = itemsPrice * 0.05;
      }

      // Coupon discount
      if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
        if (coupon) {
            discount += (itemsPrice * coupon.discountPercentage) / 100;
        } else if (couponCode === 'LOYAL20') {
            // Check if user actually has this coupon
            const user = await User.findById(req.user._id);
            if (user.coupons.includes('LOYAL20')) {
                discount += (itemsPrice * 20) / 100;
                // Remove coupon after use? Let's say yes for now
                user.coupons = user.coupons.filter(c => c !== 'LOYAL20');
                await user.save();
            }
        }
      }

      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discount,
        totalPrice: totalPrice - discount,
        deliveryType,
        status: 'pending',
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'pending' : 'completed' // Mocking immediate completion for GPay/PhonePe
      });

      const createdOrder = await order.save();

      // Loyalty Tracking
      if (itemsPrice >= 200) {
        const user = await User.findById(req.user._id);
        user.loyaltyOrderCount += 1;
        if (user.loyaltyOrderCount >= 5) {
            if (!user.coupons.includes('LOYAL20')) {
                user.coupons.push('LOYAL20');
            }
            user.loyaltyOrderCount = 0; // Reset after giving reward
        }
        await user.save();
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'confirmed';
      // Mock payment result
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin or Pharmacy
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      if (req.body.status === 'delivered') {
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
