import { Link } from "react-router-dom";
import { Icon, MenuItem } from "semantic-ui-react";
import { EVENTS_PATH } from "../../routes/paths";

function HomeTab() {
  return (
    <MenuItem
      as={Link}
      to={EVENTS_PATH}
      icon={<Icon name="home" size="large" />}
    />
  );
}

export default HomeTab;
