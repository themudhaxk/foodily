import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
// import uploadRoute from "./routes/uploadRoute.js"
import cloudinary from "cloudinary";

const addProduct = asyncHandler(async (req, res) => {
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
      console.log(`Processing image ${i + 1}/${images.length}`);
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    console.log("Uploaded image links:", imagesLinks);

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json("Product not found");
  }

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json("Product not found");
    }

    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
    }

    await Product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product is deleted.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Define an asynchronous handler for fetching products
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    // Define the number of products per page
    const pageSize = 6;

    // Extract the keyword from the request query if it exists, otherwise initialize an empty object
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    // Get the count of products matching the keyword criteria
    const count = await Product.countDocuments({ ...keyword });

    // Fetch products based on the keyword criteria and limit the result to the pageSize
    const products = await Product.find({ ...keyword }).limit(pageSize);

    // Send a JSON response with the fetched products, current page number, total pages, and a flag to indicate if there are more products
    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    // Log any errors that occurred during the process
    console.log(error);

    // Return a 404 status with an error message if products are not found
    return res.status(404).json({ error: "Product not found" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Product not found" });
  }
});

// Define an asynchronous handler for fetching all products
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find({})
      // .populate("category")  // Populate the 'category' field for each product with the actual category document
      // .limit(12)  // Limit the number of products to be fetched to 12
      .sort({ createAt: -1 }); // Sort the products in descending order based on the 'createAt' field

    // Return a JSON response with the fetched products and a 200 status code
    return res.status(200).json(products);
  } catch (error) {
    // Log any errors that occurred during the process
    console.log(error);

    // Return a 404 status with an error message if products are not found
    return res.status(404).json({ error: "Product not found" });
  }
});

// const fetchSellerProducts = asyncHandler(async (req, res) => {
//   try {
//     // Fetch all products from the database
//     const products = await Product.find({})
//       // .populate("category")  // Populate the 'category' field for each product with the actual category document
//       // .limit(12)  // Limit the number of products to be fetched to 12
//       .sort({ postBy: req.user._id }); // Sort the products in descending order based on the 'createAt' field

//     // Return a JSON response with the fetched products and a 200 status code
//     return res.status(200).json(products);
//   } catch (error) {
//     // Log any errors that occurred during the process
//     console.log(error);

//     // Return a 404 status with an error message if products are not found
//     return res.status(404).json({ error: "Product not found" });
//   }
// });

// Define an asynchronous handler for adding a product review
const addProductReview = asyncHandler(async (req, res) => {
  try {
    // Destructure 'rating' and 'comment' from the request body
    const { rating, comment } = req.body;

    // Find the product by ID from the database
    const product = await Product.findById(req.params.id);

    // Check if the product exists
    if (product) {
      // Check if the user has already reviewed the product
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        // If product is already reviewed by the user, send a 404 status and throw an error
        res.status(404);
        throw new Error("Product already reviewed");
      }

      // Create a new review object
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      // Add the new review to the product's reviews array
      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      // Calculate the average rating for the product
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      // Save the updated product with the new review
      await product.save();

      // Return a success response with a 201 status (Created) and a message
      res.status(201).json({ message: "Review added" });
    } else {
      // If the product is not found, send a 404 status and throw an error
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    // Log any errors that occurred during the process
    console.error(error);

    // Return a 400 status (Bad Request) and the error message in the response
    return res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error.message);
  }
});

// Define an asynchronous handler for filtering products based on certain criteria
const filterProducts = asyncHandler(async (req, res) => {
  try {
    // Destructure 'checked' and 'radio' arrays from the request body
    const { checked, radio } = req.body;

    // Initialize an empty object for filtering arguments
    let args = {};

    // Check if 'checked' array has elements, if so, add 'category' to the filter arguments
    if (checked.length > 0) args.category = checked;

    // Check if 'radio' array has elements, if so, add price range filter to the arguments
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    // Query the database to find products that match the filter arguments
    const products = await Product.find(args);

    // Respond with the filtered products in JSON format
    res.json(products);
  } catch (error) {
    // Log any errors that occurred during the process
    console.error(error);

    // Return a 500 status (Internal Server Error) and an error message in the response
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
