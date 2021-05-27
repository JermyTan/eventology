import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
} from "date-fns";

export function getDatePeriods({
  currentDateTime,
}: {
  currentDateTime: number;
}) {
  const today = `${startOfDay(currentDateTime).getTime()}-${endOfDay(
    currentDateTime,
  ).getTime()}`;

  const tomorrow = `${startOfDay(
    addDays(currentDateTime, 1),
  ).getTime()}-${endOfDay(addDays(currentDateTime, 1)).getTime()}`;

  const thisWeek = `${startOfWeek(currentDateTime, {
    weekStartsOn: 1,
  }).getTime()}-${endOfWeek(currentDateTime, {
    weekStartsOn: 1,
  }).getTime()}`;

  const thisMonth = `${startOfMonth(currentDateTime).getTime()}-${endOfMonth(
    currentDateTime,
  ).getTime()}`;

  return { today, tomorrow, thisWeek, thisMonth };
}
