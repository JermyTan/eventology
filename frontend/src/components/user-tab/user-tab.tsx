import { useCallback, useContext } from "react";
import classNames from "classnames";
import { Dropdown, Menu, Image } from "semantic-ui-react";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import { Media, UserContext } from "../../context-providers";
import { PROFILE_PATH } from "../../routes/paths";
import defaultAvatarImage from "../../assets/avatar.png";

function UserTab() {
  const { name, updateUser } = useContext(UserContext);
  const { pathname } = useLocation();

  const onSignOut = useCallback(() => {
    updateUser(null);
    toast.success("Signed out successfully.");
  }, [updateUser]);

  return (
    <Menu.Menu>
      <Media className="item" greaterThanOrEqual="computer">
        <strong>{name}</strong>
      </Media>

      <Dropdown
        className={classNames({ active: pathname.startsWith(PROFILE_PATH) })}
        trigger={
          <Image src={defaultAvatarImage} alt="" avatar bordered size="mini" />
        }
        icon={null}
        floating
        item
        direction="left"
      >
        <Dropdown.Menu>
          <Dropdown.Item
            as={Link}
            to={PROFILE_PATH}
            active={pathname.startsWith(PROFILE_PATH)}
            text="Profile"
            icon="user"
          />
          <Dropdown.Item onClick={onSignOut} text="Sign Out" icon="sign out" />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
}

export default UserTab;
