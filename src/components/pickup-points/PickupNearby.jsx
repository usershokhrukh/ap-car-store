import {GeneralModal} from "@/context/GeneralModal";
import {ModalDropDown} from "@/context/ModalDropDown";
import {useGetGeoCode} from "@/hooks/pickup/GET/GetGeoCode";
import {useGetPickupCities} from "@/hooks/pickup/GET/GetPickupCities";
import {useGetPickupNearby} from "@/hooks/pickup/GET/GetPickupNearby";
import {useNotify} from "@/hooks/useNotify";
import React, {useContext, useEffect, useState} from "react";

const PickupNearby = ({setNearby, nearby: nearbyProp}) => {
  const {setCloseDrop, closeDrop, setCompDrop, compDrop, setPag} =
    useContext(ModalDropDown);

  const [input, setInput] = useState({
    limit: 5,
    radiusKm: 25,
    lat: null,
    lng: null,
  });

  const {
    data: geoData,
    isFetching,
    error: geoError,
  } = useGetGeoCode(
    `${input?.lat && input?.lng ? `?lat=${input?.lat}&lng=${input?.lng}` : ""}`,
  );

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const [cityValue, setCityValue] = useState("");
  const {data, error, isPending} = useGetPickupCities();

  const {notice} = useNotify();
  useEffect(() => {
    if (error?.message) {
      notice({
        text: `${error?.message}. You must enter your position to get nearby pickup points!`,
        time: 8000,
        status: "error",
      });
      setCityValue("error");
    }
  }, [error]);

  useEffect(() => {
    if (isFetching && !geoData) {
      notice({
        text: "Searching address...",
        time: "infinite",
        status: "info",
      });
    }
  }, [isFetching, geoData]);

  useEffect(() => {
    if (!isFetching && geoData) {
      notice({
        text: geoData?.message,
        status: "success",
        time: 3000,
      });
    }
  }, [geoData, isFetching]);

  useEffect(() => {
    if (geoError?.message) {
      notice({
        text: `${geoError?.message}. Could not get address to coordinations!`,
        status: "info",
        time: 5000,
      });
    }
  }, [geoError]);

  useEffect(() => {
    if (data && !closeDrop) {
      setCityValue(null);
    }
  }, [data]);

  useEffect(() => {
    if (!data && isPending && !closeDrop) {
      setCityValue("loading...");
    }
  }, [isPending, data, closeDrop]);

  const [search, setSearch] = useState("");
  const {
    data: nearby,
    error: nearbyError,
    isFetching: nearbyFetching,
  } = useGetPickupNearby(search);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input?.lat || !input?.lng)
      return notice({
        text: "Please get your position or select nearby city! If you selected, the location may not be correct coordinations!",
        time: 8000,
        status: "info",
      });
    setSearch(
      `${Number(input?.lat) && Number(input?.lng) ? `?lat=${input?.lat}&lng=${input?.lng}${input?.limit ? `&limit=${input?.limit}` : ""}${input?.radiusKm ? `&radiusKm=${input?.radiusKm}` : ""}` : ""}`,
    );
  };

  useEffect(() => {
    if (!nearby?.data?.length && nearbyFetching) {
      notice({
        text: "Searching nearby pickup points...",
        status: "info",
        time: "infinite",
      });
    }
  }, [nearby, nearbyFetching]);

  const {setCloseModal} = useContext(GeneralModal);

  useEffect(() => {
    if (nearby?.data?.length && !nearbyFetching && !nearbyError?.message) {
      notice({
        text: nearby?.message,
        time: 5000,
        status: "success",
      });
      setCloseDrop(false);
      setCloseModal(false);
      setNearby(nearby?.data);
      sessionStorage.setItem("nearbyPickup", JSON.stringify(nearby?.data));
    } else if (
      !nearby?.data?.length &&
      !nearbyFetching &&
      !nearbyError?.message &&
      search
    ) {
      notice({
        text:
          nearby?.message ||
          "No pickup points found to location, try to change radius or location!",
        status: "info",
        time: 5000,
      });
    }
  }, [nearby, nearbyFetching]);

  useEffect(() => {
    if (nearbyError?.message) {
      notice({
        text: nearbyError?.message || "Something went wrong!",
        status: "error",
        time: 5000,
      });
    }
  }, [nearbyError]);
  const handleLocation = (e) => {
    e.preventDefault();
    if (typeof window === "undefined" || !navigator.geolocation) {
      notice({
        text: "Geolocation is not supported by your browser environment.",
        status: "error",
        time: 5000,
      });
      return;
    }

    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost"
    ) {
      notice({
        text: "Browser blocked location lookup: Geolocation requires an HTTPS network connection or local development server.",
        status: "error",
        time: 5000,
      });
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setInput({
          ...input,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setCityValue(null);
      },
      (err) => {
        notice({
          text: `Could not get position: ${err.message}. Please click manually on the map.`,
          status: "error",
          time: 5000,
        });
      },
      {enableHighAccuracy: true, timeout: 8000},
    );
  };
    const [nearbyLocal, setNearbyLocal] = useState(() => {
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
  return (
    <form onSubmit={handleSubmit} className="modal__form">
      <div className="modal__bg-box-top">
        <h2 className="modal__f-title">Nearby properties</h2>
        {nearbyLocal?.length ? <button onClick={() => {
          sessionStorage.removeItem("nearbyPickup")
          setSearch("")
          setNearby(null)
          setNearbyLocal(null)
        }} className="modal__f-stop">Stop</button> : null}
        
      </div>
      <p className="modal__bg-b-info">*get your position</p>
      <div className="modal__f-box">
        <div className="modal__f-box-left">
          <p className="modal__f-title">
            address:
            <span className="modal__f-text-sub modal__f-text-rest">
              {geoData?.data?.address || "--"}
            </span>
          </p>
          <p className="modal__f-title">
            city:
            <span className="modal__f-text-sub modal__f-text-rest">
              {geoData?.data?.city || "--"}
            </span>
          </p>
        </div>
        <button onClick={handleLocation} className="modal__button">
          Get position
          <span className="global-svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11 5.07089C7.93431 5.5094 5.5094 7.93431 5.07089 11H7V13H5.07089C5.5094 16.0657 7.93431 18.4906 11 18.9291V17H13V18.9291C16.0657 18.4906 18.4906 16.0657 18.9291 13H17V11H18.9291C18.4906 7.93431 16.0657 5.5094 13 5.07089V7H11V5.07089ZM3.05493 11C3.51608 6.82838 6.82838 3.51608 11 3.05493V1H13V3.05493C17.1716 3.51608 20.4839 6.82838 20.9451 11H23V13H20.9451C20.4839 17.1716 17.1716 20.4839 13 20.9451V23H11V20.9451C6.82838 20.4839 3.51608 17.1716 3.05493 13H1V11H3.05493ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"></path>
            </svg>
          </span>
        </button>
      </div>
      <p className="modal__bg-b-info">*or select city</p>
      <span className="products__b-pag-filter-select modal__select-wrap">
        <span
          onClick={() => {
            if (data?.data?.length) {
              setCloseDrop(true);
              setCompDrop(
                <>
                  <span className={`products__b-pag-filter-options`}>
                    {data?.data?.map(({id, city, latitude, longitude}) => (
                      <span
                        key={`${id} ${city}`}
                        onClick={() => {
                          setCityValue(city);
                          setCloseDrop(false);
                          setInput({
                            ...input,
                            lat: latitude || 0,
                            lng: longitude || 0,
                          });
                        }}
                        className="products__b-pag-filter-option"
                      >
                        {city}
                      </span>
                    ))}
                  </span>
                </>,
              );
            }
          }}
          className="products__b-pag-filter-choosed modal__select-choosed"
        >
          {cityValue || "--"}
          <span className="products__b-pag-span">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 14L8 10H16L12 14Z"></path>
            </svg>
          </span>
        </span>
      </span>
      <div className="modal__f-box-row">
        <div className="modal__f-box-min">
          <label htmlFor="radiusKm" className="modal__bg-b-info">
            radius km (default 25)
          </label>
          <input
            onChange={handleChange}
            className="modal__inputs modal__no-inputs"
            value={input?.radiusKm}
            placeholder="radiusKm"
            type="number"
            name="radiusKm"
            id="radiusKm"
          />
        </div>

        <div className="modal__f-box-min">
          <label htmlFor="limit" className="modal__bg-b-info">
            limit (default 5)
          </label>
          <input
            onChange={handleChange}
            className="modal__inputs modal__no-inputs"
            value={input?.limit}
            placeholder="limit"
            type="number"
            name="limit"
            id="limit"
          />
        </div>
      </div>
      <button className="modal__submit">Search</button>
    </form>
  );
};

export default PickupNearby;
