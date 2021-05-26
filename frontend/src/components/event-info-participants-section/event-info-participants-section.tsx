import { memo } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Icon, Popup, Image, Divider } from "semantic-ui-react";
import { EventLikeData, EventSignUpData } from "../../types/events";
import { PROFILE_MAIN_PATH } from "../../routes/paths";
import { USER_ID } from "../../constants";
import defaultAvatarImage from "../../assets/avatar.png";
import styles from "./event-info-participants-section.module.scss";

type Props = {
  signUps: EventSignUpData[];
  likes: EventLikeData[];
};

function EventInfoParticipantsSection({ signUps, likes }: Props) {
  const history = useHistory();

  const onUserClickGenerator = (userId: number) => () =>
    history.push(PROFILE_MAIN_PATH.replace(`:${USER_ID}`, `${userId}`));

  return (
    <Grid className={styles.eventInfoParticipantsSection} columns="2" container>
      <Grid.Row>
        <Grid.Column
          className={styles.label}
          computer="2"
          tablet="3"
          mobile="4"
        >
          <Icon className={styles.icon} name="check" />
          {signUps.length} going
        </Grid.Column>

        <Grid.Column computer="14" tablet="13" mobile="12">
          {signUps.map(({ user: { id, name, profileImageUrl } }) => (
            <Popup
              key={id}
              content={name}
              trigger={
                <Image
                  onClick={onUserClickGenerator(id)}
                  src={profileImageUrl || defaultAvatarImage}
                  alt=""
                  avatar
                  bordered
                  size="mini"
                  className={styles.pointer}
                />
              }
              position="top center"
              on="hover"
            />
          ))}
        </Grid.Column>
      </Grid.Row>

      <Divider className={styles.horizontalDivider} />

      <Grid.Row>
        <Grid.Column
          className={styles.label}
          computer="2"
          tablet="3"
          mobile="4"
        >
          <Icon className={styles.icon} name="heart outline" />
          {likes.length} likes
        </Grid.Column>

        <Grid.Column computer="14" tablet="13" mobile="12">
          {likes.map(({ user: { id, name, profileImageUrl } }) => (
            <Popup
              key={id}
              content={name}
              trigger={
                <Image
                  onClick={onUserClickGenerator(id)}
                  src={profileImageUrl || defaultAvatarImage}
                  alt=""
                  avatar
                  bordered
                  size="mini"
                  className={styles.pointer}
                />
              }
              position="top center"
              on="hover"
            />
          ))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default memo(EventInfoParticipantsSection);
