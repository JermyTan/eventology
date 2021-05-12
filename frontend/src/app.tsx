import { toast } from "react-toastify";
import axios from "axios";
import { configure } from "axios-hooks";
import { UserProvider } from "./context-providers";
import Routes from "./routes";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-virtualized/styles.css";

toast.configure({
  position: "bottom-center",
  autoClose: 4000,
  limit: 3,
});

configure({ axios: axios.create({ baseURL: process.env.API_URL }) });

function App() {
  return (
    <UserProvider>
      <Routes />
    </UserProvider>
  );
}

export default App;
