import { Segment, Container, Image, Icon } from "semantic-ui-react";
import defaultAvatarImage from "../../assets/avatar.png";
import { UserData } from "../../types/users";
import styles from "./profile-info-section.module.scss";

type Props = UserData;

function ProfileInfoSection({ name, email }: Props) {
  return (
    <Segment className={styles.profileInfoSection} padded vertical>
      <Container className={styles.container}>
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
  );
}

export default ProfileInfoSection;
