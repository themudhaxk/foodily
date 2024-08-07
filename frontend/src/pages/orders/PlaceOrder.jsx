import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        couponCode: couponCode,
      }).unwrap();

      dispatch(clearCartItems());

      if (cart.paymentMethod === "PaymentOnDelivery") {
        navigate("/orderplacedsuccessfully");
      } else {
        navigate(`/order/${res._id}`);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await fetch(`/api/orders/apply-coupon/${couponCode}`);
      const data = await response.json();

      if (response.ok) {
        const { coupon } = data;
        setCouponDiscount(coupon.discount || 0);
        toast.success("Coupon applied successfully");
      } else {
        console.error("Failed to apply coupon");

        if (data.error === "Coupon has already been used by this user") {
          toast.error("Coupon has already been used by you");
        } else {
          toast.error("Failed to apply coupon");
        }
      }
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      toast.error("Failed to apply coupon:");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const calculateDiscountedPrice = (price) => {
    const discountedPrice = price - (price * couponDiscount) / 100;
    return discountedPrice.toFixed(2);
  };

  const itemsPrice = calculateDiscountedPrice(cart.itemsPrice);
  const shippingPrice = calculateDiscountedPrice(cart.shippingPrice);
  const taxPrice = calculateDiscountedPrice(cart.taxPrice);
  const totalPrice = calculateDiscountedPrice(cart.totalPrice);

  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <td className="px-1 py-2 text-2xl text-black text-left align-top">
                    Image
                  </td>
                  <td className="px-1 py-2 text-2xl text-black text-left">
                    Product
                  </td>
                  <td className="px-1 py-2 text-2xl text-black text-left">
                    Quantity
                  </td>
                  <td className="px-1 py-2 text-2xl text-black text-left">
                    Price
                  </td>
                  <td className="px-1 py-2 text-2xl text-black text-left">
                    Total
                  </td>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 text-xl">
                      <img
                        src={item.images[0]?.url}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="p-2 text-xl text-black">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </td>
                    <td className="p-2 text-xl text-black">{item.qty}</td>
                    <td className="p-2 text-xl text-black">
                      {formatPrice(calculateDiscountedPrice(item.price))}
                    </td>
                    <td className="p-2 text-xl text-black">
                      {formatPrice(
                        item.qty * calculateDiscountedPrice(item.price)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl text-black font-semibold mb-5">
            Order Summary
          </h2>
          <div className="flex justify-between flex-wrap p-8 bg-[#181818]">
            <ul className="text-lg">
              <li>
                <span className="font-semibold text-2xl mb-4">Items:</span>{" "}
                {formatPrice(itemsPrice)}
              </li>
              <li>
                <span className="font-semibold text-2xl mb-4">Shipping:</span>{" "}
                {formatPrice(shippingPrice)}
              </li>
              <li>
                <span className="font-semibold text-2xl mb-4">Tax:</span>{" "}
                {formatPrice(taxPrice)}
              </li>
              <li>
                <span className="font-semibold text-2xl mb-4">Total:</span>{" "}
                {formatPrice(totalPrice)}
              </li>
            </ul>

            <div className="mt-8">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border p-2 mr-2"
              />
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-full text-lg"
                onClick={handleApplyCoupon}
              >
                Apply Coupon
              </button>
            </div>

            {error && <Message variant="danger">{error.data.message}</Message>}

            <div>
              <h2 className="text-3xl font-semibold mb-4">Shipping</h2>
              <p className="text-xl">
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
              <p className="text-xl">
                <strong>Method:</strong> {cart.paymentMethod}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
            disabled={cart.cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
