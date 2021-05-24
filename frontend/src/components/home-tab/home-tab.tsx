import { Link } from "react-router-dom";
import { MenuItem } from "semantic-ui-react";
import { EVENTS_PATH } from "../../routes/paths";

function HomeTab() {
  return (
    <MenuItem
      as={Link}
      to={EVENTS_PATH}
      icon={<i className="fas fa-home-lg-alt large icon" />}
    />
  );
}

export default HomeTab;
