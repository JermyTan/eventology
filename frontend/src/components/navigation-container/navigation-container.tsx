import { ReactNode, useContext, useEffect } from "react";
import classNames from "classnames";
import { Sidebar, Menu, Segment } from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import SearchTab from "../search-tab";
import LogoTab from "../logo-tab";
import UserTab from "../user-tab";
import SearchSidebar from "../search-sidebar";
import {
  UserContext,
  PageBodyContext,
  SearchContext,
} from "../../context-providers";
import styles from "./navigation-container.module.scss";
import { PROFILE_PATH } from "../../routes/paths";
import HomeTab from "../home-tab";

type Props = {
  children: ReactNode;
};

function NavigationContainer({ children }: Props) {
  const { pathname } = useLocation();
  const { access } = useContext(UserContext);
  const { setPageBody } = useContext(PageBodyContext);
  const { isSidebarOpened, setSidebarOpened } = useContext(SearchContext);

  useEffect(() => {
    if (!access) {
      setSidebarOpened(false);
    }
  }, [setSidebarOpened, access]);

  return (
    <>
      {access ? (
        <Sidebar.Pushable className={styles.navigationContainer}>
          <SearchSidebar />

          <Sidebar.Pusher
            className={styles.pageContainer}
            dimmed={isSidebarOpened}
          >
            <Menu className={styles.appBar} borderless size="huge">
              <div className={classNames(styles.tabContainer, styles.leftTab)}>
                {pathname.startsWith(PROFILE_PATH) ? (
                  <HomeTab />
                ) : (
                  <SearchTab onTabClick={() => setSidebarOpened(true)} />
                )}
              </div>

              <div
                className={classNames(styles.tabContainer, styles.centerTab)}
              >
                <LogoTab />
              </div>

              <div className={classNames(styles.tabContainer, styles.rightTab)}>
                <UserTab />
              </div>
            </Menu>

            <div
              ref={(pageBody) => setPageBody(pageBody ?? undefined)}
              className={styles.bodyContainer}
            >
              <Segment vertical className={styles.verticalPaddingContainer}>
                {children}
              </Segment>
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      ) : (
        children
      )}
    </>
  );
}

export default NavigationContainer;
