import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./lib/redux";
import { Router, init } from "@cteamdev/router";
import { pageRouter } from "./lib/scripts/routes";
import { RouterContext } from "@happysanta/router";

// Init VK  Mini App
bridge.send("VKWebAppInit");

// Init router
pageRouter.start();

ReactDOM.render(
  <Provider store={store}>
    <RouterContext.Provider value={pageRouter}>
      <App />
    </RouterContext.Provider>
  </Provider>,
  document.getElementById("root")
);
