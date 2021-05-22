import { useParams } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { EVENT_ID } from "../../../constants";

function EventsSingleViewPage() {
  const { eventId } = useParams<{ [EVENT_ID]: string }>();
  const id = parseInt(eventId, 10);

  return (
    <Container>
      <h1>This is the events single view page for event {id}</h1>
    </Container>
  );
}

export default EventsSingleViewPage;
