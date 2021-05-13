import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./configs";
import App from "./app";
import "./index.scss";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root"),
);
