import { ReactNode } from "react";
import classNames from "classnames";
import { Menu } from "semantic-ui-react";
import styles from "./top-bar.module.scss";
import HomeTab from "../home-tab";
import LogoTab from "../logo-tab";
import UserTab from "../user-tab";

type Props = {
  leftTab?: ReactNode;
  middleTab?: ReactNode;
  rightTab?: ReactNode;
};

function TopBar({
  leftTab = <HomeTab />,
  middleTab = <LogoTab />,
  rightTab = <UserTab />,
}: Props) {
  return (
    <Menu
      className={classNames(styles.topBar, styles.important)}
      borderless
      size="large"
    >
      <div className={classNames(styles.tabContainer, styles.left)}>
        {leftTab}
      </div>

      <div className={classNames(styles.tabContainer, styles.center)}>
        {middleTab}
      </div>

      <div className={classNames(styles.tabContainer, styles.right)}>
        {rightTab}
      </div>
    </Menu>
  );
}

export default TopBar;
