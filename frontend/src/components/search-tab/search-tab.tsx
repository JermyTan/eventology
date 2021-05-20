import { Icon, MenuItem } from "semantic-ui-react";

type Props = {
  onTabClick?: () => void;
};

function SearchTab({ onTabClick }: Props) {
  return (
    <MenuItem onClick={onTabClick} icon={<Icon name="search" size="large" />} />
  );
}

export default SearchTab;
