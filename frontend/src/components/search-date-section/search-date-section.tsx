import { useCallback, MouseEvent, useContext } from "react";
import classNames from "classnames";
import { Label, LabelProps } from "semantic-ui-react";
import styles from "./search-date-section.module.scss";
import { SearchContext } from "../../context-providers";

function SearchDateSection() {
  const {
    selectedDate,
    setSelectedDate,
    datePeriods: { today, tomorrow, thisWeek, thisMonth },
  } = useContext(SearchContext);

  const onLabelClick: (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    data: LabelProps,
  ) => void = useCallback(
    (_, { value }) => {
      setSelectedDate((selectedDate) =>
        selectedDate === undefined || selectedDate !== value
          ? value
          : undefined,
      );
    },
    [setSelectedDate],
  );

  return (
    <Label.Group className={styles.searchDateSection}>
      <Label
        className={classNames(styles.label, {
          [styles.active]: selectedDate === "",
        })}
        circular
        content="ANYTIME"
        value=""
        onClick={onLabelClick}
      />

      <Label
        className={classNames(styles.label, {
          [styles.active]: selectedDate === today,
        })}
        circular
        content="TODAY"
        value={today}
        onClick={onLabelClick}
      />

      <Label
        className={classNames(styles.label, {
          [styles.active]: selectedDate === tomorrow,
        })}
        circular
        content="TOMORROW"
        value={tomorrow}
        onClick={onLabelClick}
      />

      <Label
        className={classNames(styles.label, {
          [styles.active]: selectedDate === thisWeek,
        })}
        circular
        content="THIS WEEK"
        value={thisWeek}
        onClick={onLabelClick}
      />

      <Label
        className={classNames(styles.label, {
          [styles.active]: selectedDate === thisMonth,
        })}
        circular
        content="THIS MONTH"
        value={thisMonth}
        onClick={onLabelClick}
      />

      <Label
        className={classNames(styles.label, {
          [styles.active]: selectedDate === "later",
        })}
        circular
        content="LATER"
        onClick={onLabelClick}
      />
    </Label.Group>
  );
}

export default SearchDateSection;
