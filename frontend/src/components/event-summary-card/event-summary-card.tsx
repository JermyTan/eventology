import { Image, Label, Divider, Icon } from "semantic-ui-react";
import { EventData } from "../../types/events";
import { displayDateTime } from "../../utils/parser-utils";
import defaultAvatarImage from "../../assets/avatar.png";
import styles from "./event-summary-card.module.scss";

function EventSummaryCard({
  title,
  creator,
  category,
  images,
  startDateTime,
  endDateTime,
  description,
  signUpCount,
  likeCount,
  hasSignedUp,
  hasLiked,
}: EventData) {
  return (
    <>
      <div className={styles.eventSummaryCard}>
        <div className={styles.meta}>
          <div className={styles.userInfo}>
            <Image
              src={defaultAvatarImage}
              alt=""
              avatar
              bordered
              size="mini"
            />
            <strong>{creator.name}</strong>
          </div>

          {category && (
            <Label className={styles.category} basic circular>
              {category}
            </Label>
          )}
        </div>

        <div className={styles.title}>
          <h1>{title}</h1>
        </div>

        <div className={styles.subtitle}>
          <Icon name="clock outline" />
          {`${displayDateTime(startDateTime)} - ${displayDateTime(
            endDateTime,
          )}`}
        </div>

        <div className={styles.description}>{description}</div>

        <div className={styles.extra}>
          <div>
            <Icon name="check" />
            {signUpCount} Going
          </div>

          <div>
            <Icon name="heart outline" />
            {likeCount} Likes
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
}

export default EventSummaryCard;
