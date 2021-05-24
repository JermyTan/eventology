import { createContext, ReactNode, useCallback, useState } from "react";
import { useGetSingleEvent } from "../custom-hooks/api/events-api";
import { EventData } from "../types/events";

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
