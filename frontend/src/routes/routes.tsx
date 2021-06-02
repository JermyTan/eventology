import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import {
  LOGIN_PATH,
  EVENTS_PATH,
  EVENTS_SINGLE_VIEW_PATH,
  PROFILE_LIKES_PATH,
  PROFILE_GOING_PATH,
  PROFILE_PAST_PATH,
  PROFILE_MAIN_PATH,
} from "./paths";
import ScrollToTopWrapper from "../components/scroll-to-top-wrapper";
import { useAppSelector } from "../redux/hooks";
import { USER_ID } from "../constants";
import PlaceholderWrapper from "../components/placeholder-wrapper";

const LoginPage = lazy(() => import("../components/pages/login-page"));
const EventsPage = lazy(() => import("../components/pages/events-page"));
const EventsSingleViewPage = lazy(
  () => import("../components/pages/events-single-view-page"),
);
const ProfilePage = lazy(() => import("../components/pages/profile-page"));

function routes() {
  const access = useAppSelector(({ user }) => user?.access);

  return (
    <Router>
      <ScrollToTopWrapper>
        <QueryParamProvider
          ReactRouterRoute={Route}
          stringifyOptions={{ skipEmptyString: true, skipNull: true }}
        >
          <Suspense fallback={<PlaceholderWrapper isLoading placeholder />}>
            <Switch>
              <Route path={LOGIN_PATH} exact>
                {access ? <Redirect to={EVENTS_PATH} /> : <LoginPage />}
              </Route>

              {!access && <Redirect to={LOGIN_PATH} />}

              <Route path={EVENTS_PATH} exact strict>
                <EventsPage />
              </Route>

              <Route path={EVENTS_SINGLE_VIEW_PATH} exact strict>
                <EventsSingleViewPage />
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
                path={[
                  PROFILE_LIKES_PATH,
                  PROFILE_GOING_PATH,
                  PROFILE_PAST_PATH,
                ]}
                exact
                strict
              >
                <ProfilePage />
              </Route>

              <Redirect to={LOGIN_PATH} />
            </Switch>
          </Suspense>
        </QueryParamProvider>
      </ScrollToTopWrapper>
    </Router>
  );
}

export default routes;
