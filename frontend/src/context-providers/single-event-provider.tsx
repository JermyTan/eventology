import {
  createContext,
  ReactNode,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  ElementRef,
  useMemo,
} from "react";
import {
  useCreateEventComment,
  useCreateEventLike,
  useCreateEventSignUp,
  useDeleteEventLike,
  useDeleteEventSignUp,
  useGetEventComments,
  useGetSingleEvent,
} from "../custom-hooks/api/events-api";
import VirtualizedList from "../components/virtualized-list";
import { EventCommentData, EventData } from "../types/events";

type SingleEventContextType = {
  event?: EventData;
  getSingleEvent: () => Promise<EventData | undefined>;
  createEventComment: (content: string) => Promise<EventCommentData[]>;
  createEventSignUp: () => Promise<EventData | undefined>;
  createEventLike: () => Promise<EventData | undefined>;
  deleteEventSignUp: () => Promise<EventData | undefined>;
  deleteEventLike: () => Promise<EventData | undefined>;
  setEventList: Dispatch<
    SetStateAction<ElementRef<typeof VirtualizedList> | null>
  >;
  setCommentList: Dispatch<
    SetStateAction<ElementRef<typeof VirtualizedList> | null>
  >;
};

export const SingleEventContext = createContext<SingleEventContextType>({
  getSingleEvent: () => {
    throw new Error("getSingleEvent is not defined.");
  },
  createEventComment: () => {
    throw new Error("createEventComment is not defined.");
  },
  createEventSignUp: () => {
    throw new Error("createEventSignUp is not defined.");
  },
  createEventLike: () => {
    throw new Error("createEventLike is not defined.");
  },
  deleteEventSignUp: () => {
    throw new Error("deleteEventSignUp is not defined.");
  },
  deleteEventLike: () => {
    throw new Error("deleteEventLike is not defined.");
  },
  setEventList: () => {
    throw new Error("setEventList is not defined.");
  },
  setCommentList: () => {
    throw new Error("setCommentList is not defined.");
  },
});

type Props = {
  eventId: string | number;
  children: ReactNode;
};

function SingleEventProvider({ eventId, children }: Props) {
  const [event, setEvent] = useState<EventData>();
  const [eventList, setEventList] =
    useState<ElementRef<typeof VirtualizedList> | null>(null);
  const [commentList, setCommentList] =
    useState<ElementRef<typeof VirtualizedList> | null>(null);
  const { getSingleEvent: _getSingleEvent } = useGetSingleEvent();
  const { createEventComment: _createEventComment } = useCreateEventComment();
  const { getEventComments } = useGetEventComments();
  const { createEventSignUp: _createEventSignUp } = useCreateEventSignUp();
  const { createEventLike: _createEventLike } = useCreateEventLike();
  const { deleteEventSignUp: _deleteEventSignUp } = useDeleteEventSignUp();
  const { deleteEventLike: _deleteEventLike } = useDeleteEventLike();

  const getSingleEvent = useCallback(async () => {
    const event = await _getSingleEvent(eventId);
    setEvent(event);
    return event;
  }, [eventId, _getSingleEvent]);

  const createEventComment = useCallback(
    async (content: string) => {
      await _createEventComment({ eventId, content });
      const updatedComments = await getEventComments({ eventId });

      setEvent((event) =>
        event ? { ...event, comments: updatedComments } : event,
      );

      return updatedComments;
    },
    [eventId, _createEventComment, getEventComments],
  );

  const eventSignUpAndLikeMethods = useMemo(() => {
    const createEventSignUp = async () => {
      const { event: updatedEvent } = await _createEventSignUp({ eventId });
      setEvent(updatedEvent);
      return updatedEvent;
    };

    const createEventLike = async () => {
      const { event: updatedEvent } = await _createEventLike({ eventId });
      setEvent(updatedEvent);
      return updatedEvent;
    };

    const deleteEventSignUp = async () => {
      const { event: updatedEvent } = await _deleteEventSignUp({ eventId });
      setEvent(updatedEvent);
      return updatedEvent;
    };

    const deleteEventLike = async () => {
      const { event: updatedEvent } = await _deleteEventLike({ eventId });
      setEvent(updatedEvent);
      return updatedEvent;
    };

    return {
      createEventSignUp,
      createEventLike,
      deleteEventSignUp,
      deleteEventLike,
    };
  }, [
    eventId,
    _createEventSignUp,
    _createEventLike,
    _deleteEventSignUp,
    _deleteEventLike,
  ]);

  return (
    <SingleEventContext.Provider
      value={{
        event,
        getSingleEvent,
        createEventComment,
        setEventList,
        setCommentList,
        ...eventSignUpAndLikeMethods,
      }}
    >
      {children}
    </SingleEventContext.Provider>
  );
}

export default SingleEventProvider;
