import { MouseEvent } from "react";
import classNames from "classnames";
import isEqual from "lodash.isequal";
import { Label, LabelProps } from "semantic-ui-react";
import styles from "./search-date-section.module.scss";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSelectedDate } from "../../redux/slices/search-slice";

function SearchDateSection() {
  const {
    selectedDate,
    datePeriods: { today, tomorrow, thisWeek, thisMonth },
  } = useAppSelector(
    ({ search: { selectedDate, datePeriods } }) => ({
      selectedDate,
      datePeriods,
    }),
    isEqual,
  );
  const dispatch = useAppDispatch();

  const onLabelClick: (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    data: LabelProps,
  ) => void = (_, { value }) => dispatch(setSelectedDate(value));

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
