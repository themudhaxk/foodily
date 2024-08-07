import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/userApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading: salesLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: customersLoading } = useGetUsersQuery();
  const { data: orders, isLoading: ordersLoading } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: "area",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "black",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setChartData((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="w-[80%] flex justify-around flex-wrap">
          <div className="rounded-lg bg-green-600 p-5 w-[20rem] mt-5">
            <div className="font-bold text-2xl rounded-full w-[3rem] bg-pink-500 text-center p-3">
              ₦
            </div>
            <p className="mt-5 text-2xl">Sales</p>
            <h1 className="text-3xl font-bold">
              ₦ {salesLoading ? <Loader /> : sales?.totalSales.toFixed(2)}
            </h1>
          </div>
          <div className="rounded-lg bg-green-600 p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3 text-2xl">
              ₦
            </div>
            <p className="mt-5 text-2xl">Customers</p>
            <h1 className="text-3xl font-bold">
               {customersLoading ? <Loader /> : customers?.length}
            </h1>
          </div>
          <div className="rounded-lg bg-green-600 p-5 w-[20rem] mt-5 text-2xl">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3 text-2xl">
              ₦
            </div>
            <p className="mt-5">All Orders</p>
            <h1 className="text-3xl font-bold">
               {ordersLoading ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        <div className="ml-[10rem] mt-[4rem]">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="area"
            width="70%"
          />
        </div>

        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
