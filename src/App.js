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
import ProfileView from "./views/profile";

const App = () => {
  const viewList = ["main", "error", "rating", "profile"];
  const [activeView, setactiveView] = useState("main");
  const history = useSelector((s) => s.ui.history);
  const dispatch = useDispatch();
  const userData = useSelector((s) => s.user.dbData);
  const config = useSelector((s) => s.config);
  const socket = useSelector((s) => s.config.socket);
  const timer = useRef();
  useEffect(() => {
    if (history.length === 0) {
      bridge.send("VKWebAppClose", { status: "success" });
    }
  }, [history]);
  const goBack = () => {
    if (Object.keys(userData).length == 0) {
      return;
    }
    console.log(history);
    if (history.length === 0) {
      return;
    }
    if (history[history.length - 1] === "rating") {
      dispatch({
        type: "setRatingData",
        payload: { ratingName: "all", data: {} },
      });
      dispatch({
        type: "setRatingData",
        payload: { ratingName: "groups", data: {} },
      });
      dispatch({
        type: "setRatingData",
        payload: { ratingName: "friends", data: {} },
      });
      dispatch({
        type: "setRatingData",
        payload: { ratingName: "error", data: false },
      });
      dispatch({
        type: "setRatingData",
        payload: { ratingName: "myTop", data: {} },
      });
      dispatch({
        type: "setRatingData",
        payload: { ratingName: "myGroup", data: false },
      });
    }
    dispatch({
      type: "goBackHistory",
    });
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

  bridge.subscribe(async (v) => {
    if (v.detail.type === "VKWebAppViewHide") {
      if (socket != null) {
        socket.disconnect(true);
        dispatch({
          type: "setSocket",
          payload: null,
        });
        initError(
          { error_public: "Подождите, переподключение к серверу" },
          true,
          false
        );
      }
    }
    if (v.detail.type === "VKWebAppViewRestore") {
      await clearHistory();
    }
    console.log(v);
  });

  const clearHistory = () => {
    window.history.go(-window.history.length);
    dispatch({
      type: "defaultHistory",
    });
  };

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
      type: "setSocket",
      payload: socket,
    });
    socketListener(socket, dispatch, go, initError, timer);
  };

  const go = (e) => {
    if (viewList.indexOf(e) > -1) {
      window.history.pushState({ panel: e }, e);
      dispatch({
        type: "addHistory",
        payload: e,
      });
    }
  };

  const getLocalToken = (id) => {
    return new Promise(async (resolve, reject) => {
      await axios
        .post(`${config.server_url}/app/authorize`, {
          authorization: {
            type: "vk-mini-apps",
            vk_user_id: String(id),
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

  const initError = (error, openView = true, showButton = true) => {
    dispatch({
      type: "setSocket",
      payload: null,
    });
    clearInterval(timer.current);
    dispatch({
      type: "setDbData",
      payload: {},
    });
    dispatch({
      type: "setPopout",
      payload: {
        viewName: "mainView",
        popout: <ScreenSpinner size={"medium"} />,
      },
    });
    if (openView) {
      dispatch({
        type: "setErrorData",
        payload: error ? error : { error_public: "Сервер временно недоступен" },
        showButton: showButton,
      });
      go("error");
    }
  };

  return (
    <ConfigProvider isWebView={true} platform={isAndroid ? "android" : "ios"}>
      <AdaptivityProvider hasMouse={false}>
        <AppRoot>
          <Root activeView={history[history.length - 1]}>
            <MainView
              id={"main"}
              go={go}
              createSocket={createSocket}
              history={history}
            />
            <RatingView id={"rating"} back={goBack} />
            <ProfileView id={"profile"} back={goBack} />
            <ErrorView
              id={"error"}
              history={history}
              go={clearHistory}
              initError={initError}
            />
          </Root>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
