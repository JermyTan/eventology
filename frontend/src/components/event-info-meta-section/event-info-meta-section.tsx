import { memo } from "react";
import { Label, Image } from "semantic-ui-react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import { displayDateTime } from "../../utils/parser-utils";
import { RELATIVE, USER_ID } from "../../constants";
import { PROFILE_MAIN_PATH } from "../../routes/paths";
import defaultAvatarImage from "../../assets/avatar.png";
import styles from "./event-info-meta-section.module.scss";
import { UserData } from "../../types/users";

type Props = {
  category?: string;
  title: string;
  creator: UserData;
  createdAt: number;
};

function EventInfoMetaSection({ category, title, creator, createdAt }: Props) {
  const history = useHistory();

  const onUserClick = () =>
    history.push(PROFILE_MAIN_PATH.replace(`:${USER_ID}`, `${creator.id}`));

  return (
    <div className={classNames(styles.eventInfoMetaSection, styles.important)}>
      {category && (
        <Label className={styles.category} basic circular content={category} />
      )}

      <div className={styles.title}>
        <h1>{title}</h1>
      </div>

      <div className={styles.userInfo}>
        <Image
          onClick={onUserClick}
          src={creator.profileImageUrl || defaultAvatarImage}
          alt=""
          avatar
          bordered
          size="mini"
          className={styles.pointer}
        />

        <div>
          <div
            onClick={onUserClick}
            className={classNames(styles.name, styles.pointer)}
          >
            {creator.name}
          </div>
          <div className={styles.publishedDateTime}>
            {displayDateTime(createdAt, RELATIVE)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(EventInfoMetaSection);
