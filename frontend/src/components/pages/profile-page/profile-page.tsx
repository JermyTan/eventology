import { useContext } from "react";
import { Segment } from "semantic-ui-react";
import { UserContext } from "../../../context-providers";

function ProfilePage() {
  const { email, name } = useContext(UserContext);

  return (
    <div>
      <Segment vertical>
        {name}
        {email}
      </Segment>

      <Segment vertical></Segment>
    </div>
  );
}

export default ProfilePage;
