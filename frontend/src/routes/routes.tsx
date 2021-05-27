import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import LoginPage from "../components/pages/login-page";
import EventsPage from "../components/pages/events-page";
import EventsSingleViewPage from "../components/pages/events-single-view-page";
import ProfilePage from "../components/pages/profile-page";
import {
  LOGIN_PATH,
  EVENTS_PATH,
  EVENTS_SINGLE_VIEW_PATH,
  PROFILE_LIKES_PATH,
  PROFILE_GOING_PATH,
  PROFILE_PAST_PATH,
  PROFILE_MAIN_PATH,
} from "./paths";
import { SearchProvider, SingleEventProvider } from "../context-providers";
import ScrollToTopWrapper from "../components/scroll-to-top-wrapper";
import { useAppSelector } from "../redux/hooks";
import { EVENT_ID, USER_ID } from "../constants";

function routes() {
  const access = useAppSelector((state) => state.user?.access);

  return (
    <Router>
      <ScrollToTopWrapper>
        <QueryParamProvider
          ReactRouterRoute={Route}
          stringifyOptions={{ skipEmptyString: true, skipNull: true }}
        >
          <Switch>
            <Route path={LOGIN_PATH} exact>
              {access ? <Redirect to={EVENTS_PATH} /> : <LoginPage />}
            </Route>

            {!access && <Redirect to={LOGIN_PATH} />}

            <Route path={EVENTS_PATH} exact strict>
              <SearchProvider>
                <EventsPage />
              </SearchProvider>
            </Route>

            <Route path={EVENTS_SINGLE_VIEW_PATH} exact strict>
              {({ match }) => {
                const {
                  params: { eventId },
                } = match as unknown as { params: { [EVENT_ID]: string } };

                return (
                  <SingleEventProvider eventId={eventId}>
                    <EventsSingleViewPage />
                  </SingleEventProvider>
                );
              }}
            </Route>

            <Route path={[PROFILE_MAIN_PATH]} exact>
              {({ match }) => {
                const {
                  params: { userId },
                } = match as unknown as { params: { [USER_ID]: string } };

                return (
                  <Redirect
                    to={PROFILE_LIKES_PATH.replace(`:${USER_ID}`, userId)}
                  />
                );
              }}
            </Route>

            <Route
              path={[PROFILE_LIKES_PATH, PROFILE_GOING_PATH, PROFILE_PAST_PATH]}
              exact
              strict
            >
              <ProfilePage />
            </Route>

            <Redirect to={LOGIN_PATH} />
          </Switch>
        </QueryParamProvider>
      </ScrollToTopWrapper>
    </Router>
  );
}

export default routes;
