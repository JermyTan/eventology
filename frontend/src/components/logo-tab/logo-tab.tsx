import { Image, MenuItem } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { EVENTS_PATH } from "../../routes/paths";
import catLogo from "../../assets/logo-cat-green.svg";

type Props = {
  onTabClick?: () => void;
};

function LogoTab({ onTabClick }: Props) {
  return (
    <MenuItem>
      <Image
        as={Link}
        to={EVENTS_PATH}
        onClick={onTabClick}
        src={catLogo}
        alt="Black Cat"
        size="mini"
      />
    </MenuItem>
  );
}

export default LogoTab;
