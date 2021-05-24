import { ReactNode } from "react";
import classNames from "classnames";
import { Container } from "semantic-ui-react";
import styles from "./tabs-section.module.scss";

export type Tab = {
  key: string;
  label: string;
  icon?: ReactNode;
  isActive?: boolean;
};

type Props = {
  className?: string;
  tabs: Tab[];
  onTabClick: (key: string) => void;
};

function TabsSection({ className, tabs, onTabClick }: Props) {
  return (
    <div className={classNames(styles.tabsSection, className)}>
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
    </div>
  );
}

export default TabsSection;
