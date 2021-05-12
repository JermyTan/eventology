import { useParams } from "react-router-dom";

function EventsSingleViewPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = parseInt(id, 10);

  return <h1>This is the events single view page for event {eventId}</h1>;
}

export default EventsSingleViewPage;
