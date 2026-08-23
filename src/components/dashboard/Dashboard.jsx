"use client";

import {useNotify} from "@/hooks/useNotify";
import React, {useEffect, useState} from "react";
import "./dashboard.modules.scss";
import BookingDistribution from "./dashboardChart";
import {useGetDashboardStats} from "@/hooks/dashboard/GetDashboardStats";
import {useGetDashboardCategoriesStats} from "@/hooks/dashboard/GetDashboardCategoriesStats";
import CarServiceSkeleton from "./DashboardLoading";
import NotFound from "../notfound/NotFound";
import {useRouter} from "next/navigation";
import ProductsTable from "../products/ProductsTable";
import {useGetDashboardLowStock} from "@/hooks/dashboard/GetDashboardCategoriesLowStock";
import "../products/products.modules.scss";
import {useGetPickUpStats} from "@/hooks/dashboard/GetPickupStats";
import PickupTable from "./PickUpTable";

const Dashboard = () => {
  const {notice} = useNotify();
  const {data, error, isPending} = useGetDashboardStats();
  const [pickupList, setPickUpList] = useState([]);
  const {
    data: pickupData,
    error: pickupError,
    isPending: pickupPending,
  } = useGetPickUpStats();

  useEffect(() => {
    if (pickupData) {
      const filter = pickupData?.data?.map(({name, productsCount}) => {
        return {name, totalStock: productsCount};
      });
      setPickUpList(filter);
    }
  }, [pickupData]);

  const route = useRouter();
  const {
    data: categoryStats,
    error: categoryError,
    isPending: categoryPending,
  } = useGetDashboardCategoriesStats();

  const [pieData, setPieData] = useState({});

  useEffect(() => {
    if (categoryStats) {
      setPieData(categoryStats?.data);
    }
  }, [categoryStats]);
  useEffect(() => {
    if (error?.message || categoryError?.message) {
      notice({
        text: `${error?.message} ${categoryError?.message}`,
        status: "error",
        time: 5000,
      });
      route.refresh();
    }
  }, [error, categoryError]);

  useEffect(() => {
    notice({
      stop: "true",
    });
  }, []);

  const {
    data: lowStockData,
    isPending: lowStockPending,
    error: lowStockError,
  } = useGetDashboardLowStock();
  const [dataTable, setDataTable] = useState(null);

  useEffect(() => {
    setDataTable({
      data: {
        items: lowStockData?.data,
      },
    });
  }, [lowStockData]);

  useEffect(() => {
    if (lowStockError?.message) {
      notice({
        text: `${lowStockError?.message}`,
        status: "error",
        time: 5000,
      });
      route.refresh();
    }
  }, [lowStockError]);

  const [lowStockDrop, setLowStockDrop] = useState(false);
  const [pickDrop, setPickDrop] = useState(false);

  return (
    <div className="dashboard container">
      {data && categoryStats && !isPending && !categoryPending && dataTable ? (
        <>
          <div className="dashboard__top">
            <h2 className="dashboard__title">Welcome To Car Service</h2>
            <p className="dashboard__tit-sub">
              Here is what happening with your money today
            </p>
          </div>
          <div className="dashboard__center">
            <div className="dashboard__center-l">
              <BookingDistribution
                title={categoryStats?.message}
                data={pieData}
              />
              <BookingDistribution
                subtitle={"City categories"}
                title={pickupData?.message}
                data={pickupList}
              />
            </div>
            <div className="dashboard__cen-stats">
              <div className="dashboard__cen-stats-items">
                <p className="dashboard__censts-title">Products</p>
                <ul className="dashboard__censts-ul">
                  <li className="dashboard__censts-list">
                    Total:
                    <span className="dashboard__censts-span">
                      {data?.data?.products?.total || 0}
                    </span>
                  </li>
                  <li className="dashboard__censts-list">
                    Active:
                    <span className="dashboard__censts-span">
                      {data?.data?.products?.active || 0}
                    </span>
                  </li>
                  <li className="dashboard__censts-list">
                    Inactive:
                    <span className="dashboard__censts-span">
                      {data?.data?.products?.inactive || 0}
                    </span>
                  </li>
                  <li className="dashboard__censts-list">
                    Out of stock:
                    <span className="dashboard__censts-span">
                      {data?.data?.products?.outOfStock || 0}
                    </span>
                  </li>
                  <li className="dashboard__censts-list">
                    Low stock:
                    <span className="dashboard__censts-span">
                      {data?.data?.products?.lowStock || 0}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="dashboard__cen-stats-items">
                <p className="dashboard__censts-title">Categories</p>
                <ul className="dashboard__censts-ul">
                  <li className="dashboard__censts-list">
                    Total:
                    <span className="dashboard__censts-span">
                      {data?.data?.categories?.total || 0}
                    </span>
                  </li>
                  <li className="dashboard__censts-list">
                    Active:
                    <span className="dashboard__censts-span">
                      {data?.data?.categories?.active || 0}
                    </span>
                  </li>
                  <li className="dashboard__censts-list">
                    Inactive:
                    <span className="dashboard__censts-span">
                      {data?.data?.categories?.inactive || 0}
                    </span>
                  </li>
                  <li className="dashboard__censts-list">
                    Empty:
                    <span className="dashboard__censts-span">
                      {data?.data?.categories?.empty || 0}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="dashboard__cen-stats-items">
                <p className="dashboard__censts-title">Stock</p>
                <ul className="dashboard__censts-ul">
                  <li className="dashboard__censts-list">
                    Total items:
                    <span className="dashboard__censts-span">
                      {data?.data?.stock?.totalItems || 0}
                    </span>
                  </li>
                  <li className="dashboard__censts-list">
                    Total value:
                    <span className="dashboard__censts-span dashboard__censts-span-money">
                      {data?.data?.stock?.totalValue || 0}$
                    </span>
                  </li>
                  <li className="dashboard__censts-list">
                    Average price:
                    <span className="dashboard__censts-span  dashboard__censts-span-money">
                      {data?.data?.stock?.averagePrice || 0}$
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div  onClick={() => setPickDrop(!pickDrop)} className="dashboard__cen-drop">
            <p className="dashboard__tit-sub">{pickupData?.message}:</p>
            <span className="dashboard__cen-span">
              {pickDrop ? <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 16L6 10H18L12 16Z"></path>
              </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8L18 14H6L12 8Z"></path></svg>}
              
            </span>
          </div>
          {pickDrop ? <PickupTable data={pickupData}/> : null}
          <div  onClick={() => setLowStockDrop(!lowStockDrop)} className="dashboard__cen-drop">
            <p className="dashboard__tit-sub">{lowStockData?.message}:</p>
            <span className="dashboard__cen-span">
              {lowStockDrop ? <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 16L6 10H18L12 16Z"></path>
              </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8L18 14H6L12 8Z"></path></svg>}
              
            </span>
          </div>
          {lowStockDrop ? <ProductsTable cars={dataTable} /> : null}
          
        </>
      ) : isPending ||
        categoryPending ||
        !data ||
        !categoryStats ||
        !lowStockPending ? (
        <CarServiceSkeleton />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Dashboard;
