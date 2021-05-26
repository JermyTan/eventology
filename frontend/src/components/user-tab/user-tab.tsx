import { useCallback, useContext } from "react";
import classNames from "classnames";
import { Dropdown, Menu, Image } from "semantic-ui-react";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import { Media, UserContext } from "../../context-providers";
import { PROFILE_MAIN_PATH } from "../../routes/paths";
import { USER_ID } from "../../constants";
import defaultAvatarImage from "../../assets/avatar.png";
import styles from "./user-tab.module.scss";

function UserTab() {
  const { id, name, updateUser, profileImageUrl } = useContext(UserContext);
  const { pathname } = useLocation();
  const userProfilePath = PROFILE_MAIN_PATH.replace(`:${USER_ID}`, `${id}`);

  const onSignOut = useCallback(() => {
    updateUser(null);
    toast.success("Signed out successfully.");
  }, [updateUser]);

  return (
    <Menu.Menu className={styles.userTab}>
      <Media className="item" greaterThanOrEqual="computer">
        <strong className={styles.nameLabel}>{name}</strong>
      </Media>

      <Dropdown
        className={classNames({ active: pathname.startsWith(userProfilePath) })}
        trigger={
          <Image
            src={profileImageUrl || defaultAvatarImage}
            alt=""
            avatar
            bordered
            size="mini"
          />
        }
        icon={null}
        floating
        item
        direction="left"
      >
        <Dropdown.Menu>
          <Dropdown.Item
            as={Link}
            to={userProfilePath}
            active={pathname.startsWith(userProfilePath)}
            text="My Profile"
            icon="user"
          />
          <Dropdown.Item onClick={onSignOut} text="Sign Out" icon="sign out" />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default UserTab;
