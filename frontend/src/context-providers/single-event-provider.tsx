import { createContext, ReactNode, useCallback, useState } from "react";
import {
  useCreateEventComment,
  useGetEventComments,
  useGetSingleEvent,
} from "../custom-hooks/api/events-api";
import { EventCommentPostData, EventData } from "../types/events";

type SingleEventContextType = {
  event?: EventData;
  getSingleEvent: () => Promise<EventData | undefined>;
};

export const SingleEventContext = createContext<SingleEventContextType>({
  getSingleEvent: () => {
    throw new Error("getSingleEvent is not defined.");
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
  const { getEventComments } = useGetEventComments();

  const getSingleEvent = useCallback(async () => {
    const event = await _getSingleEvent(eventId);
    setEvent(event);
    return event;
  }, [_getSingleEvent, eventId]);

  return (
    <SingleEventContext.Provider value={{ event, getSingleEvent }}>
      {children}
    </SingleEventContext.Provider>
  );
}

export default SingleEventProvider;
