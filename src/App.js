import React, { useState, useEffect, useRef } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  AdaptivityProvider,
  AppRoot,
  ANDROID,
  usePlatform,
  ConfigProvider,
  Root,
  ScreenSpinner,
} from "@vkontakte/vkui";

//? Import styles
import "@vkontakte/vkui/dist/vkui.css";
import "./lib/styles/index.scss";

//? Import other library
import { isAndroid } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { socketListener } from "./lib/scripts/socketTool";
import axios from "axios";

//? Import views
import MainView from "./views/main";
import ErrorView from "./views/error";
import RatingView from "./views/rating";

const App = () => {
  const viewList = ["main", "error", "rating"];
  const [activeView, setactiveView] = useState("main");
  const [history, setHistory] = useState(["main"]);
  const dispatch = useDispatch();
  const platform = usePlatform();
  const config = useSelector((s) => s.config);
  const timer = useRef();

  const goBack = () => {
    if (history.length === 1) {
      bridge.send("VKWebAppClose", { status: "success" });
    } else if (history.length > 1) {
      history.pop();
      console.log(history[history.length - 1]);
      setactiveView(history[history.length - 1]);
    }
  };

  useEffect(() => {
    window.addEventListener("popstate", () => goBack());
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === "VKWebAppUpdateConfig") {
        const schemeAttribute = document.createAttribute("scheme");
        schemeAttribute.value = "client_light";
        //schemeAttribute.value = data.scheme ? data.scheme : "client_light";
        document.body.attributes.setNamedItem(schemeAttribute);
      }
    });
    bridge.send("VKWebAppSetViewSettings", {
      status_bar_style: "dark",
      action_bar_color: "#F7F7F8",
      navigation_bar_color: "#F7F7F8",
    });
  }, []);

  const createSocket = async () => {
    const user = await bridge.send("VKWebAppGetUserInfo");
    let token = await getLocalToken(user.id).catch((e) => {
      console.log(e);
      initError(e);
      return;
    });
    console.log(token);
    if (!token) {
      return;
    }
    var socket = io.connect(config.server_url, {
      path: "/app/websocket",
      query: {
        access_token: token,
      },
      reconnection: false,
      transports: ["websocket"],
    });
	dispatch({
		type:'setSocket',
		payload:socket
	})
    socketListener(socket, dispatch, go, initError, timer)
  };

  const go = (e) => {
    if (viewList.indexOf(e) > -1) {
      window.history.pushState({ panel: e }, e);
      setactiveView(e);
      history.push(e);
    }
  };

  const getLocalToken = (id) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(`${config.server_url}/app/authorize`, {
          authorization: {
            type: "vk-mini-apps",
            vk_user_id: id,
            vk_query: window.location.search,
          },
        })
        .then((data) => {
          resolve(data.data.response.access_token);
        })
        .catch((e) => {
          if (e.response) {
            if (e.response.data.response) {
              reject(e.response.data.response);
            }
          } else {
            reject();
          }
        });
    });
  };

  const initError = (error) => {
    clearInterval(timer.current);
	dispatch({
		type:'setSocket',
		payload:null
	})
    dispatch({
      type: "setDbData",
      payload: {},
    });
    dispatch({
      type: "setErrorData",
      payload: error ? error : { error_public: "Сервер временно недоступен" },
    });
    go("error");
    dispatch({
      type: "setPopout",
      payload: {
        viewName: "mainView",
        popout: <ScreenSpinner size={"medium"} />,
      },
    });
  };

  return (
    <ConfigProvider
      isWebView={true}
      platform={isAndroid ? "android" : "ios"}
    >
      <AdaptivityProvider hasMouse={false}>
        <AppRoot>
          <Root activeView={activeView}>
            <MainView
              id={"main"}
              go={go}
              createSocket={createSocket}
            />
            <ErrorView id={"error"} back={goBack} initError={initError} />
            <RatingView id={"rating"} back={goBack} />
          </Root>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
