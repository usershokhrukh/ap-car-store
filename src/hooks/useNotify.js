import {ErrorContext} from "@/context/ErrorContext";
import {useContext} from "react";

export const useNotify = () => {
  const [setError, setNoticeSVG, setClose] = useContext(ErrorContext);

  const notice = ({text, status, time, close, stop}) => {
    if(stop === 'true') {
      setClose({
        status: 'true'
      })
      return
    }
    if (status == "info") {
      setNoticeSVG(
        <svg
          className="error__span-info"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"></path>
        </svg>,
      );
    } else if (status == "error") {
      setNoticeSVG(
        <svg
          className="error__span-error"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"></path>
        </svg>,
      );
    } else if (status == "success") {
      setNoticeSVG(
        <svg
          className="error__span-success"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.4571 9.45711L11 15.9142L6.79289 11.7071L8.20711 10.2929L11 13.0858L16.0429 8.04289L17.4571 9.45711Z"></path>
        </svg>,
      );
    } else {
      setNoticeSVG("");
    }

    setError({
      text,
      timeout: time|| 5000,
      close: close ? true : false,
    });
  };

  return {notice};
};
