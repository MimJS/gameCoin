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
import { useDispatch } from "react-redux";
import MainView from "./views/main";

const App = () => {
  const [activeView, setactiveView] = useState("main");
  const dispatch = useDispatch();
  const platform = usePlatform();

  const goBack = () => {
    if (history.length === 1) {
      bridge.send("VKWebAppClose", { status: "success" });
    } else if (history.length > 1) {
      history.pop();
      setActivePanel(history[history.length - 1]);
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
      dispatch({
        type: "setVkData",
        payload: user,
      });
      setPopout(null);
    }
    fetchData();
  }, []);

  const go = (e) => {
    window.history.pushState({ panel: e }, e);
    setActivePanel(e);
    history.push(e);
  };

  return (
    <ConfigProvider
      isWebView={true}
      platform={platform === ANDROID ? "android" : "ios"}
    >
      <AdaptivityProvider>
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
