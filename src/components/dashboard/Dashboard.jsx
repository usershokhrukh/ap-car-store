"use client";

import {useNotify} from "@/hooks/useNotify";
import React, {useEffect} from "react";
import "./dashboard.modules.scss";
import BookingDistribution from "./dashboardChart";

const Dashboard = () => {
  const {notice} = useNotify();
  useEffect(() => {
    notice({
      stop: "true",
    });
  }, []);
  return (
    <div className="dashboard container">
      <div className="dashboard__top">
        <h2 className="dashboard__title">Welcome To Car Service</h2>
        <p className="dashboard__tit-sub">
          Here is what happening with your money today
        </p>
      </div>
      <div className="dashboard__center">
        <div className="dashboard__cen-stats">
          <div className="dashboard__cen-stats-items">
            <p className="dashboard__censts-title">Products</p>
            <ul className="dashboard__censts-ul">
              <li className="dashboard__censts-list">
                Total:
                <span className="dashboard__censts-span">93</span>
              </li>
              <li className="dashboard__censts-list">
                Active:
                <span className="dashboard__censts-span">64</span>
              </li>
              <li className="dashboard__censts-list">
                Inactive:
                <span className="dashboard__censts-span">28</span>
              </li>
              <li className="dashboard__censts-list">
                Out of stock:
                <span className="dashboard__censts-span">5</span>
              </li>
              <li className="dashboard__censts-list">
                Low stock:
                <span className="dashboard__censts-span">62</span>
              </li>
            </ul>
          </div>
          <div className="dashboard__cen-stats-items">
            <p className="dashboard__censts-title">Categories</p>
            <ul className="dashboard__censts-ul">
              <li className="dashboard__censts-list">
                Total:
                <span className="dashboard__censts-span">8</span>
              </li>
              <li className="dashboard__censts-list">
                Active:
                <span className="dashboard__censts-span">7</span>
              </li>
              <li className="dashboard__censts-list">
                Inactive:
                <span className="dashboard__censts-span">1</span>
              </li>
              <li className="dashboard__censts-list">
                Empty:
                <span className="dashboard__censts-span">0</span>
              </li>
            </ul>
          </div>
          <div className="dashboard__cen-stats-items">
            <p className="dashboard__censts-title">Stock</p>
            <ul className="dashboard__censts-ul">
              <li className="dashboard__censts-list">
                Total items:
                <span className="dashboard__censts-span">493</span>
              </li>
              <li className="dashboard__censts-list">
                Total value:
                <span className="dashboard__censts-span dashboard__censts-span-money"> 167653550210$</span>
              </li>
              <li className="dashboard__censts-list">
                Average price:
                <span className="dashboard__censts-span  dashboard__censts-span-money">869000540$</span>
              </li>
            </ul>
          </div>
        </div>
          <BookingDistribution/>
      </div>
    </div>
  );
};

export default Dashboard;
