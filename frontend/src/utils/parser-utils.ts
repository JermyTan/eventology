import { format, parse } from "date-fns";
import { StringifiableRecord } from "query-string";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { DATE_FORMAT_2, DATE_TIME_FORMAT, RELATIVE } from "../constants";
import useSearchQueryParams from "../custom-hooks/use-search-query-params";

TimeAgo.addLocale(en);
TimeAgo.setDefaultLocale("en");

const timeAgo = new TimeAgo("en-US");

export function deepTrim<T>(value: T): T {
  const unknownValue = value as unknown;

  if (Array.isArray(unknownValue)) {
    return unknownValue.map((item) => deepTrim(item)) as unknown as T;
  }

  if (typeof unknownValue === "object" && unknownValue !== null) {
    return Object.keys(unknownValue).reduce((all, key) => {
      all[key] = deepTrim((unknownValue as Record<string, unknown>)[key]);
      return all;
    }, {} as Record<string, unknown>) as T;
  }

  if (typeof unknownValue === "string") {
    return unknownValue.trim() as unknown as T;
  }

  return value;
}

export function parseDateTime(
  dateString: string,
  dateTimeFormat: string = DATE_TIME_FORMAT,
) {
  return parse(dateString, dateTimeFormat, new Date()).getTime();
  // return isNaN(dateTime) ? "" : dateTime;
}

export function displayDateTime(
  inputDateTime: string | number | Date,
  dateTimeFormat: typeof RELATIVE | string = DATE_TIME_FORMAT,
): string {
  try {
    const dateTime =
      typeof inputDateTime === "string"
        ? parseInt(inputDateTime, 10)
        : inputDateTime;

    return dateTimeFormat === RELATIVE
      ? timeAgo.format(dateTime)
      : format(dateTime, dateTimeFormat);
  } catch {
    return "";
  }
}

export function changeKeyCase(
  caseChanger: (input: string) => string,
  object?: StringifiableRecord,
) {
  if (!object) {
    return object;
  }

  const newObject: StringifiableRecord = {};

  Object.entries(object).forEach(([key, value]) => {
    newObject[caseChanger(key)] = value;
  });

  return newObject;
}

export function displaySearchedEventCategoryAndDateTime({
  category,
  startDateTime,
  endDateTime,
}: ReturnType<typeof useSearchQueryParams>["searchQuery"]) {
  const searchedCategory = category || "All";

  const formattedStartDateTime = startDateTime
    ? displayDateTime(startDateTime, DATE_FORMAT_2)
    : undefined;

  const formattedEndDateTime = endDateTime
    ? displayDateTime(endDateTime, DATE_FORMAT_2)
    : undefined;

  if (!formattedStartDateTime && !formattedEndDateTime) {
    return `${searchedCategory} events`;
  }

  if (!formattedStartDateTime || !formattedEndDateTime) {
    return `${searchedCategory} events ${
      formattedStartDateTime
        ? `from ${formattedStartDateTime}`
        : `to ${formattedEndDateTime}`
    }`;
  }

  if (formattedStartDateTime === formattedEndDateTime) {
    return `${searchedCategory} events on ${formattedStartDateTime}`;
  }

  return `${searchedCategory} events from ${formattedStartDateTime} to ${formattedEndDateTime}`;
}
