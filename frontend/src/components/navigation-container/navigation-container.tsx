import { ReactNode, useContext, useEffect, useState } from "react";
import { Sidebar, Menu, Container } from "semantic-ui-react";
import SearchTab from "../search-tab";
import LogoTab from "../logo-tab";
import UserTab from "../user-tab";
import styles from "./navigation-container.module.scss";
import { UserContext } from "../../context-providers";

type Props = {
  children: ReactNode;
};

function NavigationContainer({ children }: Props) {
  const { access } = useContext(UserContext);
  const [isSidebarOpened, setSidebarOpened] = useState(false);

  useEffect(() => setSidebarOpened(false), []);

  return (
    <>
      {access ? (
        <Sidebar.Pushable className={styles.navigationContainer}>
          <Sidebar
            as={Menu}
            animation="push"
            onHide={() => setSidebarOpened(false)}
            vertical
            visible={isSidebarOpened}
          />

          <Sidebar.Pusher dimmed={isSidebarOpened}>
            <Menu className={styles.appBar} borderless size="huge" fixed="top">
              <SearchTab onTabClick={() => setSidebarOpened(true)} />
              <LogoTab />
              <UserTab />
            </Menu>

            <div className={styles.pageContainer}>
              <Container>{children}</Container>
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
