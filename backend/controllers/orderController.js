import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Coupon from "../models/couponModel.js";
// import axios from "axios";

// Utility Function
function calcPrices(orderItems, discountedItemPrice = null) {
  const itemsPrice = orderItems.reduce((acc, item) => {
    const priceString = String(item.price);
    const price = parseFloat(priceString.replace(/,/g, ""));

    if (isNaN(price)) {
      throw new Error(`Invalid price for item: ${item.name}`);
    }

    return acc + price * item.qty;
  }, 0);

  const shippingPrice = itemsPrice > 100000 ? 1085 : 870;
  const totalPrice =
    discountedItemPrice !== null
      ? discountedItemPrice + shippingPrice
      : itemsPrice + shippingPrice;

  return {
    itemsPrice,
    shippingPrice,
    totalPrice,
  };
}

// Apply Coupon Discount
const applyCouponDiscount = async (req, res) => {
  const { couponCode } = req.params;

  try {
    if (!couponCode) {
      throw new Error("Coupon code is required");
    }

    const coupon = await Coupon.findOne({ name: couponCode });

    if (!coupon) {
      throw new Error("Invalid coupon");
    }

    // Check if the coupon has already been used by the current user
    if (coupon.usedBy && coupon.usedBy.equals(req.user._id)) {
      throw new Error("Coupon has already been used by this user");
    }

    // Respond with coupon details (e.g., discount percentage)
    res.json({ coupon });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems
      .map((itemFromClient) => {
        const matchingItemFromDB = itemsFromDB.find(
          (itemDB) => itemDB._id.toString() === itemFromClient._id
        );

        if (!matchingItemFromDB) {
          return null; // Product not found, will be filtered out later
        }

        return {
          ...itemFromClient,
          product: itemFromClient._id,
          price: matchingItemFromDB.price,
        };
      })
      .filter(Boolean); // Filter out null items (product not found)

    const itemsPrice = dbOrderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    let discountedItemPrice = itemsPrice; // Initialize with total items price

    // Apply coupon discount if couponCode is provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ name: couponCode });

      if (coupon) {
        // Check if the coupon has already been used by the current user
        if (coupon.usedBy && coupon.usedBy.equals(req.user._id)) {
          throw new Error("Coupon has already been used by this user");
        }

        // Calculate discounted price based on coupon details (e.g., percentage)
        discountedItemPrice = itemsPrice * (1 - coupon.discount / 100);

        // Mark the coupon as used by the current user
        coupon.usedBy = req.user._id;
        await coupon.save();
      }
    }

    const { shippingPrice, totalPrice } = calcPrices(
      dbOrderItems,
      discountedItemPrice
    );

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice: discountedItemPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
      coupon: couponCode, // Store coupon code in the order
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $sort: {
          paidAt: 1 // Sort by paidAt field in ascending order (1 for ascending, -1 for descending)
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPay = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      // Add payment result if needed
      // order.paymentResult = { ... };
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsOutForDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isOutForDelivery = true;
      order.outForDeliveryAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  markOrderAsOutForDelivery,
  applyCouponDiscount,
  markOrderAsPay,
};
