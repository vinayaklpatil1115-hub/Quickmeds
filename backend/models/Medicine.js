import mongoose from 'mongoose';

const priceHistorySchema = mongoose.Schema({
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const medicineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    genericName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    symptoms: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
      required: true,
      default: '/images/sample-medicine.jpg',
    },
    description: {
      type: String,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    priceHistory: [priceHistorySchema],
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
