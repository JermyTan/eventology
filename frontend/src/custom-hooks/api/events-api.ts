import { useAxiosWithTokenRefresh } from "./auth-api";
import { EventData } from "../../types/events";
import { errorHandlerWrapper, resolveApiError } from "../../utils/error-utils";
import { useCallback, useState } from "react";

export function useGetEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventData[]>(
    {
      url: "/events/",
      method: "get",
    },
    { manual: true },
  );

  const getEvents = useCallback(async () => {
    try {
      return await errorHandlerWrapper(async () => {
        const { data: events = [] } = await apiCall();
        console.log("GET /events/ success:", events);
        setEvents(events);
        return events;
      }, "GET /events/ error")();
    } catch (error) {
      resolveApiError(error);

      setEvents([]);
      return [];
    }
  }, [apiCall]);

  return { events, isLoading: loading, getEvents };
}
