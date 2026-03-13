import mongoose from 'mongoose';

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true
    },
    cartItems: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Medicine',
        },
        pharmacy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Pharmacy',
        },
        qty: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
