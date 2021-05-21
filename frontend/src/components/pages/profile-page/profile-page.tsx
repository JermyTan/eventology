import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "semantic-ui-react";
import styles from "./profile-page.module.scss";
import { useGetSingleUser } from "../../../custom-hooks/api/users-api";
import PlaceholderWrapper from "../../placeholder-wrapper";

import ProfileInfoSection from "../../profile-info-section";
import ProfileEventSection from "../../profile-event-section";

function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoading, getSingleUser } = useGetSingleUser();

  useEffect(() => {
    getSingleUser(userId);
  }, [getSingleUser, userId]);

  return (
    <div className={styles.profilePage}>
      <PlaceholderWrapper
        isLoading={isLoading}
        loadingMessage="Retrieving profile"
        placeholder
        showDefaultContent={!user}
        defaultContent={
          <div className={styles.noUserContentContainer}>
            <Icon className={styles.icon} name="user outline" size="huge" />
            <h3 className={styles.text}>No user found</h3>
          </div>
        }
      >
        {user && <ProfileInfoSection {...user} />}

        <ProfileEventSection userId={user?.id} />
      </PlaceholderWrapper>
    </div>
  );
}

export default ProfilePage;
