"use client";

import React, {useContext, useEffect, useState} from "react";
import "./pickup-points.modules.scss";
import {useGetPickup} from "@/hooks/pickup/GET/GetPickup";
import {useNotify} from "@/hooks/useNotify";
import {GeneralModal} from "@/context/GeneralModal";
import {useRouter} from "next/navigation";
import PaginationGeneral from "../pagination/PaginationGeneral";
import PickUpPointsPaginationProperties from "./PickUpPointsPaginationProperties";
import PickupPointsTable from "./PickupPointsTable";
import NotFound from "../notfound/NotFound";
import NewPickupPointModal from "../modal/pickup/NewPickupPointModal";
import PickupNearby from "./PickupNearby";
import PickupPointSkeleton from "./PickupPointsSkeleton";

const PickupPoints = () => {
  const localStorageName = "pickupPointsLimit";
  const listAct = ["isActive", "sortBy", "order", "city"];
  const [searchParams, setSearchParams] = useState("");
  const {data, isPending, error} = useGetPickup(searchParams);

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

  const {setCloseModal, setCompModal, setCloseSpan} = useContext(GeneralModal);

  const [nearby, setNearby] = useState(() => {
    if(typeof window !== "undefined") {
      const localNearby = sessionStorage.getItem("nearbyPickup")
      if(localNearby) {
        if(JSON.parse(localNearby)?.length) {
          return JSON.parse(localNearby)
        }
      }
    }
    return null
  })
  
  useEffect(() => {
    setCloseModal(false);
    setCompModal(null);
    setCloseSpan(true);
  }, []);

  return (
    <div className="pickup-points container">
      {!isPending && data ? (
        <>
          <div className="pickup-points__top">
            <div className="pickup-points__t-box">
              <h2 className="pickup-points__title">Pickup Points</h2>
              <p className="pickup-points__tit-sub">{data?.message}</p>
            </div>
            <div className="pickup-points__t-right">
              <button onClick={() => {
                setCloseModal(true)
                setCompModal(<PickupNearby nearby={nearby} setNearby={setNearby}/>)
              }} className="products__b-pag-lbutton">
                nearby
                <span className="global-svg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 13.589L17.6066 4.98242L19.0208 6.39664L10.4142 15.0032H18V17.0032H7V6.00324H9V13.589Z"></path>
                  </svg>
                </span>
              </button>
              <button
                onClick={() => {
                  setCloseModal(true);
                  setCompModal(<NewPickupPointModal />);
                }}
                className="pickup-points__top-submit"
              >
                + Add New Pickup Point
              </button>
            </div>
          </div>
          <PaginationGeneral
            comp={PickUpPointsPaginationProperties}
            data={data}
            localStorageName={localStorageName}
            listAct={listAct}
            setSearchParams={setSearchParams}
          />
          <div className="products__bottom">
            {data?.data?.items?.length ? (
              <PickupPointsTable data={data} />
            ) : (
              <span className="products__tit-sub">
                There are not products for this filter
              </span>
            )}
          </div>
          {
            nearby?.length ? <div className="products__bottom">
              <p className="pickup-points__tit-sub">Nearby pickup points</p>
              <PickupPointsTable data={{
                data:{
                  items: nearby
                }
              }}/>
            </div> : null
          }
          
        </>
      ) : isPending ? (
        <PickupPointSkeleton />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default PickupPoints;
