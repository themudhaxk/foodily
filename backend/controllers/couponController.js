import Coupon from "../models/couponModel.js";

// @desc    CREATE a Coupon
// @route   POST /api/coupons
// @access  Private (Admin)
const createCoupon = async (req, res) => {
  try {
    const { name, expire, discount } = req.body;
    const coupon = new Coupon({ name, expire, discount });
    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    GET All Coupons
// @route   GET /api/coupons
// @access  Private (Admin)
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    GET Single Coupon
// @route   GET /api/coupons/:id
// @access  Private (Admin)
const getSingleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    UPDATE Single Coupon
// @route   PATCH /api/coupons/:id
// @access  Private (Admin)
const updateSingleCoupon = async (req, res) => {
  try {
    const { name, expire, discount } = req.body;
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }
    coupon.name = name;
    // coupon.product = product;
    coupon.expire = expire;
    coupon.discount = discount;
    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    DELETE Single Coupon
// @route   DELETE /api/coupons/:id
// @access  Private (Admin)
const deleteSingleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      res.status(404).json({ error: "Coupon not found" });
      return;
    }
    await coupon.remove();
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateSingleCoupon,
  deleteSingleCoupon,
};
