const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.item', 'name price image category stock isActive');

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    // Filter out inactive items
    cart.items = cart.items.filter(cartItem => 
      cartItem.item && cartItem.item.isActive
    );

    // Recalculate totals if items were filtered
    await cart.save();

    res.json({
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', [auth], [
  body('itemId').isMongoId().withMessage('Invalid item ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { itemId, quantity } = req.body;

    // Check if item exists and is active
    const item = await Item.findById(itemId);
    if (!item || !item.isActive) {
      return res.status(404).json({ message: 'Item not found or unavailable' });
    }

    // Check stock availability
    if (item.stock < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Only ${item.stock} items available` 
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.item.toString() === itemId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > item.stock) {
        return res.status(400).json({ 
          message: `Cannot add ${quantity} more items. Maximum available: ${item.stock - cart.items[existingItemIndex].quantity}` 
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = item.price; // Update price in case it changed
    } else {
      // Add new item
      cart.items.push({
        item: itemId,
        quantity,
        price: item.price
      });
    }

    await cart.save();
    
    // Populate the cart for response
    await cart.populate('items.item', 'name price image category stock isActive');

    res.json({
      message: 'Item added to cart successfully',
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    res.status(500).json({ message: 'Server error while adding item to cart' });
  }
});

// @route   PUT /api/cart/update
// @desc    Update item quantity in cart
// @access  Private
router.put('/update', [auth], [
  body('itemId').isMongoId().withMessage('Invalid item ID'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be non-negative')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (quantity === 0) {
      // Remove item from cart
      await cart.removeItem(itemId);
    } else {
      // Check stock availability
      const item = await Item.findById(itemId);
      if (!item || !item.isActive) {
        return res.status(404).json({ message: 'Item not found or unavailable' });
      }

      if (item.stock < quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock. Only ${item.stock} items available` 
        });
      }

      await cart.updateItemQuantity(itemId, quantity);
    }

    // Populate the cart for response
    await cart.populate('items.item', 'name price image category stock isActive');

    res.json({
      message: 'Cart updated successfully',
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    res.status(500).json({ message: 'Server error while updating cart' });
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.removeItem(itemId);
    
    // Populate the cart for response
    await cart.populate('items.item', 'name price image category stock isActive');

    res.json({
      message: 'Item removed from cart successfully',
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        totalItems: cart.totalItems,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    res.status(500).json({ message: 'Server error while removing item from cart' });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await cart.clearCart();

    res.json({
      message: 'Cart cleared successfully',
      cart: {
        id: cart._id,
        items: [],
        totalAmount: 0,
        totalItems: 0,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
});

module.exports = router;