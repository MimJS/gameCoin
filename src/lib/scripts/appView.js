import bridge from "@vkontakte/vk-bridge";
import { useSelector, useDispatch } from "react-redux";
import { PAGE_MAIN } from "./routes";
import { useLocation, useRouter } from "@happysanta/router";

const appView = (go, initError) => {
  const socket = useSelector((s) => s.config.socket);
  const dispatch = useDispatch();
  const location = useLocation();
  let hidden, visibilityChange;
  if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }
  if (
    typeof document.addEventListener === "undefined" ||
    hidden === undefined
  ) {
    // Error enable AWCS
  } else {
    return;
    document.addEventListener(
      visibilityChange,
      () => {
        if (document[hidden]) {
          console.log(`gndfgndfjgndfjgnfdkgnfdkjn`);
          if (window.location.hash !== "#/rating" && socket != null) {
            console.log(`disconnect`);
            socket.disconnect(true);
            dispatch({
              type: "setSocket",
              payload: null,
            });
            initError({ error_public: "Вы отключились от сервера" });
          }
        }
      },
      false
    );
  }
};

export default appView;
