import MapViewLocate from "@/components/map/MapPointDynamic";
import {GeneralModal} from "@/context/GeneralModal";
import {useGetGeoCode} from "@/hooks/pickup/GET/GetGeoCode";
import {useGetGeoSearch} from "@/hooks/pickup/GET/GetGeoWithSearch";
import {usePatchPickupPoints} from "@/hooks/pickup/PATCH/PatchPickupPoints";
import {useNotify} from "@/hooks/useNotify";
import {useQueryClient} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, {useContext, useEffect, useRef, useState} from "react";

const PickupPointsEditLocation = ({id}) => {
  const [searchValue, setSearchValue] = useState("");
  const [secondSearch, setSecondSearch] = useState("");
  const route = useRouter();
  const [globalMapData, setGlobalMapData] = useState({
    latitude: 41.3,
    longitude: 69.24,
  });

  const {
    data: geoSearch,
    error: geoSearchError,
    isPending: geoSearchPending,
    isFetching: searchFetching
  } = useGetGeoSearch(`${searchValue?.trim() ? `?q=${searchValue}` : ""}`);
  const {data, error, isPending, isFetching:codeFetching} = useGetGeoCode(
    `${globalMapData?.latitude && globalMapData?.longitude ? `?lat=${globalMapData?.latitude}&lng=${globalMapData?.longitude}` : ""}`,
  );
  const {
    data: patchData,
    isPending: patchPending,
    error: patchError,
    mutate,
  } = usePatchPickupPoints();
  const {notice} = useNotify();
  const queryClient = useQueryClient();
  const [reLocate, setReLocate] = useState(false);
  const {setModalStopped, setCloseModal} = useContext(GeneralModal);
  const handleManualCancel = () => {
    queryClient.cancelQueries({queryKey: ["geosearch", searchValue]});
  };

  const timeRef = useRef(null);
  useEffect(() => {
    if (geoSearch && !geoSearchPending) {
      if (!reLocate) {
        setReLocate(false);
      }
      notice({
        stop: "true",
      });
      if (geoSearch?.data?.latitude && geoSearch?.data?.longitude) {
        setGlobalMapData(geoSearch?.data);
      } else {
        notice({
          text: "Could not get coords to search!",
          status: "error",
          time: 3000,
        });
      }
    }
  }, [geoSearch, geoSearchPending]);

  useEffect(() => {
    if (!geoSearch && geoSearchPending && secondSearch?.trim()?.length) {
      setReLocate(null);
      notice({
        text: "Searching...",
        time: "infinite",
        status: "info",
      });
    }
    if (reLocate != null && !reLocate) {
      notice({
        stop: "true",
      });
    }
  }, [geoSearch, geoSearchPending, reLocate, secondSearch, searchValue]);

  useEffect(() => {
    if (geoSearchError?.message) {
      notice({
        text: geoSearchError?.message,
        time: 3000,
        status: "error",
      });
      // setGlobalMapData({
      //   latitude: 41.3,
      //   longitude: 69.24,
      // });
      setReLocate(true);
      // setSearchValue("");
      // setSecondSearch("");
      route.refresh();
    }
  }, [geoSearchError]);

  useEffect(() => {
    if (data && !isPending) {
      if (!reLocate) {
        setReLocate(false);
      }
      notice({
        stop: "true",
      });
      if (data?.data?.latitude && data?.data?.longitude) {
        setGlobalMapData(data?.data);
      } else {
        notice({
          text: "Could not get coords to search!",
          status: "error",
          time: 3000,
        });
      }
    }
  }, [data, isPending]);

  useEffect(() => {
    if (isPending && !data) {
      setReLocate(null);
      notice({
        text: "Searching...",
        status: "info",
        time: "infinite",
      });
    }
  }, [isPending, data, reLocate]);

  useEffect(() => {
    if (error?.message) {
      notice({
        text: error?.message,
        time: 3000,
        status: "error",
      });
      // setGlobalMapData({
      //   latitude: 41.3,
      //   longitude: 69.24,
      // });
      setReLocate(true);
      // setSearchValue("");
      // setSecondSearch("");
      route.refresh();
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !globalMapData?.city?.trim()?.length ||
      !globalMapData?.address?.trim()?.length ||
      !globalMapData?.longitude ||
      !globalMapData?.latitude
    )
      return notice({
        text: "Sorry, location does not have enough properties to send, like city and address!",
        time: 5000,
        status: "error",
      });
    notice({
      text: "Sending...",
      status: "info",
      time: "infinite",
    });

    setModalStopped(true)
    mutate([
      id,
      {
        city: globalMapData?.city,
        address: globalMapData?.address,
        longitude: globalMapData?.longitude,
        latitude: globalMapData?.latitude,
      },
    ]);
  };

  useEffect(() => {
    if(patchError?.message) {
      notice({
        text: patchError?.message,
        status:"error",
        time: 3000
      })
      setModalStopped(false)
      route.refresh();
    }
  }, [patchError])

  useEffect(() => {
    if(patchData && !patchPending) {
      notice({
        text: patchData?.message,
        status:"success",
        time: 3000
      })
      setModalStopped(false);
      setCloseModal(false);
    }
  }, [patchData, patchPending])

  return (
    <form onSubmit={handleSubmit} className="modal__form">
      <MapViewLocate
        // data={globalMapData}
        setMapData={setGlobalMapData}
        mapData={globalMapData}
        mapClass={"modal__f-map"}
      />
      <div className="modal__f-bg-top">
        <input
          type="search"
          className="modal__inputs modal__no-inputs "
          placeholder="Search address..."
          name="q"
          value={secondSearch}
          onChange={(e) => {
            setSecondSearch(e.target.value);
            if (!e.target.value.trim() && geoSearchPending) {
              notice({
                stop: "true",
              });
              handleManualCancel();
            }
            if (timeRef.current) {
              clearTimeout(timeRef.current);
              timeRef.current = setTimeout(() => {
                setSearchValue(e.target.value.trim());
                setSecondSearch(e.target.value);
              }, 1000);
            } else {
              timeRef.current = setTimeout(() => {
                setSearchValue(e.target.value.trim());
                setSecondSearch(e.target.value);
              }, 1000);
            }
          }}
        />
        <p className="modal__f-text">Choose pickup point location</p>
      </div>
      <div className="modal__f-bg-info-box">
        <span className="modal__bg-b-info">Selected location</span>
        <p className="modal__f-text-high">{globalMapData?.city || "-"}</p>
        <p className="modal__f-text">{globalMapData?.address || "-"}</p>
        <p className="modal__f-text">{globalMapData?.displayName || "-"}</p>
        <p className="modal__f-text">
          Suggestion name:{" "}
          <span className="modal__f-text-sub">
            {globalMapData?.suggestionName || "-"}
          </span>
        </p>
      </div>
      <button
        disabled={searchFetching || patchPending || codeFetching}
        style={{
          opacity: `${searchFetching || patchPending || codeFetching ? 0.5 : 1}`,
        }}
        className="modal__submit"
      >
        Change location
      </button>
    </form>
  );
};

export default PickupPointsEditLocation;
