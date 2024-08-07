import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Coupon name is required"],
    },
    // product: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Product",
    //   required: [true, "Coupon must belong to a product"],
    // },
    usedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    expire: {
      type: Date,
      required: [true, "Coupon expiration date is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value is required"],
      // min: [5, "Minimum discount value is 5"],
      max: [10, "Maximum discount value is 10"],
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
