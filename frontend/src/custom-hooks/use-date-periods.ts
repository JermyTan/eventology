import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
} from "date-fns";
import { useMemo } from "react";

function useDatePeriods(currentDateTime: number) {
  const today = useMemo(
    () =>
      `${startOfDay(currentDateTime).getTime()}-${endOfDay(
        currentDateTime,
      ).getTime()}`,
    [currentDateTime],
  );

  const tomorrow = useMemo(() => {
    const nextDay = addDays(currentDateTime, 1);
    return `${startOfDay(nextDay).getTime()}-${endOfDay(nextDay).getTime()}`;
  }, [currentDateTime]);

  const thisWeek = useMemo(
    () =>
      `${startOfWeek(currentDateTime, {
        weekStartsOn: 1,
      }).getTime()}-${endOfWeek(currentDateTime, {
        weekStartsOn: 1,
      }).getTime()}`,
    [currentDateTime],
  );

  const thisMonth = useMemo(
    () =>
      `${startOfMonth(currentDateTime).getTime()}-${endOfMonth(
        currentDateTime,
      ).getTime()}`,
    [currentDateTime],
  );

  return { today, tomorrow, thisWeek, thisMonth };
}

export default useDatePeriods;
