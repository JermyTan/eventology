import { Icon } from "semantic-ui-react";
import { IconProps } from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";

type Props = {
  className?: string;
  size?: IconProps["size"];
};

function IconLoader({ className, size }: Props) {
  return <Icon className={className} name="spinner" loading size={size} />;
}

export default IconLoader;
