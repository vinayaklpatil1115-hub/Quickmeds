import Cart from '../models/Cart.js';

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addItemToCart = async (req, res) => {
  const { medicine, pharmacy, qty } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // Check if medicine from same pharmacy already in cart
      const itemIndex = cart.cartItems.findIndex(
        (item) => item.medicine.toString() === medicine && item.pharmacy.toString() === pharmacy
      );

      if (itemIndex > -1) {
        // Update quantity
        cart.cartItems[itemIndex].qty += qty;
      } else {
        // Add new item
        cart.cartItems.push({ medicine, pharmacy, qty });
      }
      await cart.save();
    } else {
      // Create new cart
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [{ medicine, pharmacy, qty }],
      });
    }

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('cartItems.medicine', 'name image brand description mrp')
      .populate('cartItems.pharmacy', 'name address phone location');

    if (cart) {
      res.json(cart);
    } else {
      res.json({ cartItems: [] });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItemQty = async (req, res) => {
    const { qty } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            const item = cart.cartItems.id(req.params.id);
            if (item) {
                item.qty = qty;
                await cart.save();
                res.json(cart);
            } else {
                res.status(404).json({ message: 'Item not found in cart' });
            }
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        cart.cartItems = cart.cartItems.filter(item => item._id.toString() !== req.params.id);
        await cart.save();
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.cartItems = [];
            await cart.save();
            res.json({ message: 'Cart cleared' });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
