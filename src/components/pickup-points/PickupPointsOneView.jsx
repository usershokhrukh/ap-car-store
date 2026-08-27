"use client";
import {useParams, useRouter} from "next/navigation";
import "./pickup-one.modules.scss";
import "./pickup-points.modules.scss";
import "../products/products.modules.scss";
import "../products/one-product.modules.scss";
import "../dashboard/dashboard.modules.scss";
import React, {useContext, useEffect, useRef, useState} from "react";
import {useGetOnePickup} from "@/hooks/pickup/GET/GetOnePickup";
import BookingDistribution from "../dashboard/dashboardChart";
import {useGetPickup} from "@/hooks/pickup/GET/GetPickup";
import MapView from "../map/MapDynamic";
import PaginationGeneral from "../pagination/PaginationGeneral";
import {useGetPickupProducts} from "@/hooks/pickup/GET/GetPickupProducts";
import {useNotify} from "@/hooks/useNotify";
import ProductsTable from "../products/ProductsTable";
import SalonWorkspaceSkeleton from "./PickupOneSkeleton";
import NotFound from "../notfound/NotFound";
import {usePatchStatusPickup} from "@/hooks/pickup/PATCH/PatchPickUpStatus";
import { GeneralModal } from "@/context/GeneralModal";
import PickupPointsEditMedia from "../modal/pickup/PickupPointsEditMedia";

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
  const {
    data: onePickupData,
    error: onePickupError,
    isPending: onePickupPending,
  } = useGetOnePickup(id);

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
    if (pickupPointError?.message) {
      notice({
        text: pickupPointError?.message,
        status: "error",
        time: 3000,
      });
      route.refresh();
    }
  }, [pickupPointError]);

  useEffect(() => {
    if (onePickupError?.message) {
      notice({
        text: onePickupError?.message,
        status: "error",
        time: 3000,
      });
      route.refresh();
    }
  }, [onePickupError]);

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

  const {
    mutate: patchStatus,
    error: patchStatusError,
    isPending: patchStatusPending,
    data: patchStatusData,
  } = usePatchStatusPickup();

  const handleSwitch = (id, isActive) => {
    if (!patchStatusPending) {
      notice({
        text: "Switching...",
        time: "infinite",
        status: "info",
      });
      patchStatus([id, {isActive: !isActive}]);
    }
  };

  useEffect(() => {
    if (!patchStatusPending && patchStatusData) {
      notice({
        text: patchStatusData?.message,
        status: "success",
        time: 5000,
        close: true,
      });
    }
    if (patchStatusPending) {
      notice({
        text: "Switching...",
        time: "infinite",
        status: "info",
      });
    }
  }, [patchStatusData, patchStatusData]);

  useEffect(() => {
    if (patchStatusError?.message) {
      notice({
        text: patchStatusError?.message,
        time: "infinite",
        status: "error",
        close: "true",
      });
      route.refresh();
    }
  }, [patchStatusError]);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Toggle between play and pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Reset play state when video naturally finishes
  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };
  const [maximized, setMaximized] = useState(false);

  const handleMaximize = () => {
    if (!containerRef.current) return;

    const isFullscreenNow = !!(
      document.fullscreenElement || document.webkitFullscreenElement
    );

    if (!isFullscreenNow) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
      setMaximized(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }

      setMaximized(false);
    }
  };

  const { setCloseModal, setCompModal} = useContext(GeneralModal)

  useEffect(() => {
    if(onePickupData && videoRef.current) {
      videoRef.current.load()
    }
  }, [onePickupData])

  return (
    <div className="pickup-one container">
      <>
        {onePickupData && !onePickupPending ? (
          <>
            <div className="pickup-points__top">
              <div className="pickup-points__t-box">
                <h2 className="pickup-points__title">Pickup Point</h2>
                <p className="pickup-points__tit-sub">
                  {onePickupData?.message}
                </p>
              </div>
            </div>
            <main className="pickup-one__main">
              <div className="pickup-one__m-left">
                <div className="pickup-one__ml-top">
                  <div className="pickup-one__mlt-video-wr">
                    {onePickupData?.data?.videoUrl ||
                    (onePickupData?.data?.videoPath && !isMediaError) ? (
                      <div ref={containerRef} className="pickup-one__video-wr">
                        <video
                          onClick={togglePlay} // Clicking video container toggles play/pause
                          ref={videoRef}
                          onEnded={handleVideoEnded}
                          className={`pickup-one__video ${maximized ? "pickup-one__video-full" : ""}`}
                          width="100"
                          height="100"
                          preload="none"
                          controls={false} // PERMANENTLY REMOVED native controls panel
                          poster={
                            onePickupData?.data?.imageUrl
                              ? onePickupData?.data?.imageUrl
                              : onePickupData?.data?.imagePath
                                ? `https://magnateshop.uz{onePickupData?.data?.imagePath}`
                                : ""
                          }
                        >
                          <source
                            className="pickup-points__source"
                            onError={() => {
                              setIsMediaError(true);
                            }}
                            src={`${onePickupData?.data?.videoUrl || `https://magnateshop.uz{onePickupData?.data?.videoPath || null}`}`}
                          />
                        </video>

                        {/* Play button ONLY shows when paused or ended */}
                        {!isPlaying && (
                          <span
                            onClick={togglePlay}
                            className="pickup-one__video-span"
                          >
                            <svg
                              xmlns="http://w3.org"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M19.376 12.4161L8.77735 19.4818C8.54759 19.635 8.23715 19.5729 8.08397 19.3432C8.02922 19.261 8 19.1645 8 19.0658V4.93433C8 4.65818 8.22386 4.43433 8.5 4.43433C8.59871 4.43433 8.69522 4.46355 8.77735 4.5183L19.376 11.584C19.6057 11.7372 19.6678 12.0477 19.5146 12.2774C19.478 12.3323 19.4309 12.3795 19.376 12.4161Z"></path>
                            </svg>
                          </span>
                        )}

                        {/* Maximize button ALWAYS remains visible */}
                        <button
                          onClick={handleMaximize}
                          className="pickup-one__maximize"
                        >
                          <span className="products-view__mleft-buttons-span products-view__mleft-buttons-span-delete">
                            <svg
                              xmlns="http://w3.org"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M8 3V5H4V9H2V3H8ZM2 21V15H4V19H8V21H2ZM22 21H16V19H20V15H22V21ZM22 9H20V5H16V3H22V9Z"></path>
                            </svg>
                          </span>
                        </button>
                      </div>
                    ) : onePickupData?.data?.imageUrl ||
                      (onePickupData?.data?.imagePath && !isMediaError) ? (
                      <img
                        className="pickup-one__poster"
                        width={100}
                        height={100}
                        src={`${onePickupData?.data?.imageUrl || `https://magnateshop.uz{onePickupData?.data?.imagePath || null}`}`}
                        alt={onePickupData?.data?.city || "no photo"}
                        onError={() => {
                          setIsMediaError(true);
                        }}
                      />
                    ) : isMediaError ? (
                      <p className="pickup-points__tit-sub">
                        Could not launch video and images
                      </p>
                    ) : (
                      <p className="pickup-points__tit-sub">
                        This pickup point does not have any poster or video
                      </p>
                    )}
                  </div>

                  <div className="pickup-one__mlt-v-bottom">
                    <button onClick={() => {
                      setCloseModal(true)
                      setCompModal(<PickupPointsEditMedia id={id}/>)
                    }} className="pickup-one__mlt-vb-buttons">
                      Edit Media
                      <span className="global-svg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 19V5H9.58579L11.5858 7H20V19H4ZM21 5H12.4142L10.4142 3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V6C22 5.44772 21.5523 5 21 5ZM15.0008 12.667L10.1219 9.41435C10.0562 9.37054 9.979 9.34717 9.9 9.34717C9.6791 9.34717 9.5 9.52625 9.5 9.74717V16.2524C9.5 16.3314 9.5234 16.4086 9.5672 16.4743C9.6897 16.6581 9.9381 16.7078 10.1219 16.5852L15.0008 13.3326C15.0447 13.3033 15.0824 13.2656 15.1117 13.2217C15.2343 13.0379 15.1846 12.7895 15.0008 12.667Z"></path></svg></span>
                    </button>
                  </div>
                </div>
                {pickupPointData ? (
                  <BookingDistribution
                    title={pickupPointData?.message}
                    subtitle={"Products in Pickup Points"}
                    data={chartData}
                    classWr={"pickup-one__chart-column"}
                    classCircle={"pickup-one__chart-circle"}
                  />
                ) : !pickupPointData && pickupPointPending ? (
                  <p className="products__tit-sub">Loading...</p>
                ) : (
                  <p className="products__tit-sub">
                    Could not get pickup points!
                  </p>
                )}
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
                    <p className="pickup-one__text-high">
                      {onePickupData?.data?.name || "no name"}
                    </p>
                    <p className="pickup-one__text-sub">
                      {onePickupData?.data?.city || "no city"}
                    </p>
                    <p className="pickup-one__text-sub">
                      {onePickupData?.data?.address || "no address"}
                    </p>
                    {onePickupData?.data?.phone ? (
                      <a href="tel:" className="pickup-one__text-tel">
                        {onePickupData?.data?.phone}
                      </a>
                    ) : (
                      <p className="pickup-one__text-sub">no phone number</p>
                    )}
                  </div>

                  <div className="pickup-one__mrbot-right">
                    <button className="pickup-one__mbh-button">
                      Edit Location
                    </button>
                    <div className="pickup-one__mbh-box">
                      {onePickupData?.data?.isOpenNow ? (
                        <span className="products__t-b-status-success products__t-b-status-se">
                          Open
                        </span>
                      ) : (
                        <span className="products__t-b-status-error products__t-b-status-se">
                          Closed
                        </span>
                      )}
                      <p className="pickup-one__text-med">
                        {onePickupData?.data?.opensAt || "--:--"}-
                        {onePickupData?.data?.closesAt || "--:--"}
                      </p>
                    </div>
                    <p className="pickup-one__text-med">
                      Products:{" "}
                      <span className="pickup-one__text-rest">
                        {onePickupData?.data?.productsCount || 0}
                      </span>
                    </p>
                    <div className="pickup-one__mbh-box">
                      <span
                        onClick={() =>
                          handleSwitch(id, onePickupData?.data?.isActive)
                        }
                        className={`${patchStatusPending ? "products__t-b-switch-pending" : ""}`}
                      >
                        {onePickupData?.data?.isActive ? (
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
                      </span>

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

                      <button className="products-view__mleft-buttons products-view__mleft-buttons-delete">
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
            {data?.data?.items?.length ? (
              <>
                <PaginationGeneral
                  data={data}
                  localStorageName={localStorageName}
                  setSearchParams={setSearchParams}
                  hasFilter={"false"}
                  hasSearch={"false"}
                />
                <ProductsTable cars={data} />
              </>
            ) : !isPending && data?.data?.items?.total ? (
              <span className="products__tit-sub">
                There are not products for this filter
              </span>
            ) : !isPending ? (
              <span className="products__tit-sub">
                This pickup point does not have products
              </span>
            ) : (
              <span className="products__tit-sub">
                Could not get products for this pickup point!
              </span>
            )}
          </>
        ) : onePickupPending ? (
          <SalonWorkspaceSkeleton />
        ) : (
          <NotFound />
        )}
      </>
    </div>
  );
};

export default PickupPointsOneView;
