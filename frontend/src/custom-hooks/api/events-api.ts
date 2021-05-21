import { useCallback, useMemo, useState } from "react";
import { stringifyUrl } from "query-string";
import { snakeCase } from "change-case";
import { useAxiosWithTokenRefresh } from "./auth-api";
import { errorHandlerWrapper, resolveApiError } from "../../utils/error-utils";
import { changeKeyCase } from "../../utils/parser-utils";
import {
  EventCategoryData,
  EventCommentData,
  EventCommentDeleteData,
  EventCommentPostData,
  EventData,
  EventGetQueryParams,
  EventLikeData,
  EventLikeDeleteData,
  EventLikeGetQueryParams,
  EventLikePostData,
  EventSignUpData,
  EventSignUpDeleteData,
  EventSignUpGetQueryParams,
  EventSignUpPostData,
} from "../../types/events";

export function useGetEventCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventCategoryData[]>(
    {
      url: "/events/categories",
      method: "get",
    },
    { manual: true },
  );

  const getEventCategories = useCallback(async () => {
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

  return { categories, isLoading: loading, getEventCategories };
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

export function useGetEventSignUps() {
  const [eventSignUps, setEventSignUps] = useState<EventSignUpData[]>([]);

  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventSignUpData[]>(
    {
      method: "get",
    },
    { manual: true },
  );

  const getEventSignUps = useCallback(
    async (queryParams?: EventSignUpGetQueryParams) => {
      const url = stringifyUrl(
        {
          url: "/events/signups",
          query: changeKeyCase(snakeCase, queryParams),
        },
        { skipNull: true, skipEmptyString: true },
      );

      try {
        return await errorHandlerWrapper(async () => {
          const { data: eventSignUps = [] } = await apiCall({ url });
          console.log(`GET ${url} success:`, eventSignUps);
          setEventSignUps(eventSignUps);
          return eventSignUps;
        }, `GET ${url} error`)();
      } catch (error) {
        resolveApiError(error);

        setEventSignUps([]);
        return [];
      }
    },
    [apiCall],
  );

  return { eventSignUps, isLoading: loading, getEventSignUps };
}

export function useCreateEventSignUp() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventSignUpData>(
    {
      url: "/events/signups",
      method: "post",
    },
    { manual: true },
  );

  const createEventSignUp = useMemo(
    () =>
      errorHandlerWrapper(async (data: EventSignUpPostData) => {
        console.log("POST /events/signups data:", data);

        const { data: signUp } = await apiCall({ data });

        console.log("POST /events/signups success:", signUp);

        return signUp;
      }, "POST /events/signups error"),
    [apiCall],
  );

  return { createEventSignUp, isLoading: loading };
}

export function useDeleteEventSignUps() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventSignUpData>(
    {
      url: "/events/signups",
      method: "delete",
    },
    { manual: true },
  );

  const deleteEventSignUps = useMemo(
    () =>
      errorHandlerWrapper(async (data: EventSignUpDeleteData) => {
        console.log("DELETE /events/signups data:", data);

        const { data: deletedSignUp } = await apiCall({ data });

        console.log("DELETE /events/signups success:", deletedSignUp);

        return deletedSignUp;
      }, "DELETE /events/signups error"),
    [apiCall],
  );

  return { deleteEventSignUps, isLoading: loading };
}

export function useGetEventLikes() {
  const [eventLikes, setEventLikes] = useState<EventLikeData[]>([]);

  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventLikeData[]>(
    {
      method: "get",
    },
    { manual: true },
  );

  const getEventLikes = useCallback(
    async (queryParams?: EventLikeGetQueryParams) => {
      const url = stringifyUrl(
        {
          url: "/events/likes",
          query: changeKeyCase(snakeCase, queryParams),
        },
        { skipNull: true, skipEmptyString: true },
      );

      try {
        return await errorHandlerWrapper(async () => {
          const { data: eventLikes = [] } = await apiCall({ url });
          console.log(`GET ${url} success:`, eventLikes);
          setEventLikes(eventLikes);
          return eventLikes;
        }, `GET ${url} error`)();
      } catch (error) {
        resolveApiError(error);

        setEventLikes([]);
        return [];
      }
    },
    [apiCall],
  );

  return { eventLikes, isLoading: loading, getEventLikes };
}

export function useCreateEventLike() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventLikeData>(
    {
      url: "/events/likes",
      method: "post",
    },
    { manual: true },
  );

  const createEventLike = useMemo(
    () =>
      errorHandlerWrapper(async (data: EventLikePostData) => {
        console.log("POST /events/likes data:", data);

        const { data: like } = await apiCall({ data });

        console.log("POST /events/likes success:", like);

        return like;
      }, "POST /events/likes error"),
    [apiCall],
  );

  return { createEventLike, isLoading: loading };
}

export function useDeleteEventLikes() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventLikeData>(
    {
      url: "/events/likes",
      method: "delete",
    },
    { manual: true },
  );

  const deleteEventLikes = useMemo(
    () =>
      errorHandlerWrapper(async (data: EventLikeDeleteData) => {
        console.log("DELETE /events/likes data:", data);

        const { data: deletedLike } = await apiCall({ data });

        console.log("DELETE /events/likes success:", deletedLike);

        return deletedLike;
      }, "DELETE /events/likes error"),
    [apiCall],
  );

  return { deleteEventLikes, isLoading: loading };
}

export function useCreateEventComment() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventCommentData>(
    {
      url: "/events/comments",
      method: "post",
    },
    { manual: true },
  );

  const createEventComment = useMemo(
    () =>
      errorHandlerWrapper(async (data: EventCommentPostData) => {
        console.log("POST /events/comments data:", data);

        const { data: comment } = await apiCall({ data });

        console.log("POST /events/comments success:", comment);

        return comment;
      }, "POST /events/comments error"),
    [apiCall],
  );

  return { createEventComment, isLoading: loading };
}

export function useDeleteEventComments() {
  const [{ loading }, apiCall] = useAxiosWithTokenRefresh<EventCommentData[]>(
    {
      url: "/events/comments",
      method: "delete",
    },
    { manual: true },
  );

  const deleteEventComments = useMemo(
    () =>
      errorHandlerWrapper(async (data: EventCommentDeleteData) => {
        console.log("DELETE /events/comments data:", data);

        const { data: deletedComments } = await apiCall({ data });

        console.log("DELETE /events/comments success:", deletedComments);

        return deletedComments;
      }, "DELETE /events/comments error"),
    [apiCall],
  );

  return { deleteEventComments, isLoading: loading };
}
