import { ReactNode } from "react";
import classNames from "classnames";
import { Segment, Container } from "semantic-ui-react";
import styles from "./tabs-section.module.scss";

export type Tab = {
  key: string;
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
};

type Props = {
  tabs: Tab[];
  onTabClick: (key: string) => void;
};

function TabsSection({ tabs, onTabClick }: Props) {
  return (
    <Segment className={styles.tabsSection} vertical>
      <Container className={styles.tabsContainer}>
        {tabs.flatMap(({ key, label, icon, isActive }, index) => {
          const components = [
            <div
              key={`${index}-${key}`}
              className={classNames(styles.tab, isActive && styles.active)}
              onClick={() => onTabClick(key)}
            >
              {icon && <span className={styles.iconContainer}>{icon}</span>}
              {label}
            </div>,
          ];

          if (index < tabs.length - 1) {
            components.push(
              <div
                key={`${index}-divider`}
                className={styles.verticalDivider}
              />,
            );
          }

          return components;
        })}
      </Container>
    </Segment>
  );
}

export default TabsSection;
