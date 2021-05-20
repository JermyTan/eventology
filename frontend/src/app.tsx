import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-virtualized/styles.css";
import { toast, Zoom } from "react-toastify";
import axios from "axios";
import { configure } from "axios-hooks";
import {
  PageBodyProvider,
  ResponsiveProvider,
  UserProvider,
} from "./context-providers";
import Routes from "./routes";
import styles from "./app.module.scss";

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
    <PageBodyProvider>
      <ResponsiveProvider>
        <UserProvider>
          <Routes />
        </UserProvider>
      </ResponsiveProvider>
    </PageBodyProvider>
  );
}

export default App;
