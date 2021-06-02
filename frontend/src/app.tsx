import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-virtualized/styles.css";
import { toast, Zoom } from "react-toastify";
import axios from "axios";
import { configure } from "axios-hooks";
import { Provider } from "react-redux";
import styles from "./app.module.scss";
import ResponsiveProvider from "./context-providers/responsive-provider";
import store from "./redux/store";
import Routes from "./routes";
import LocalStorageUserManager from "./components/local-storage-user-manager";

toast.configure({
  position: "bottom-center",
  autoClose: 4000,
  limit: 3,
  transition: Zoom,
  bodyClassName: styles.toastBody,
  progressClassName: styles.toastProgressBar,
});

configure({ axios: axios.create({ baseURL: process.env.API_URL }) });

function App() {
  return (
    <Provider store={store}>
      <ResponsiveProvider>
        <LocalStorageUserManager />
        <Routes />
      </ResponsiveProvider>
    </Provider>
  );
}

export default App;
