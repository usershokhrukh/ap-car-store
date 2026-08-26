"use client";
import {useParams, useRouter} from "next/navigation";
import "./pickup-one.modules.scss";
import "./pickup-points.modules.scss";
import "../products/products.modules.scss";
import "../products/one-product.modules.scss";
import "../dashboard/dashboard.modules.scss";
import React, {useEffect, useState} from "react";
import {useGetOnePickup} from "@/hooks/pickup/GET/GetOnePickup";
import BookingDistribution from "../dashboard/dashboardChart";
import {useGetPickup} from "@/hooks/pickup/GET/GetPickup";
import MapView from "../map/MapDynamic";
import PaginationGeneral from "../pagination/PaginationGeneral";
import {useGetPickupProducts} from "@/hooks/pickup/GET/GetPickupProducts";
import { useNotify } from "@/hooks/useNotify";
import ProductsTable from "../products/ProductsTable";

const PickupPointsOneView = () => {
  const {id} = useParams();
  const localStorageName = "pickupProductsLimit";
  const [searchParams, setSearchParams] = useState("");
  const {data, isPending, error} = useGetPickupProducts([id, searchParams]);

  const {notice} = useNotify();
  const route = useRouter();

  useEffect(() => {
    if (error?.message) {
      notice({
        text: error?.message,
        time: "infinite",
        status: "error",
        close: "true",
      });
      route.refresh();
    }
  }, [error]);

  console.log(id);
  const {
    data: onePickupData,
    error: onePickupError,
    isFetching: onePickupFetching,
  } = useGetOnePickup(id);
  console.log(onePickupData);

  const [isMediaError, setIsMediaError] = useState(false);
  useEffect(() => {
    if (onePickupData) {
      setIsMediaError(false);
    }
  }, [onePickupData]);

  const [chartData, setChartData] = useState(null);
  const {
    data: pickupPointData,
    error: pickupPointError,
    isPending: pickupPointPending,
  } = useGetPickup();

  useEffect(() => {
    if (pickupPointData) {
      const filter = pickupPointData?.data?.items?.map(
        ({name, productsCount}) => {
          return {name, totalStock: productsCount};
        },
      );
      setChartData(filter);
    }
  }, [pickupPointData]);
  console.log(onePickupData?.data);

  return (
    <div className="pickup-one container">
      <div className="pickup-points__top">
        <div className="pickup-points__t-box">
          <h2 className="pickup-points__title">Pickup Point</h2>
          <p className="pickup-points__tit-sub">{onePickupData?.message}</p>
        </div>
      </div>
      <main className="pickup-one__main">
        <div className="pickup-one__m-left">
          <div className="pickup-one__ml-top">
            <div className="pickup-one__mlt-video-wr">
              {onePickupData?.data?.videoUrl ||
              (onePickupData?.data?.videoPath && !isMediaError) ? (
                <div className="pickup-one__video-wr">
                  <video
                    className="pickup-one__video"
                    width="100"
                    height="100"
                    // controls
                    preload="none"
                    poster={
                      onePickupData?.data?.imageUrl
                        ? onePickupData?.data?.imageUrl
                        : onePickupData?.data?.imagePath
                          ? `https://backend.magnateshop.uz/uploads/${onePickupData?.data?.imagePath}`
                          : ""
                    }
                  >
                    <source
                      onError={() => {
                        setIsMediaError(true);
                      }}
                      src={`${onePickupData?.data?.videoUrl || `https://backend.magnateshop.uz/uploads/${onePickupData?.data?.videoPath || null}`}`}
                    />
                  </video>
                  <span className="pickup-one__video-span">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z"></path>
                    </svg>
                  </span>
                </div>
              ) : onePickupData?.data?.imageUrl ||
                (onePickupData?.data?.imagePath && !isMediaError) ? (
                <img
                  className="pickup-one__poster"
                  width={50}
                  height={50}
                  src={`${onePickupData?.data?.imageUrl || `https://backend.magnateshop.uz/uploads/${onePickupData?.data?.imagePath || null}`}`}
                  alt={onePickupData?.data?.city || "no photo"}
                  onError={() => {
                    setIsMediaError(true);
                  }}
                />
              ) : isMediaError ? (
                "Could not launch video and images"
              ) : (
                "This pickup point does not have any poster or video"
              )}
            </div>
            <div className="pickup-one__mlt-v-bottom">
              <button className="pickup-one__mlt-vb-buttons">Edit Video</button>
              <button className="pickup-one__mlt-vb-buttons">New Poster</button>
            </div>
          </div>
          <BookingDistribution
            title={pickupPointData?.message}
            subtitle={"Products in Pickup Points"}
            data={chartData}
            classWr={"pickup-one__chart-column"}
            classCircle={"pickup-one__chart-circle"}
          />
        </div>
        <div className="pickup-one__m-right">
          <div className="pickup-one__mr-map">
            {" "}
            {onePickupData?.data ? (
              <MapView data={onePickupData?.data} />
            ) : null}
          </div>

          <div className="pickup-one__mr-bottom">
            <div className="pickup-one__mrbot-left">
              <p className="pickup-one__text-high">Name</p>
              <p className="pickup-one__text-sub">City</p>
              <p className="pickup-one__text-sub">address</p>
              <a href="tel:" className="pickup-one__text-tel">
                phone
              </a>
            </div>

            <div className="pickup-one__mrbot-right">
              <button className="pickup-one__mbh-button">Edit Location</button>
              <div className="pickup-one__mbh-box">
                {false ? (
                  <span className="products__t-b-status-success products__t-b-status-se">
                    Open
                  </span>
                ) : (
                  <span className="products__t-b-status-error products__t-b-status-se">
                    Closed
                  </span>
                )}
                <p className="pickup-one__text-med">09:00-20:00</p>
              </div>
              <p className="pickup-one__text-med">Products: 0</p>
              <div className="pickup-one__mbh-box">
                {false ? (
                  <span
                    id="is-active"
                    className="products-view__main-b-activate"
                  >
                    <span
                      id="is-active"
                      className="products-view__main-b-activate-act"
                    >
                      Active
                    </span>
                  </span>
                ) : (
                  <span
                    id="is-active"
                    className="products-view__main-b-activate "
                  >
                    <span
                      id="is-active"
                      className="products-view__main-b-activate-inact"
                    >
                      Inactive
                    </span>
                  </span>
                )}

                <button className="products-view__mleft-buttons">
                  <span className="products-view__mleft-buttons-span">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M16.7574 2.99678L14.7574 4.99678H5V18.9968H19V9.23943L21 7.23943V19.9968C21 20.5491 20.5523 20.9968 20 20.9968H4C3.44772 20.9968 3 20.5491 3 19.9968V3.99678C3 3.4445 3.44772 2.99678 4 2.99678H16.7574ZM20.4853 2.09729L21.8995 3.5115L12.7071 12.7039L11.2954 12.7064L11.2929 11.2897L20.4853 2.09729Z"></path>
                    </svg>
                  </span>
                </button>

                <button
                  className="products-view__mleft-buttons products-view__mleft-buttons-delete"
                >
                  <span className="products-view__mleft-buttons-span products-view__mleft-buttons-span-delete">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM6 10V20H18V10H6ZM9 12H11V18H9V12ZM13 12H15V18H13V12ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9Z"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {
        data?.data?.items?.length ? <>
        <PaginationGeneral
        data={data}
        localStorageName={localStorageName}
        setSearchParams={setSearchParams}
        hasFilter={"false"}
        hasSearch={"false"}
      />
        
        </> : !isPending ?  <span className="products__tit-sub">
          This pickup point does not have products
        </span> : null
      }
      
      {data?.data?.items?.length ? (
        <ProductsTable cars={data} />
      ) : data?.data?.meta?.total && !isPending ?  (
        <span className="products__tit-sub">
          There are not products for this filter
        </span>
      ) : null}
    </div>
  );
};

export default PickupPointsOneView;
