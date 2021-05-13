import { useContext } from "react";
import { Button } from "semantic-ui-react";
import { UserContext } from "../../../context-providers";

function EventsPage() {
  const { updateUser } = useContext(UserContext);

  return (
    <div>
      <h1>This is the events page</h1>
      <Button onClick={() => updateUser(null)}>Log out</Button>
    </div>
  );
}

export default EventsPage;
