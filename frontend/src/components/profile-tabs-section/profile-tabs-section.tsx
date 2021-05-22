import classNames from "classnames";
import { useHistory, useLocation } from "react-router-dom";
import { Segment, Container, Icon } from "semantic-ui-react";
import { GOING, LIKES, PAST } from "../../constants";
import styles from "./profile-tabs-section.module.scss";

type Props = {
  numLikedEvents: number;
  numGoingEvents: number;
  numPastEvents: number;
  isLikesTabActive: boolean;
  isGoingTabActive: boolean;
  isPastTabActive: boolean;
};

function ProfileTabsSection({
  numLikedEvents,
  numGoingEvents,
  numPastEvents,
  isLikesTabActive,
  isGoingTabActive,
  isPastTabActive,
}: Props) {
  const { pathname } = useLocation();
  const history = useHistory();

  const onChangeTab = (newTabCategory: string) => {
    if (pathname.match(/[^/]*$/)?.[0] === newTabCategory) {
      return;
    }

    // matches last part of url
    history.push(pathname.replace(/[^/]*$/, newTabCategory));
  };

  return (
    <Segment className={styles.profileTabsSection} padded vertical>
      <Container className={styles.tabsContainer}>
        <div
          className={classNames(styles.tab, isLikesTabActive && styles.active)}
          onClick={() => onChangeTab(LIKES)}
        >
          <span className={styles.iconContainer}>
            {isLikesTabActive ? (
              <Icon name="heart" />
            ) : (
              <Icon name="heart outline" />
            )}
          </span>
          {numLikedEvents} Likes
        </div>

        <div className={styles.verticalDivider} />

        <div
          className={classNames(styles.tab, isGoingTabActive && styles.active)}
          onClick={() => onChangeTab(GOING)}
        >
          <span className={styles.iconContainer}>
            <Icon name="check" />
          </span>
          {numGoingEvents} Going
        </div>

        <div className={styles.verticalDivider} />

        <div
          className={classNames(styles.tab, isPastTabActive && styles.active)}
          onClick={() => onChangeTab(PAST)}
        >
          <span className={styles.iconContainer}>
            {isPastTabActive ? (
              <i className="fas fa-paw icon" />
            ) : (
              <i className="far fa-paw icon" />
            )}
          </span>
          {numPastEvents} Past
        </div>
      </Container>
    </Segment>
  );
}

export default ProfileTabsSection;
