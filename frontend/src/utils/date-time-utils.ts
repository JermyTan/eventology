import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
} from "date-fns";
import { DATE_PERIOD_SEPARATOR } from "../constants";

export function getDatePeriods({
  currentDateTime,
}: {
  currentDateTime: number;
}) {
  const today = `${startOfDay(
    currentDateTime,
  ).getTime()}${DATE_PERIOD_SEPARATOR}${endOfDay(currentDateTime).getTime()}`;

  const tomorrow = `${startOfDay(
    addDays(currentDateTime, 1),
  ).getTime()}${DATE_PERIOD_SEPARATOR}${endOfDay(
    addDays(currentDateTime, 1),
  ).getTime()}`;

  const thisWeek = `${startOfWeek(currentDateTime, {
    weekStartsOn: 1,
  }).getTime()}${DATE_PERIOD_SEPARATOR}${endOfWeek(currentDateTime, {
    weekStartsOn: 1,
  }).getTime()}`;

  const thisMonth = `${startOfMonth(
    currentDateTime,
  ).getTime()}${DATE_PERIOD_SEPARATOR}${endOfMonth(currentDateTime).getTime()}`;

  return { today, tomorrow, thisWeek, thisMonth };
}
