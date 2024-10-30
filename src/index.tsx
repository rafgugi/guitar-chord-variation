import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./components/Main";

import "normalize.css";
import "skeleton-framework/src/skeleton.css";

ReactDOM.createRoot(document.getElementsByTagName("main")[0]!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);
