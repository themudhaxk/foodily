import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useOutForDeliveryOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  usePaidOrderMutation,
} from "../../redux/api/orderApiSlice";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { MonnifyButton, MonnifyConsumer } from "react-monnify";

// const PUBLIC_KEY = 'FLUTTERWAVE_PUBLIC_KEY'

const Order = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [paidOrder, { isLoading: loadingPaid }] = usePaidOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const [outForDelivery, { isLoading: loadingOutForDelivery }] =
    useOutForDeliveryOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  // function onApprove(data, actions) {
  //   return actions.order.capture().then(async function (details) {
  //     try {
  //       await payOrder({ orderId, details });
  //       refetch();
  //       toast.success("Order is paid");
  //     } catch (error) {
  //       toast.error(error?.data?.message || error.message);
  //     }
  //   });
  // }

  // function createOrder(data, actions) {
  //   return actions.order
  //     .create({
  //       purchase_units: [{ amount: { value: order.totalPrice } }],
  //     })
  //     .then((orderID) => {
  //       return orderID;
  //     });
  // }

  const payHandler = async () => {
    const paymentDetails = {
      id: "payment_id_here",
      status: "success",
      update_time: new Date().toISOString(),
      payer: {
        email_address: userInfo.email,
      },
    };

    try {
      await paidOrder({ orderId, details: paymentDetails });
      toast.success("Payment successful!");
      refetch();

      // Navigate to payment successful page
      // navigate("/paymentsuccessful");

      // Automatically redirect to payment successful page after 10 seconds
      setTimeout(() => {
        navigate("/orderplacedsuccessfully");
      }, 10000); // 10000 milliseconds = 10 seconds
    } catch (error) {
      toast.error("Payment failed. Please try again!");
      console.error(error);
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      toast.success("Order delivered successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to mark order as delivered. Please try again!");
      console.error(error);
    }
  };

  const outForDeliveryHandler = async () => {
    try {
      await outForDelivery(orderId);
      toast.success("Order out for delivery successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to mark order as delivered. Please try again!");
      console.error(error);
    }
  };

  const paidHandler = async () => {
    try {
      await payOrder({ orderId });
      toast.success("Order marked as paid successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to mark order as delivered. Please try again!");
      console.error(error);
    }
  };

  //Flutterwave
  const config = {
    public_key: "FLWPUBK_TEST-3651c7c0b54de1f3cd4b0d2f5d29cc64-X",
    tx_ref: Date.now(),
    amount: order && order.totalPrice ? order.totalPrice : 0,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: userInfo.email,
      phone_number: userInfo.phone_number,
      name: userInfo.username,
    },
    customizations: {
      title: "PickNShop",
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const fwConfig = {
    ...config,
    text: "Pay Now With Flutterwave",
    // text: "Pay Now With Flutterwave",
    callback: (response) => {
      console.log(response);
      closePaymentModal();
      payHandler();
    },
    onClose: () => {},
  };

  //Monnify
  const monnifyConfig = {
    reference: orderId,
    amount: order && order.totalPrice ? order.totalPrice : 0,
    currency: "NGN",
    customerName: userInfo.username,
    customerEmail: userInfo.email,
    customerPhoneNumber: userInfo.phone_number,
    apiKey: "MK_TEST_XPC7E22QY4",
    contractCode: "5703920421",
    paymentDescription: "PickNShop",
    isTestMode: true,
    text: "Pay Now With Monnify",
    onSuccess: (response) => {
      console.log("Payment successful:", response);
      payHandler();
      refetch();
    },
    onError: (error) => {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again!");
    },
    onClose: () => {},
    onLoadStart: () => {
      <Loader />
      console.log("loading has started");
    },
    onLoadComplete: () => {
      console.log("SDK is UP");
      <h1>Loading Complete</h1>
    },
  };

  console.log("User email:", userInfo.email);
  console.log("User name:", userInfo.username);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto text-black">
              <table className="w-[80%] text-black">
                <thead className="border-b-2 text-black">
                  <tr>
                    <th className="p-2 text-black">Image</th>
                    <th className="p-2 text-black">Product</th>
                    <th className="p-2 text-black text-center">Quantity</th>
                    <th className="p-2 text-black">Unit Price</th>
                    <th className="p-2 text-black">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.images[0]?.url}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2 text-black">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-black text-center">{item.qty}</td>
                      <td className="p-2 text-black text-center">{item.price}</td>
                      <td className="p-2 text-black text-center">
                        ₦{(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-2xl text-black font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4 text-black">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>

          <p className="mb-4 text-black">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-4 text-black">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>

          <p className="mb-4 text-black">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>

          <p className="mb-4 text-black">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.paymentMethod}
          </p>
          <div className="mb-3">
            {order.isPaid ? (
              <Message variant="success">Paid on {order.paidAt}</Message>
            ) : (
              <Message variant="danger">Not paid</Message>
            )}
          </div>
          <div className="mb-3">
            {order.isOutForDelivery ? (
              <Message variant="success">
                Out for delivery on {order.outForDeliveryAt}
              </Message>
            ) : (
              <Message variant="danger">Not Out for delivery</Message>
            )}
          </div>
          <div>
            {order.isDelivered ? (
              <Message variant="success">
                Delivered on {order.deliveredAt}
              </Message>
            ) : (
              <Message variant="danger">Not Delivered</Message>
            )}
          </div>
        </div>

        <h2 className="text-2xl text-black font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span className="text-black">Items</span>
          <span className="text-black">₦ {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-black">Coupon</span>
          <span className="text-black">{order.coupon}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-black">Shipping</span>
          <span className="text-black">₦ {order.shippingPrice}</span>
        </div>
        {/* <div className="flex justify-between mb-2">
          <span className="text-black">Tax</span>
          <span className="text-black">₦ {order.taxPrice}</span>
        </div> */}
        <div className="flex justify-between mb-2">
          <span className="text-black">Total</span>
          <span className="text-black">₦ {order.totalPrice}</span>
        </div>

        {!order.isPaid && order.paymentMethod !== "PaymentOnDelivery" && (
          <div>
            {loadingPaid && <Loader /> ? (
              <Loader />
            ) : (
              <div>
                <div>
                  <FlutterWaveButton
                    {...fwConfig}
                    className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
                    // createOrder={createOrder}
                    // onApprove={onApprove}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {!order.isPaid && order.paymentMethod !== "PaymentOnDelivery" && (
          <div>
            {loadingPaid && <Loader /> ? (
              <Loader />
            ) : (
              <div>
                <div>
                  <MonnifyButton
                    {...monnifyConfig}
                    className="hidden bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {loadingOutForDelivery && <Loader />}
        {userInfo &&
          userInfo.isAdmin &&
          order.paymentMethod === "PaymentOnDelivery" &&
          !order.isOutForDelivery && (
            <div>
              <button
                type="button"
                className="bg-blue-500 text-white w-full py-2 mb-5"
                onClick={outForDeliveryHandler}
              >
                Mark As Out Delivery
              </button>
            </div>
          )}

        {loadingOutForDelivery && <Loader />}
        {userInfo &&
          userInfo.isAdmin &&
          order.isPaid &&
          !order.isOutForDelivery && (
            <div>
              <button
                type="button"
                className="bg-blue-500 text-white w-full py-2 mb-5"
                onClick={outForDeliveryHandler}
              >
                Mark As Out Delivery
              </button>
            </div>
          )}

        {loadingDeliver && <Loader />}
        {userInfo &&
          userInfo.isAdmin &&
          order.paymentMethod === "PaymentOnDelivery" &&
          order.isOutForDelivery &&
          !order.isDelivered && (
            <div>
              <button
                type="button"
                className="bg-green-500 text-white w-full py-2"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          )}

        {loadingDeliver && <Loader />}
        {userInfo &&
          userInfo.isAdmin &&
          order.isPaid &&
          order.isOutForDelivery &&
          !order.isDelivered && (
            <div>
              <button
                type="button"
                className="bg-green-500 text-white w-full py-2"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          )}
        {loadingPay && <Loader />}
        {userInfo &&
          userInfo.isAdmin &&
          !order.isPaid &&
          order.isOutForDelivery &&
          order.isDelivered &&
          // !order.isPaid &&
          order.paymentMethod === "PaymentOnDelivery" && (
            <div>
              <button
                type="button"
                className="bg-pink-500 text-white w-full py-2"
                onClick={paidHandler}
              >
                Mark As Paid
              </button>
            </div>
          )}
      </div>
      <div>
        <MonnifyConsumer apiKey="MK_TEST_XPC7E22QY4">
          {({ initializePayment }) => (
            <button onClick={() => initializePayment()}>
              {/* Monnify Consumer Implementation */}
            </button>
          )}
        </MonnifyConsumer>
      </div>
    </div>
  );
};

export default Order;
