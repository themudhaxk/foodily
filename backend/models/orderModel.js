import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        images: [
          {
            public_id: {
              type: String,
              required: true,
            },
            url: {
              type: String,
              required: true,
            },
          },
        ],
        price: {
            type: Number,
            set: function (val) {
              // Custom setter to convert string with commas to a number
              if (typeof val === 'string') {
                return parseFloat(val.replace(/,/g, ''));
              }
              return val;
            }
          },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    coupon: {
      type: String,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["PaymentOnDelivery", "FlutterWave"]//
    },

    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
      phone_number: { type: String }, //
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    // taxPrice: {
    //   type: Number,
    //   required: true,
    //   default: 0.0,
    // },

    shippingPrice: {
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

    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },

    isOutForDelivery: {
        type: Boolean,
        required: true,
        default: false,
    },

    outForDeliveryAt: {
      type: Date,
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
