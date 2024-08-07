import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import cloudinary from "cloudinary";

const createCategory = asyncHandler(async (req, res) => {
  try {
    // Log the received data for debugging
    console.log("Received request body:", req.body);

    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    // Log the images array for debugging
    console.log("Images array:", images);

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      try {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "categories",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      } catch (uploadError) {
        console.error(`Failed to upload image ${i + 1}:`, uploadError);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    console.log("Uploaded image links:", imagesLinks);

    const existingCategory = await Category.findOne({ name: req.body.name });

    if (existingCategory) {
      return res.json({ error: "Category already exists" });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(400).json({ error: "Error creating category" });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    // Log the received data for debugging
    console.log("Received request body:", req.body);

    const { categoryId } = req.params;
    let category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    // Log the images array for debugging
    console.log("Images array:", images);

    if (images !== undefined) {
      // Deleting images associated with the category
      for (let i = 0; i < category.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          category.images[i].public_id
        );
      }

      let imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "categories",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      console.log("Uploaded image links:", imagesLinks);

      category.name = req.body.name;
      req.body.images = imagesLinks;
    }

    const updatedCategory = {
      name: req.body.name,
      images: req.body.images,
    };

    category = await Category.findByIdAndUpdate(categoryId, updatedCategory, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const removedCategory = await Category.findByIdAndDelete(
      req.params.categoryId
    );
    res.json(removedCategory);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Category not found" });
  }
});

const listCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Category not found" });
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Category not found" });
  }
});

const fetchProductsByCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    // Assuming you have a Product model
    const products = await Product.find({ category: categoryId });
    res.json(products);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategories,
  readCategory,
  fetchProductsByCategory,
};
