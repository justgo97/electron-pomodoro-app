import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";

import App from "@/App";
import store from "@/store";
import { AudioProvider } from "@/context/AudioProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AudioProvider>
        <App />
      </AudioProvider>
    </Provider>
  </React.StrictMode>
);
