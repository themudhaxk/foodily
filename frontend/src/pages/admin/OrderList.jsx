import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <table className="container mx-auto">
          <AdminMenu />

          <thead className="w-full border">
            <tr className="mb-[5rem]">
              <th className="text-left pl-1 text-black text-2xl">ITEMS</th>
              <th className="text-left pl-1 text-black text-2xl">ID</th>
              <th className="text-left pl-1 text-black text-2xl">USER</th>
              <th className="text-left pl-1 text-black text-2xl">DATE</th>
              <th className="text-left pl-1 text-black text-2xl">TOTAL</th>
              <th className="text-left pl-1 text-black text-2xl">PAID</th>
              <th className="text-left pl-1 text-black text-2xl">OFD</th>
              <th className="text-left pl-1 text-black text-2xl">DELIVERED</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <img
                    src={order.orderItems[0]?.images[0]?.url}
                    alt={order._id}
                    className="w-[5rem] pt-4"
                  />
                </td>
                <td className="text-black text-2xl">{order._id}</td>

                <td className="text-black text-2xl">{order.user ? order.user.username : "N/A"}</td>

                <td className="text-black text-2xl">
                  {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                </td>

                <td className="text-black text-2xl">₦{order.totalPrice}</td>

                <td className="py-2">
                  {order.isPaid ? (
                    <p className="p-1 text-center text-xl bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center text-xl bg-red-400 w-[6rem] rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="px-2 py-2">
                  {order.isOutForDelivery ? (
                    <p className="p-1 text-center text-xl bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center text-xl bg-red-400 w-[6rem] rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="px-2 py-2">
                  {order.isDelivered ? (
                    <p className="p-1 text-center text-xl bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center text-xl bg-red-400 w-[6rem] rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td>
                  <Link to={`/order/${order._id}`}>
                    <button className="text-pink-600 text-2xl">More</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default OrderList;
