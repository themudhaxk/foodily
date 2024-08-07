import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    // like: { 
    //   type: String, 
    //   required: true, 
    //   enum: ["like", "dislike"]
    // },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // description: { type: String, required: true },
    // image: { type: String, required: true},
    // images: [{ type: String }],
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
    // brand: { type: String, required: true },
    color: { type: [String] },
    // size: { type: [String] },
    quantity: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    // subcategories: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    // ],
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
