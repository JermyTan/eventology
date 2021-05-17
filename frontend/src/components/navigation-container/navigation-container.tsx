import { ReactNode, useContext, useEffect, useState } from "react";
import { Sidebar, Menu, Container, Segment } from "semantic-ui-react";
import SearchTab from "../search-tab";
import LogoTab from "../logo-tab";
import UserTab from "../user-tab";
import styles from "./navigation-container.module.scss";
import { UserContext } from "../../context-providers";
import { PageBodyContext } from "../../context-providers";

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
          <Sidebar
            as={Segment}
            animation="push"
            onHide={() => setSidebarOpened(false)}
            vertical
            visible={isSidebarOpened}
          >
            <h1>This is the search bar</h1>
          </Sidebar>

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
              <Segment vertical>
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
