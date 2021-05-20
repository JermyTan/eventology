import { useContext } from "react";
import { Segment, Image, Container, Icon, Divider } from "semantic-ui-react";
import { UserContext } from "../../../context-providers";
import defaultAvatarImage from "../../../assets/avatar.png";
import styles from "./profile-page.module.scss";

function ProfilePage() {
  const { email, name } = useContext(UserContext);

  return (
    <div className={styles.profilePage}>
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

      <Segment vertical />
    </div>
  );
}

export default ProfilePage;
