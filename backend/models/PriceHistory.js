import mongoose from 'mongoose';

const priceHistorySchema = mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);

export default PriceHistory;
