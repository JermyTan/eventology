import { ReactNode, useContext, useEffect, useState } from "react";
import { Sidebar, Menu, Container, Segment } from "semantic-ui-react";
import SearchTab from "../search-tab";
import LogoTab from "../logo-tab";
import UserTab from "../user-tab";
import SearchSidebar from "../search-sidebar";
import { UserContext, PageBodyContext } from "../../context-providers";
import styles from "./navigation-container.module.scss";

type Props = {
  children: ReactNode;
};

function NavigationContainer({ children }: Props) {
  const { access } = useContext(UserContext);
  const { setPageBody } = useContext(PageBodyContext);
  const [isSidebarOpened, setSidebarOpened] = useState(false);

  useEffect(() => setSidebarOpened(false), []);

  return (
    <>
      {access ? (
        <Sidebar.Pushable className={styles.navigationContainer}>
          <SearchSidebar
            isSidebarOpened={isSidebarOpened}
            setSidebarOpened={setSidebarOpened}
          />

          <Sidebar.Pusher className={styles.pageContainer}>
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
