import React, { useState, useEffect, useRef } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  AdaptivityProvider,
  AppRoot,
  ANDROID,
  usePlatform,
  ConfigProvider,
  ScreenSpinner,
  Root,
} from "@vkontakte/vkui";

// ? Import router
import { useLocation, useRouter } from "@happysanta/router";

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
import {
  PANEL_MAIN,
  PANEL_ERROR,
  PANEL_PROFILE,
  PANEL_RATING,
  VIEW_ERROR,
  VIEW_MAIN,
  VIEW_PROFILE,
  VIEW_RATING,
  PAGE_ERROR,
  PAGE_MAIN,
} from "./lib/scripts/routes";
import appView from "./lib/scripts/appView";

const App = () => {
  const viewList = ["/", "/error", "/rating", "/profile"];
  const dispatch = useDispatch();
  const config = useSelector((s) => s.config);
  const timer = useRef();
  const location = useLocation();
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("popstate", () => {
      return;
    });
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
      type: "setSocket",
      payload: socket,
    });
    socketListener(socket, dispatch, go, initError, timer);
  };

  const go = (e) => {
    if (viewList.indexOf(e) > -1) {
      router.pushPage(String(e));
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
      go(PAGE_ERROR);
    }
  };

  const goBack = () => {
    router.popPage();
  };

  // app view settings
  appView(go, initError);

  return (
    <ConfigProvider isWebView={true} platform={isAndroid ? "android" : "ios"}>
      <AdaptivityProvider hasMouse={false}>
        <AppRoot>
          <Root activeView={location.getViewId()}>
            <MainView
              id={VIEW_MAIN}
              go={go}
              createSocket={createSocket}
              history={
                location.hasOverlay() ? [] : location.getViewHistory(VIEW_MAIN)
              }
              mainPanel={PANEL_MAIN}
              onSwipeBack={() => router.popPage()}
            />
            <RatingView
              id={VIEW_RATING}
              back={goBack}
              history={
                location.hasOverlay()
                  ? []
                  : location.getViewHistory(VIEW_RATING)
              }
              mainPanel={PANEL_RATING}
              onSwipeBack={() => router.popPage()}
            />
            <ProfileView
              id={VIEW_PROFILE}
              back={goBack}
              history={
                location.hasOverlay()
                  ? []
                  : location.getViewHistory(VIEW_PROFILE)
              }
              mainPanel={PANEL_PROFILE}
              onSwipeBack={() => router.popPage()}
            />
            <ErrorView
              id={VIEW_ERROR}
              history={
                location.hasOverlay() ? [] : location.getViewHistory(VIEW_ERROR)
              }
              go={go}
              initError={initError}
              mainPanel={PANEL_ERROR}
              onSwipeBack={() => router.popPage()}
            />
          </Root>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
