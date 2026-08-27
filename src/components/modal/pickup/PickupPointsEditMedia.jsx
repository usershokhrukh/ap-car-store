import React, {useContext, useEffect, useRef, useState} from "react";
import "../../pickup-points/pickup-one.modules.scss";
import {useNotify} from "@/hooks/useNotify";
import {usePostPickupVideo} from "@/hooks/pickup/POST/PostPickUpVideo";
import {useRouter} from "next/navigation";
import {GeneralModal} from "@/context/GeneralModal";
import {usePostPickupImage} from "@/hooks/pickup/POST/PostPickUpImage";

const PickupPointsEditMedia = ({id}) => {
  const [isMedia, setIsMedia] = useState(true);
  const {notice} = useNotify();
  const route = useRouter();
  const [mediaDragging, setMediaDragging] = useState(false);
  const [video, setVideo] = useState(null);
  const videoInputRef = useRef(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const videoRef = useRef(null);

  const {
    mutate: videoPost,
    error: videoError,
    isPending: videoPending,
    data: videoSuccess,
    isSending,
    forceCancelUpload,
  } = usePostPickupVideo();

  const handleVideoClick = () => {
    if (!videoPending) {
      videoInputRef.current.click();
    }
  };

  useEffect(() => {
    if (videoPending) {
      if (!isSending) {
        notice({
          text: `Video is not actively sending, please try again!`,
          status: "error",
          time: 5000,
        });
        forceCancelUpload();
        setModalStopped(false);
      }
    }
  }, [isSending, videoPending]);
  const processVideo = (file) => {
    if (!file || (!file.type.startsWith("video/") && !videoPending)) return;
    setVideo(file);
    setPreviewVideo(URL?.createObjectURL(file));
    setVideo(file);
    setPreviewVideo(file);
  };

  const handleInputVideoChange = (e) => processVideo(e.target.files[0]);

  useEffect(() => {
    if (previewVideo && videoRef.current && !videoPending) {
      videoRef.current.load();
    }
  }, [previewVideo]);

  const handleDrop = (e) => {
    e.preventDefault();
    setMediaDragging(false);
    processVideo(e.dataTransfer.files[0]);
  };

  const {setModalStopped} = useContext(GeneralModal);
  const handleVideoSubmit = (e) => {
    e.preventDefault();
    if (!video)
      return notice({
        text: "To change the video please upload the new one!",
        status: "error",
        time: 3000,
      });
    if (navigator.onLine) {
      const formData = new FormData();
      formData.append("video", video);
      notice({
        text: "Adding video...",
        status: "info",
        time: "infinite",
      });
      setModalStopped(true);
      videoPost({
        id,
        formData,
        onProgress: (percent) => {
          notice({
            text: `Video processing... ${percent}%`,
            status: "info",
            time: "infinite",
          });
          route?.refresh();
        },
      });
    } else {
      notice({
        text: "Please check your internet connection!",
        status: "info",
        time: 5000,
      });
    }
  };

  useEffect(() => {
    if (videoSuccess && !videoPending) {
      notice({
        text: videoSuccess?.message || "Successfully uploaded!",
        status: "success",
        time: 3000,
      });

      setModalStopped(false);
    }
  }, [videoSuccess, videoPending]);

  useEffect(() => {
    if (videoError?.message) {
      notice({
        text: videoError?.message,
        status: "error",
        time: 5000,
      });
      setModalStopped(false);
      route.refresh();
    }
  }, [videoError]);

  const [image, setImage] = useState(null);
  const imageInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const imageRef = useRef(null);

  const {
    mutate: imagePost,
    error: imageError,
    isPending: imagePending,
    data: imageSuccess,
    isSendingImage,
    forceCancelImageUpload,
  } = usePostPickupImage();
  const handleImageClick = () => {
    if (!imagePending) {
      imageInputRef.current.click();
    }
  };

  useEffect(() => {
    if (imagePending) {
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
  }, [isSendingImage, imagePending]);
  const processImage = (file) => {
    if ((!file || !file.type.startsWith("image/")) && !imagePending) return;
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleInputImageChange = (e) => processImage(e.target.files[0]);

  useEffect(() => {
    if (previewImage && imageRef.current && !imagePending) {
      imageRef.current.load();
    }
  }, [previewImage]);

  const handleDropImage = (e) => {
    e.preventDefault();
    setMediaDragging(false);
    processImage(e.dataTransfer.files[0]);
  };

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (!image)
      return notice({
        text: "To change the image please upload the new one!",
        status: "error",
        time: 3000,
      });

    const formData = new FormData();
    formData.append("image", image);

    notice({
      text: "Adding image...",
      status: "info",
      time: "infinite",
    });
    setModalStopped(true);

    imagePost({
      id,
      formData,
      onProgress: (percent) => {
        notice({
          text: `Image processing... ${percent}%`,
          status: "info",
          time: "infinite",
        });
      },
    });
  };

  useEffect(() => {
    if (imageSuccess && !imagePending) {
      notice({
        text: imageSuccess?.message || "Successfully uploaded!",
        status: "success",
        time: 3000,
      });

      setModalStopped(false);
    }
  }, [imageSuccess, imagePending]);

  useEffect(() => {
    if (imageError?.message) {
      notice({
        text: imageError?.message,
        status: "error",
        time: 5000,
      });
      setModalStopped(false);
      route.refresh();
    }
  }, [imageError]);

  return (
    <div className="pickup-one__modal">
      <ul className="pickup-one__modal-ul">
        <li
          onClick={() => {
            if (!videoPending) {
              setIsMedia(true);
            } else {
              notice({
                text: "Please wait video in process!",
                status: "info",
                time: 3000,
              });
            }
          }}
          className={`pickup-one__modal-li ${isMedia ? "pickup-one__modal-li-border" : ""}`}
        >
          Media
        </li>
        <li
          onClick={() => {
            if (!videoPending) {
              setIsMedia(false);
            } else {
              notice({
                text: "Please wait video in process!",
                status: "info",
                time: 3000,
              });
            }
          }}
          className={`pickup-one__modal-li ${!isMedia ? "pickup-one__modal-li-border" : ""}`}
        >
          Poster
        </li>
      </ul>
      {isMedia ? (
        <form onSubmit={handleVideoSubmit} className="modal__form">
          <div
            onClick={handleVideoClick}
            onDragOver={(e) => {
              e.preventDefault();
              setMediaDragging(true);
            }}
            onDragLeave={() => {
              setMediaDragging(false);
            }}
            onDrop={handleDrop}
            className={`modal__form-drop ${mediaDragging ? "modal__form-drop-dragging" : ""}`}
          >
            <input
              className="image-uploader__input"
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleInputVideoChange}
            />
            {!previewVideo ? (
              <p className="modal__bg-b-info">Click or Drop your Video</p>
            ) : (
              <video
                ref={videoRef}
                preload="metadata"
                muted
                playsInline
                controls={false}
                width={300}
                height={220}
              >
                <source src={previewVideo} />
              </video>
            )}
          </div>
          <button
            style={{
              opacity: `${videoPending ? "0.5" : 1}`,
            }}
            disabled={videoPending}
            className="modal__submit"
          >
            Edit
          </button>
        </form>
      ) : (
        <form onSubmit={handleImageSubmit} className="modal__form">
          <div
            onClick={handleImageClick}
            onDragOver={(e) => {
              e.preventDefault();
              setMediaDragging(true);
            }}
            onDragLeave={() => {
              setMediaDragging(false);
            }}
            onDrop={handleDropImage}
            className={`modal__form-drop ${mediaDragging ? "modal__form-drop-dragging" : ""}`}
          >
            <input
              className="image-uploader__input"
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputImageChange}
            />
            {!previewImage ? (
              <p className="modal__bg-b-info">Click or Drop your Image</p>
            ) : (
              <img src={previewImage} width={300} height={220} alt="" />
            )}
          </div>
          <button
            style={{
              opacity: `${imagePending ? "0.5" : 1}`,
            }}
            disabled={imagePending}
            className="modal__submit"
          >
            Edit
          </button>
        </form>
      )}
    </div>
  );
};

export default PickupPointsEditMedia;
