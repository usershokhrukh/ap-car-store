import MapViewLocate from "@/components/map/MapPointDynamic";
import {useGetGeoCode} from "@/hooks/pickup/GET/GetGeoCode";
import {useGetGeoSearch} from "@/hooks/pickup/GET/GetGeoWithSearch";
import {useNotify} from "@/hooks/useNotify";
import Image from "next/image";
import {useRouter} from "next/navigation";
import React, {useContext, useEffect, useRef, useState} from "react";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import {isValidNumber} from "libphonenumber-js";
import {usePostPickup} from "@/hooks/pickup/POST/PostPickUp";
import {GeneralModal} from "@/context/GeneralModal";
import {usePostPickupImage} from "@/hooks/pickup/POST/PostPickUpImage";
import { useQueryClient } from "@tanstack/react-query";

const NewPickupPointModal = () => {
  const {notice} = useNotify();
  const route = useRouter();
  const {setCloseModal, setModalStopped} = useContext(GeneralModal);
  const [input, setInput] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    opensAt: "",
    closesAt: "",
    latitude: null,
    longitude: null,
  });
  const [globalMapData, setGlobalMapData] = useState(null);
  const [mapData, setMapData] = useState({
    latitude: 41.3,
    longitude: 69.24,
  });
  const [search, setSearch] = useState("");
  const searchGeo = `?${mapData?.latitude ? `lat=${mapData?.latitude}` : ""}&${mapData?.longitude ? `lng=${mapData?.longitude}` : ""}`;
  const {
    data: searchData,
    error: searchError,
    isPending: searchPending,
    isFetching
  } = useGetGeoSearch(`${search.trim() ? `?q=${search}` : ""}`);
  const {data, error, isPending} = useGetGeoCode(searchGeo);

  const [reLocate, setReLocate] = useState(false);
  useEffect(() => {
    if (error?.message) {
      notice({
        text: error?.message,
        status: "error",
        time: 5000,
      });
      route.refresh();
      setSearch("");
      setSecondSearch("");
      setMapData({
        ...mapData,
        latitude: 41.3,
        longitude: 69.24,
      });
      setModalStopped(false);
      setReLocate(true);
    }
  }, [error]);

  useEffect(() => {
    if (searchError?.message) {
      notice({
        text: searchError?.message,
        status: "error",
        time: 5000,
      });
      route.refresh();
      setSearch("");
      setSecondSearch("");
      setMapData({
        ...mapData,
        latitude: 41.3,
        longitude: 69.24,
      });
      setModalStopped(false);
      setReLocate(true);
    }
  }, [searchError]);

  useEffect(() => {
    if (data?.data) {
      setGlobalMapData(data?.data);
      if (!reLocate) {
        setReLocate(false);
      }
      setInput({
        ...input,
        city: data?.data?.city || "--",
        address: data?.data?.address || "--",
        latitude: data?.data?.latitude,
        longitude: data?.data?.longitude,
      });
    }
  }, [data]);

  const [secondSearch, setSecondSearch] = useState("");
  useEffect(() => {
    if (searchData?.data) {
      setGlobalMapData(searchData?.data);
      setMapData(searchData?.data);
      if (!reLocate) {
        setReLocate(false);
      }
      setInput({
        ...input,
        city: searchData?.data?.city || "--",
        address: searchData?.data?.address || "--",
        latitude: searchData?.data?.latitude,
        longitude: searchData?.data?.longitude,
      });
    }
  }, [searchData]);

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
    if (searchPending && !searchData && secondSearch?.trim()?.length) {
      setReLocate(null);
      notice({
        text: "Searching...",
        status: "info",
        time: "infinite",
      });
    }
    if (reLocate != null && !reLocate) {
      notice({
        stop: "true",
      });
    }
  }, [searchPending, searchData, secondSearch, reLocate, secondSearch]);

  // console.log(isFetching, isPending);
  

  const [phone, setPhone] = useState(null);
  const [county, setCountry] = useState(null);
  const [preview, setPreview] = useState(null);

  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleContainerClick = () => fileInputRef.current.click();

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const {
    mutate,
    data: dataSend,
    error: errorSend,
    isPending: sendPending,
  } = usePostPickup();

  const {
    mutate: mutatePatch,
    data: dataPatch,
    error: errorPatch,
    isPending: patchPending,
  } = usePostPickupImage();

  useEffect(() => {
    if (errorSend?.message) {
      notice({
        text: errorSend?.message,
        status: "error",
        time: 5000,
      });
      route.refresh();
      setModalStopped(false);
    }
  }, [errorSend]);

  useEffect(() => {
    if (errorPatch?.message) {
      notice({
        text: errorPatch?.message,
        status: "error",
        time: 5000,
      });
      route.refresh();
      setCloseModal(false);
      setModalStopped(false);
    }
  }, [errorPatch]);

  const uploadImage = (id) => {
    const formData = new FormData();
    formData.append("image", image);
    notice({
      text: "Uploading image...",
      status: "info",
      time: "infinite",
    });
    setModalStopped(true);

    mutatePatch({
      formData,
      id,
      onProgress: (percent) =>
        notice({
          text: `Uploading image... ${percent}%`,
          status: "info",
          time: "infinite",
        }),
    });
  };

  useEffect(() => {
    if (dataPatch && !patchPending) {
      setModalStopped(false);
      notice({
        text:
          `${dataSend?.message} , ${dataPatch?.message}` ||
          "Successfully added!",
        time: 3000,
        status: "success",
      });
      setCloseModal(false);
    }
  }, [dataPatch]);

  useEffect(() => {
    if (dataSend && !sendPending) {
      if (!image) {
        notice({
          text: dataSend?.message || "Successfully added!",
          time: 3000,
          status: "success",
        });
        setCloseModal(false);
        setModalStopped(false);
      } else {
        setModalStopped(true);
        uploadImage(dataSend?.data?.id);
      }
    }
  }, [dataSend]);

  const timeRef = useRef(null);

  const handleInputs = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value.trim(),
    });
  };

  useEffect(() => {
    setInput({
      ...input,
      phone,
    });
  }, [phone]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input?.name || !input?.closesAt || !input?.opensAt || !input?.phone)
      return notice({
        text: "Fill all inputs!",
        status: "error",
        time: 3000,
      });

    if (!isValidNumber(input?.phone, county))
      return notice({
        text: "Phone number is not valid!",
        status: "error",
        time: 5000,
      });

    setModalStopped(true);
    notice({
      text: "Adding properties...",
      status: "info",
      time: "infinite",
    });
    mutate(input);
  };

  const queryClient = useQueryClient();

  const handleManualCancel = () => {
    queryClient.cancelQueries({queryKey: ["geosearch", search]})
  }

  return (
    <form onSubmit={handleSubmit} className="modal__form">
      <MapViewLocate
        data={globalMapData}
        setMapData={setMapData}
        mapData={mapData}
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
            if (!e.target.value.trim() && !isPending) {
              notice({
                stop:"true"
              })
              handleManualCancel()
            }
            if (timeRef.current) {
              clearTimeout(timeRef.current);
              timeRef.current = setTimeout(() => {
                setSearch(e.target.value.trim());
                setSecondSearch(e.target.value);
              }, 1000);
            } else {
              timeRef.current = setTimeout(() => {
                setSearch(e.target.value.trim());
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
      <input
        type="text"
        className="modal__inputs"
        placeholder="Name"
        name="name"
        onChange={handleInputs}
        value={input?.name}
      />
      <div className="modal__f-bigbox">
        <div className="modal__f-bg-center">
          <PhoneInputWithCountrySelect
            className="modal__input-phone"
            placeholder="Phone number"
            onChange={setPhone}
            value={phone}
            limitMaxLength
            required
            onCountryChange={setCountry}
          />
          <div className="modal__f-bg-b-time">
            <span className="modal__f-bg-t-wr">
              <span className="modal__bg-b-info">opens at:</span>
              <input
                required
                name="opensAt"
                type="time"
                className="modal__inputs"
                onChange={handleInputs}
                value={input?.opensAt}
              />
            </span>
            <span className="modal__f-bg-t-wr">
              <span className="modal__bg-b-info">closes at:</span>
              <input
                required
                name="closesAt"
                type="time"
                className="modal__inputs "
                onChange={handleInputs}
                value={input?.closesAt}
              />
            </span>
          </div>
        </div>
        <div className="image-uploader">
          <div
            onClick={handleContainerClick}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`image-uploader__dropzone ${isDragging ? "image-uploader__dropzone--dragging" : ""}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              accept="image/*"
              className="image-uploader__input"
            />

            {image ? (
              <div className="image-uploader__preview-wrapper">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="image-uploader__preview-image"
                />
                <button
                  onClick={removeImage}
                  className="image-uploader__remove-btn"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ) : (
              <p className="modal__bg-b-info">
                Click or drag poster here (optional)
              </p>
            )}
          </div>
        </div>
      </div>
      <button className="modal__submit">Create Point</button>
    </form>
  );
};

export default NewPickupPointModal;
