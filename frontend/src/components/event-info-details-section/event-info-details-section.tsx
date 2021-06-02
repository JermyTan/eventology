import { memo } from "react";
import { Segment, Image } from "semantic-ui-react";
import classNames from "classnames";
import {
  DATE_FORMAT_1,
  TIME_FORMAT,
  TIME_PERIOD_FORMAT,
} from "../../constants";
import LinkifyTextViewer from "../linkify-text-viewer";
import { displayDateTime } from "../../utils/parser-utils";
import styles from "./event-info-details-section.module.scss";

type Props = {
  images: string[];
  description: string;
  startDateTime: number;
  endDateTime: number;
  venue: string;
};

function EventInfoDetailsSection({
  images,
  description,
  startDateTime,
  endDateTime,
  venue,
}: Props) {
  return (
    <div className={styles.eventInfoDetailsSection}>
      {images.length > 0 && (
        <Segment
          padded
          className={classNames(styles.imagesSection, styles.important)}
          vertical
        >
          {images.map((image, index) => (
            <Image
              key={`${index}-${image}`}
              src={image}
              size="medium"
              rounded
              bordered
            />
          ))}
        </Segment>
      )}

      <Segment className={styles.description} vertical>
        <LinkifyTextViewer>{description}</LinkifyTextViewer>
      </Segment>

      <Segment className={styles.dateTimeSection} vertical>
        <h3 className={styles.sectionHeader}>
          <div className={styles.verticalBar} />
          <div className={styles.label}>When</div>
        </h3>

        <div className={styles.periodContainer}>
          <Segment className={styles.dateTimeContainer} vertical>
            <h3 className={styles.dateContainer}>
              <span className={styles.iconContainer}>
                <i className="far fa-arrow-from-left icon" />
              </span>
              {displayDateTime(startDateTime, DATE_FORMAT_1)}
            </h3>

            <div className={styles.timeContainer}>
              <h1 className={styles.time}>
                {displayDateTime(startDateTime, TIME_FORMAT)}
              </h1>

              <div>{displayDateTime(startDateTime, TIME_PERIOD_FORMAT)}</div>
            </div>
          </Segment>

          <div className={styles.verticalDivider} />

          <Segment className={styles.dateTimeContainer} vertical>
            <h3 className={styles.dateContainer}>
              <span className={styles.iconContainer}>
                <i className="far fa-arrow-from-right icon" />
              </span>
              {displayDateTime(endDateTime, DATE_FORMAT_1)}
            </h3>

            <div className={styles.timeContainer}>
              <h1 className={styles.time}>
                {displayDateTime(endDateTime, TIME_FORMAT)}
              </h1>

              <div>{displayDateTime(endDateTime, TIME_PERIOD_FORMAT)}</div>
            </div>
          </Segment>
        </div>
      </Segment>

      <Segment className={styles.venueSection} vertical>
        <h3 className={styles.sectionHeader}>
          <div className={styles.verticalBar} />
          <div className={styles.label}>Where</div>
        </h3>

        <h4 className={styles.venue}>{venue}</h4>
        <iframe
          title="Venue map"
          className={styles.map}
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${venue}`}
        />
      </Segment>
    </div>
  );
}

export default memo(EventInfoDetailsSection);
