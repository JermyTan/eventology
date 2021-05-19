import { ReactNode, useContext, useEffect } from "react";
import { Sidebar, Menu, Container, Segment } from "semantic-ui-react";
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

type Props = {
  children: ReactNode;
};

function NavigationContainer({ children }: Props) {
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
              <SearchTab onTabClick={() => setSidebarOpened(true)} />
              <LogoTab />
              <UserTab />
            </Menu>

            <div
              ref={(pageBody) => setPageBody(pageBody ?? undefined)}
              className={styles.bodyContainer}
            >
              <Segment vertical className={styles.verticalPaddingContainer}>
                <Container>{children}</Container>
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
