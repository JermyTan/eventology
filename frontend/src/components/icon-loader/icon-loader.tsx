import { Icon } from "semantic-ui-react";

type Props = {
  className?: string;
};

function IconLoader({ className }: Props) {
  return <Icon className={className} name="spinner" loading />;
}

export default IconLoader;
