import { MouseEvent, KeyboardEventHandler, useRef } from "react";
import classNames from "classnames";
import isEqual from "lodash.isequal";
import { startOfToday, endOfDay } from "date-fns";
import { Label, LabelProps } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSelectedDatePeriod } from "../../redux/slices/search-slice";
import { DATE_FORMAT_3, DATE_PERIOD_SEPARATOR } from "../../constants";
import { displayDateTime, parseDateTime } from "../../utils/parser-utils";
import styles from "./search-date-section.module.scss";

function SearchDateSection() {
  const {
    selectedDatePeriod,
    datePeriods: { today, tomorrow, thisWeek, thisMonth },
  } = useAppSelector(
    ({ search: { selectedDatePeriod, datePeriods } }) => ({
      selectedDatePeriod,
      datePeriods,
    }),
    isEqual,
  );
  const dispatch = useAppDispatch();

  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);
  const [startDate = "", endDate = ""] = selectedDatePeriod.split(
    DATE_PERIOD_SEPARATOR,
  );

  const isLaterActive = ![
    DATE_PERIOD_SEPARATOR,
    today,
    tomorrow,
    thisWeek,
    thisMonth,
  ].includes(selectedDatePeriod);

  const onLabelClick: (
    event: MouseEvent<HTMLElement, globalThis.MouseEvent>,
    data: LabelProps,
  ) => void = (_, { value }) => dispatch(setSelectedDatePeriod(value));

  const onKeyDownInput: KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
    if (key !== "Enter") {
      return;
    }

    const startDateInputValue = startDateInputRef.current?.value;
    const endDateInputValue = endDateInputRef.current?.value;

    const newStartDate = (
      startDateInputValue
        ? parseDateTime(startDateInputValue, DATE_FORMAT_3) || ""
        : ""
    ).toString();
    const newEndDate = (
      endDateInputValue
        ? endOfDay(parseDateTime(endDateInputValue, DATE_FORMAT_3)).getTime() ||
          ""
        : ""
    ).toString();

    dispatch(
      setSelectedDatePeriod(
        `${newStartDate}${DATE_PERIOD_SEPARATOR}${newEndDate}`,
      ),
    );
  };

  return (
    <div className={styles.searchDateSection}>
      <Label.Group>
        <Label
          className={classNames(
            styles.label,
            selectedDatePeriod === DATE_PERIOD_SEPARATOR && styles.active,
          )}
          circular
          content="ANYTIME"
          value={DATE_PERIOD_SEPARATOR}
          onClick={onLabelClick}
        />

        <Label
          className={classNames(
            styles.label,
            selectedDatePeriod === today && styles.active,
          )}
          circular
          content="TODAY"
          value={today}
          onClick={onLabelClick}
        />

        <Label
          className={classNames(
            styles.label,
            selectedDatePeriod === tomorrow && styles.active,
          )}
          circular
          content="TOMORROW"
          value={tomorrow}
          onClick={onLabelClick}
        />

        <Label
          className={classNames(
            styles.label,
            selectedDatePeriod === thisWeek && styles.active,
          )}
          circular
          content="THIS WEEK"
          value={thisWeek}
          onClick={onLabelClick}
        />

        <Label
          className={classNames(
            styles.label,
            selectedDatePeriod === thisMonth && styles.active,
          )}
          circular
          content="THIS MONTH"
          value={thisMonth}
          onClick={onLabelClick}
        />

        <Label
          className={classNames(styles.label, isLaterActive && styles.active)}
          circular
          content="LATER"
          value={`${startOfToday()
            .getTime()
            .toString()}${DATE_PERIOD_SEPARATOR}`}
          onClick={onLabelClick}
        />
      </Label.Group>

      {isLaterActive && (
        <div className={styles.dateInputContainer}>
          <div className={styles.dateInput}>
            <i className="far fa-arrow-from-left icon" />
            <input
              ref={startDateInputRef}
              type="date"
              defaultValue={displayDateTime(startDate, DATE_FORMAT_3)}
              onKeyDown={onKeyDownInput}
              max="9999-12-31"
              min="1970-01-01"
            />
          </div>

          <div className={styles.dateInput}>
            <i className="far fa-arrow-from-right icon" />
            <input
              ref={endDateInputRef}
              type="date"
              defaultValue={displayDateTime(endDate, DATE_FORMAT_3)}
              onKeyDown={onKeyDownInput}
              max="9999-12-31"
              min="1970-01-01"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchDateSection;
