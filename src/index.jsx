import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store";

import App from "./App";
import { Toaster } from "react-hot-toast";
// import { BrowserRouter, HashRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom/dist";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <HashRouter>
      <Toaster
        toastOptions={{
          style: { background: "rgb(51 65 85)", color: "#fff" },
        }}
      />
      <App />
    </HashRouter>
  </Provider>
);
