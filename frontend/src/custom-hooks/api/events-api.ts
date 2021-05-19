import { useCallback, useState } from "react";
import { stringifyUrl } from "query-string";
import { snakeCase } from "change-case";
import { useAxiosWithTokenRefresh } from "./auth-api";
import { errorHandlerWrapper, resolveApiError } from "../../utils/error-utils";
import { changeKeyCase } from "../../utils/parser-utils";
import {
  EventCategoryData,
  EventData,
  EventGetQueryParams,
} from "../../types/events";

export function useGetCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventCategoryData[]>(
    {
      url: "/events/categories",
      method: "get",
    },
    { manual: true },
  );

  const getCategories = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const { data: categories = [] } = await apiCall();
        console.log("GET /events/categories success:", categories);
        const categoryNames = categories.map((category) => category.name);
        setCategories(categoryNames);
        return categoryNames;
      }, "GET /events/categories error")();
    } catch (error) {
      resolveApiError(error);

      setCategories([]);
      return [];
    }
  }, [apiCall]);

  return { categories, isLoading: loading, getCategories };
}

export function useGetEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData[]>(
    {
      method: "get",
    },
    { manual: true },
  );

  const getEvents = useCallback(
    async (queryParams?: EventGetQueryParams) => {
      const url = stringifyUrl(
        {
          url: "/events/",
          query: changeKeyCase(snakeCase, queryParams),
        },
        { skipNull: true, skipEmptyString: true },
      );

      try {
        return await errorHandlerWrapper(async () => {
          const { data: events = [] } = await apiCall({ url });
          console.log(`GET ${url} success:`, events);
          setEvents(events);
          return events;
        }, `GET ${url} error`)();
      } catch (error) {
        resolveApiError(error);

        setEvents([]);
        return [];
      }
    },
    [apiCall],
  );

  return { events, isLoading: loading, getEvents };
}
