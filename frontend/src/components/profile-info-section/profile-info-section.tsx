import { Image, Icon } from "semantic-ui-react";
import defaultAvatarImage from "../../assets/avatar.png";
import { UserData } from "../../types/users";
import styles from "./profile-info-section.module.scss";

type Props = UserData;

function ProfileInfoSection({ name, email }: Props) {
  return (
    <div className={styles.profileInfoSection}>
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
    </div>
  );
}

export default ProfileInfoSection;
