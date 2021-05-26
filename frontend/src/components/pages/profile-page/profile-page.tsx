import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Icon, Container, Segment } from "semantic-ui-react";
import { useGetSingleUser } from "../../../custom-hooks/api/users-api";
import PlaceholderWrapper from "../../placeholder-wrapper";
import ProfileInfoSection from "../../profile-info-section";
import ProfileEventSection from "../../profile-event-section";
import TopBar from "../../top-bar";
import PageBody from "../../page-body";
import FullPageContainer from "../../full-page-container";
import styles from "./profile-page.module.scss";

function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoading, getSingleUser } = useGetSingleUser();

  useEffect(() => {
    getSingleUser(userId);
  }, [getSingleUser, userId]);

  return (
    <FullPageContainer>
      <TopBar />

      <PageBody>
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
          {user && (
            <Segment padded vertical>
              <Container>
                <ProfileInfoSection {...user} />
              </Container>
            </Segment>
          )}

          <ProfileEventSection userId={user?.id} />
        </PlaceholderWrapper>
      </PageBody>
    </FullPageContainer>
  );
}

export default ProfilePage;
