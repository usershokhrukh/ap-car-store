import React, {useContext, useEffect, useRef, useState} from "react";
import "../../pickup-points/pickup-one.modules.scss";
import {useNotify} from "@/hooks/useNotify";
import {usePostPickupVideo} from "@/hooks/pickup/POST/PostPickUpVideo";
import {useRouter} from "next/navigation";
import {GeneralModal} from "@/context/GeneralModal";
import {usePostPickupImage} from "@/hooks/pickup/POST/PostPickUpImage";

const PickupPointsEditMedia = ({id}) => {
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
    canceled,
    setCanceled,
  } = usePostPickupVideo();

  const handleVideoClick = () => {
    if (!videoPending) {
      videoInputRef.current.click();
    }
  };

  const {setModalStopped, setCloseModal} = useContext(GeneralModal);
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
          if (!canceled) {
            notice({
              text: `Video processing... ${percent}%`,
              status: "info",
              time: "infinite",
            });
          }
          route.refresh();
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
      setCloseModal(false)
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

  useEffect(() => {
    if (canceled) {
      notice({
        text: "Video canceled!",
        status: "info",
        time: 3000,
      });
    }
  }, [canceled]);
  return (
    <div className="pickup-one__modal">
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
        {videoPending ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              forceCancelUpload("info");
              setCanceled(true);
              notice({
                text: "Video canceled!",
                status: "info",
                time: 3000,
              });
              setModalStopped(false);
            }}
            className="modal__red-button"
          >
            Cancel
          </button>
        ) : (
          <button
            style={{
              opacity: `${videoPending ? "0.5" : 1}`,
            }}
            disabled={videoPending}
            className="modal__submit"
          >
            Edit
          </button>
        )}
      </form>
    </div>
  );
};

export default PickupPointsEditMedia;
