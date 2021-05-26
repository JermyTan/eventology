import {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import {
  useCreateEventComment,
  useCreateEventLike,
  useCreateEventSignUp,
  useDeleteEventLike,
  useDeleteEventSignUp,
  useGetSingleEvent,
} from "../custom-hooks/api/events-api";
import { EventData } from "../types/events";

type SingleEventContextType = {
  event?: EventData;
  getSingleEvent: () => Promise<EventData | undefined>;
  createEventComment: (data: {
    content: string;
  }) => Promise<EventData | undefined>;
  createEventSignUp: () => Promise<EventData | undefined>;
  createEventLike: () => Promise<EventData | undefined>;
  deleteEventSignUp: () => Promise<EventData | undefined>;
  deleteEventLike: () => Promise<EventData | undefined>;
  inputComment: string;
  setInputComment: Dispatch<SetStateAction<string>>;
  isCommenting: boolean;
  setCommenting: (newValue: boolean) => void;
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
  inputComment: "",
  setInputComment: () => {
    throw new Error("setInputComment is not defined.");
  },
  isCommenting: false,
  setCommenting: () => {
    throw new Error("setCommenting is not defined.");
  },
});

type Props = {
  eventId: string | number;
  children: ReactNode;
};

function SingleEventProvider({ eventId, children }: Props) {
  const [event, setEvent] = useState<EventData>();
  const { getSingleEvent: _getSingleEvent } = useGetSingleEvent();
  const { createEventComment: _createEventComment } = useCreateEventComment();
  const { createEventSignUp: _createEventSignUp } = useCreateEventSignUp();
  const { createEventLike: _createEventLike } = useCreateEventLike();
  const { deleteEventSignUp: _deleteEventSignUp } = useDeleteEventSignUp();
  const { deleteEventLike: _deleteEventLike } = useDeleteEventLike();
  const [inputComment, setInputComment] = useState("");
  const [isCommenting, _setCommenting] = useState(false);

  const getSingleEvent = useCallback(async () => {
    const event = await _getSingleEvent(eventId);
    setEvent(event);
    return event;
  }, [eventId, _getSingleEvent]);

  const eventModifiers = useMemo(() => {
    const updateEvent =
      <T,>(updateFunction: (data?: T) => Promise<unknown>) =>
      async (data?: T) => {
        await updateFunction(data);
        const updatedEvent = await getSingleEvent();

        return updatedEvent;
      };

    const createEventComment = updateEvent(
      ({ content }: { content: string } = { content: "" }) =>
        _createEventComment({ eventId, content }),
    );
    const createEventSignUp = updateEvent(() =>
      _createEventSignUp({ eventId }),
    );
    const createEventLike = updateEvent(() => _createEventLike({ eventId }));
    const deleteEventSignUp = updateEvent(() =>
      _deleteEventSignUp({ eventId }),
    );
    const deleteEventLike = updateEvent(() => _deleteEventLike({ eventId }));

    return {
      createEventComment,
      createEventSignUp,
      createEventLike,
      deleteEventSignUp,
      deleteEventLike,
    };
  }, [
    eventId,
    _createEventComment,
    _createEventSignUp,
    _createEventLike,
    _deleteEventSignUp,
    _deleteEventLike,
    getSingleEvent,
  ]);

  const setCommenting = useCallback((newValue: boolean) => {
    if (!newValue) {
      setInputComment("");
    }

    _setCommenting(newValue);
  }, []);

  return (
    <SingleEventContext.Provider
      value={{
        event,
        getSingleEvent,
        inputComment,
        setInputComment,
        isCommenting,
        setCommenting,
        ...eventModifiers,
      }}
    >
      {children}
    </SingleEventContext.Provider>
  );
}

export default SingleEventProvider;
