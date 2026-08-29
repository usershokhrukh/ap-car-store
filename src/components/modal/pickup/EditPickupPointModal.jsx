import MapViewLocate from "@/components/map/MapPointDynamic";
import {useGetGeoCode} from "@/hooks/pickup/GET/GetGeoCode";
import {useGetGeoSearch} from "@/hooks/pickup/GET/GetGeoWithSearch";
import {useNotify} from "@/hooks/useNotify";
import {useRouter} from "next/navigation";
import React, {useContext, useEffect, useRef, useState} from "react";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import {isValidNumber} from "libphonenumber-js";
import {GeneralModal} from "@/context/GeneralModal";
import {usePostPickupImage} from "@/hooks/pickup/POST/PostPickUpImage";
import {useQueryClient} from "@tanstack/react-query";
import {useGetOnePickup} from "@/hooks/pickup/GET/GetOnePickup";
import {usePutPickupPoints} from "@/hooks/pickup/PUT/PutPickupPoints";
import {useDeletePickupImage} from "@/hooks/pickup/DELETE/DeletePickupImages";

const EditPickupPointModal = ({id}) => {
  const {notice} = useNotify();
  const route = useRouter();
  const {setCloseModal, setModalStopped} = useContext(GeneralModal);
  const {
    data: onePickup,
    error: errorOnePickup,
    isPending: pendingOnePickup,
    isFetching: oneFetching,
  } = useGetOnePickup(id);
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
    isFetching: searchFetching,
  } = useGetGeoSearch(`${search.trim() ? `?q=${search}` : ""}`);

  useEffect(() => {
    if (errorOnePickup?.message) {
      notice({
        text: `${errorOnePickup?.message}, Could not get pickup data, it may deleted!`,
        status: "error",
        time: 5000,
      });
      route.refresh();
    }
  }, [errorOnePickup]);

  const {
    data,
    error,
    isPending,
    isFetching: codeFetching,
  } = useGetGeoCode(searchGeo);
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
  }, [searchPending, searchData, secondSearch, reLocate]);

  const [phone, setPhone] = useState(null);
  const [preview, setPreview] = useState(null);

  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleContainerClick = () => fileInputRef.current.click();

  const processFile = (file) => {
    if (!file || !file?.type?.startsWith("image/")) return;
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
    e.preventDefault();
    setPreview(onePickup?.data?.image || onePickup?.data?.imageUrl);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const {
    mutate,
    data: dataSend,
    error: errorSend,
    isPending: sendPending,
  } = usePutPickupPoints();

  const {
    mutate: mutatePatch,
    data: dataPatch,
    error: errorPatch,
    isPending: patchPending,
    isSendingImage,
    forceCancelImageUpload,
  } = usePostPickupImage();

  useEffect(() => {
    if (patchPending) {
      if (!isSendingImage) {
        notice({
          text: `Video is not actively sending, please try again!`,
          status: "error",
          time: 5000,
        });
        forceCancelImageUpload();
        setModalStopped(false);
      }
    }
  }, [isSendingImage, patchPending]);

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
      if (dataSend && !sendPending) {
        setTimeout(() => {
          notice({
            text: dataSend?.message,
            status: "success",
            time: 3000,
          });
          setModalStopped(false);
        }, 2000);
        setTimeout(() => {
          setCloseModal(false);
        }, 2000);
      }
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
          "Successfully changed!",
        time: 3000,
        status: "success",
      });
      setCloseModal(false);
    }
  }, [dataPatch]);
  const {
    mutate: deleteImage,
    error: deleteImageError,
    isPending: deleteImagePending,
    data: deleteImageData,
  } = useDeletePickupImage();

  useEffect(() => {
    if (dataSend && !sendPending) {
      if (!image) {
        notice({
          text: dataSend?.message || "Successfully changed!",
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
    e.stopPropagation();

    if (!input?.name || !input?.closesAt || !input?.opensAt || !input?.phone)
      return notice({
        text: "Fill all inputs!",
        status: "error",
        time: 3000,
      });

    if (!isValidNumber(input?.phone, "UZ"))
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
    mutate([
      id,
      {
        closesAt: input?.closesAt,
        opensAt: input?.opensAt,
        city: input?.city,
        address: input?.address,
        phone: input?.phone,
        latitude: input?.latitude,
        longitude: input?.longitude,
        name: input?.name,
      },
    ]);
  };

  const queryClient = useQueryClient();
  const handleManualCancel = () => {
    queryClient.cancelQueries({queryKey: ["geosearch", search]});
  };

  useEffect(() => {
    if (onePickup && !pendingOnePickup) {
      setInput({
        ...onePickup?.data,
      });
      setPreview(onePickup?.data?.image || onePickup?.data?.imageUrl);
      if (onePickup?.data?.longitude && onePickup?.data?.latitude) {
        setMapData({
          latitude: onePickup?.data?.latitude,
          longitude: onePickup?.data?.longitude,
        });
      } else if (onePickup?.data?.city) {
        setSearch(onePickup?.data?.city);
      } else {
        notice({
          text: "Could not get pickup location properties!",
          status: "error",
          time: 3000,
        });
      }
      setPhone(onePickup?.data?.phone || "");
    }
  }, [onePickup, pendingOnePickup]);

  const handleRemovePickupImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setModalStopped(true);
    notice({
      text: "Deleting image...",
      status: "info",
      time: "infinite",
    });
    deleteImage(id);
  };

  useEffect(() => {
    if (deleteImageError?.message) {
      notice({
        text: deleteImageError?.message,
        time: 3000,
        status: "error",
      });
      setModalStopped(false);
    }
  }, [deleteImageError]);

  useEffect(() => {
    if (deleteImageData && !deleteImagePending) {
      notice({
        text: deleteImageData?.message,
        status: "success",
        time: 3000,
      });
      setModalStopped(false);
    }
  }, [deleteImageData, deleteImagePending]);
  return (
    <form onSubmit={handleSubmit} className="modal__form">
      {sendPending || deleteImagePending || patchPending ? (
        <div className="modal__form-hide"></div>
      ) : null}

      <MapViewLocate
        data={globalMapData}
        setMapData={setMapData}
        mapData={mapData}
        mapClass={"modal__f-map"}
      />
      <div className="modal__f-bg-top">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          type="search"
          className="modal__inputs modal__no-inputs "
          placeholder="Search address..."
          name="q"
          value={secondSearch}
          onChange={(e) => {
            setSecondSearch(e.target.value);
            if (!e.target.value.trim() && !isPending) {
              notice({
                stop: "true",
              });
              handleManualCancel();
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
      <div className="modal__f-bg-top">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          type="text"
          className="modal__inputs modal__no-inputs"
          placeholder="Name"
          name="name"
          onChange={handleInputs}
          value={input?.name}
        />
        <PhoneInputWithCountrySelect
          className="modal__input-phone modal__no-inputs"
          placeholder="Phone number"
          onChange={setPhone}
          value={phone}
          limitMaxLength
          required
          defaultCountry="UZ"
          countries={["UZ"]}
          international={false}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
      </div>

      <div className="modal__f-bigbox">
        <div className="modal__f-bg-center">
          <div className="modal__f-bg-b-time">
            <span className="modal__f-bg-t-wr">
              <span className="modal__bg-b-info">opens at:</span>
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              accept="image/*"
              className="image-uploader__input"
            />

            {image ? (
              <div className="image-uploader__preview-wrapper">
                <img
                  src={preview}
                  alt="Preview"
                  className="image-uploader__preview-image"
                />
                <button
                  onClick={removeImage}
                  className="image-uploader__remove-btn"
                >
                  ✕
                </button>
              </div>
            ) : !image && preview ? (
              <div className="image-uploader__preview-wrapper">
                <img
                  src={preview}
                  alt="Preview"
                  className="image-uploader__preview-image"
                />
                <button
                  onClick={handleRemovePickupImage}
                  className="image-uploader__remove-btn"
                >
                  <span className="global-svg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                    </svg>
                  </span>
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
      <button
        type="submit"
        style={{
          opacity: `${sendPending || patchPending || deleteImagePending || oneFetching || codeFetching || searchFetching ? 0.5 : 1}`,
        }}
        disabled={
          sendPending ||
          patchPending ||
          deleteImagePending ||
          oneFetching ||
          codeFetching ||
          searchFetching
        }
        className="modal__submit"
      >
        Edit Point
      </button>
    </form>
  );
};

export default EditPickupPointModal;
