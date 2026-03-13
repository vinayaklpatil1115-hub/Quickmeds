import mongoose from 'mongoose';

const inventorySchema = mongoose.Schema(
  {
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Pharmacy',
    },
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Medicine',
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
