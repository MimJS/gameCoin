import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  AdaptivityProvider,
  AppRoot,
  ANDROID,
  usePlatform,
  ConfigProvider,
  Root,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./lib/styles/index.scss";
import { useDispatch, useSelector } from "react-redux";
import MainView from "./views/main";
import io from "socket.io-client";
import { socketListener } from "./lib/scripts/socketTool";
import axios from "axios";

const App = () => {
  const viewList = ["main"];
  const [activeView, setactiveView] = useState("main");
  const dispatch = useDispatch();
  const platform = usePlatform();
  const config = useSelector((s) => s.config);

  const goBack = () => {
    if (history.length === 1) {
      bridge.send("VKWebAppClose", { status: "success" });
    } else if (history.length > 1) {
      history.pop();
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
    async function fetchData() {
      const user = await bridge.send("VKWebAppGetUserInfo");
      let token = await getLocalToken(user.id);
      console.log(token);
      var socket = io.connect(config.server_url, {
        path: "/app/websocket",
        query: {
          access_token: token,
        },
        reconnection: false,
        transports: ["websocket"],
      });
      socketListener(socket, dispatch);
    }
    fetchData();
  }, []);

  const go = (e) => {
    if (viewList.indexOf(e) > -1) {
      window.history.pushState({ panel: e }, e);
      setactiveView(e);
      history.push(e);
    }
  };

  const getLocalToken = async (id) => {
    return await axios
      .post(`${config.server_url}/app/authorize`, {
        authorization: {
          type: "vk-mini-apps",
          vk_user_id: id,
          vk_query: window.location.search,
        },
      })
      .then((data) => {
        return data.data.response.access_token;
      });
  };

  return (
    <ConfigProvider
      isWebView={true}
      platform={platform === ANDROID ? "android" : "ios"}
    >
      <AdaptivityProvider hasMouse={false}>
        <AppRoot>
          <Root activeView={activeView}>
            <MainView id={"main"} go={go} />
          </Root>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
