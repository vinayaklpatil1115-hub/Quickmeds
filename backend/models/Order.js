import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
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
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
      }
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discount: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'packed', 'out for delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryType: {
        type: String,
        enum: ['Standard Delivery', 'Express Delivery (1 hour)'],
        default: 'Standard Delivery'
    },
    deliveredAt: {
      type: Date,
    },
    prescriptionUrl: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
