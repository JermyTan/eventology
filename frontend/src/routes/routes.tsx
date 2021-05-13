import { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import LoginPage from "../components/pages/login-page";
import EventsPage from "../components/pages/events-page";
import EventsSingleViewPage from "../components/pages/events-single-view-page";
import ProfilePage from "../components/pages/profile-page";
import {
  LOGIN_PATH,
  EVENTS_PATH,
  EVENTS_SINGLE_VIEW_PATH,
  PROFILE_PATH,
} from "./paths";
import { UserContext } from "../context-providers";
import ScrollToTopWrapper from "../components/scroll-to-top-wrapper";

function routes() {
  const { access } = useContext(UserContext);

  return (
    <Router>
      <ScrollToTopWrapper>
        <Switch>
          <Route path={LOGIN_PATH} exact>
            {access ? <Redirect to={EVENTS_PATH} /> : <LoginPage />}
          </Route>

          {!access && (
            <Route>
              <Redirect to={LOGIN_PATH} />
            </Route>
          )}

          <Route path={EVENTS_PATH} exact strict>
            <EventsPage />
          </Route>

          <Route path={EVENTS_SINGLE_VIEW_PATH} exact strict>
            <EventsSingleViewPage />
          </Route>

          <Route path={PROFILE_PATH} exact strict>
            <ProfilePage />
          </Route>

          <Route>
            <Redirect to={LOGIN_PATH} />
          </Route>
        </Switch>
      </ScrollToTopWrapper>
    </Router>
  );
}

export default routes;
