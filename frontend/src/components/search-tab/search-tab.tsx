import { MenuItem } from "semantic-ui-react";

type Props = {
  onTabClick?: () => void;
};

function SearchTab({ onTabClick }: Props) {
  return <MenuItem onClick={onTabClick} icon="search" />;
}

export default SearchTab;
