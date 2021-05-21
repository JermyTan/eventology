import { useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Segment, Image, Container, Icon } from "semantic-ui-react";
import defaultAvatarImage from "../../../assets/avatar.png";
import styles from "./profile-page.module.scss";
import { useGetSingleUser } from "../../../custom-hooks/api/users-api";
import PlaceholderWrapper from "../../placeholder-wrapper";
import { PROFILE_LIKES_PATH } from "../../../routes/paths";
import { USER_ID } from "../../../constants";

const pathCategories = ["likes", "going", "past"];

function ProfilePage() {
  const { pathname } = useLocation();
  const history = useHistory();
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoading, getSingleUser } = useGetSingleUser();
  const { email, name } = user ?? {};

  useEffect(() => {
    if (
      pathCategories.some((pathCategory) => pathname.endsWith(pathCategory))
    ) {
      return;
    }

    history.replace(PROFILE_LIKES_PATH.replace(`:${USER_ID}`, userId));
  }, [pathname, history, userId]);

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
        <Segment padded vertical>
          <Container className={styles.infoContainer}>
            <Image
              className={styles.avatar}
              src={defaultAvatarImage}
              alt=""
              size="small"
              avatar
            />

            <h2 className={styles.name}>{name}</h2>

            <h4 className={styles.emailContainer}>
              <a className={styles.email} href={`mailto:${email}`}>
                <Icon name="mail outline" />
                {email}
              </a>
            </h4>
          </Container>
        </Segment>

        <Segment padded vertical>
          <Container className={styles.tabContainer}>
            <div>
              <Icon name="heart outline" />
              12 Likes
            </div>

            <div className={styles.verticalDivider} />

            <div>
              <Icon name="check" />0 Going
            </div>

            <div className={styles.verticalDivider} />

            <div>
              <i className="far fa-paw icon" />0 Past
            </div>
          </Container>
        </Segment>

        <div />
      </PlaceholderWrapper>
    </div>
  );
}

export default ProfilePage;
