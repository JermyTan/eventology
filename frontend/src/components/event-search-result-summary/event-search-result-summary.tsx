import { Segment, Container, Label } from "semantic-ui-react";
import useSearchQueryParams from "../../custom-hooks/use-search-query-params";
import { displaySearchedEventCategoryAndDateTime } from "../../utils/parser-utils";
import styles from "./event-search-result-summary.module.scss";

type Props = {
  numEvents: number;
};

function EventSearchResultSummary({ numEvents }: Props) {
  const { searchQuery, setSearchQuery } = useSearchQueryParams();

  const onClearSearch = () =>
    setSearchQuery({
      category: undefined,
      startDateTime: undefined,
      endDateTime: undefined,
    });

  return (
    <Segment className={styles.eventSearchResultSummary} vertical>
      <Container className={styles.contentContainer}>
        <div className={styles.headerContainer}>
          <div>
            <h2 className={styles.title}>
              {`${numEvents} Result${numEvents === 1 ? "" : "s"}`}
            </h2>
          </div>

          <Label
            className={styles.clearSearchButton}
            onClick={onClearSearch}
            circular
          >
            <div className={styles.textContainer}>
              <div>CLEAR SEARCH</div>
            </div>
          </Label>
        </div>

        <div className={styles.description}>
          {`Searched for ${displaySearchedEventCategoryAndDateTime(
            searchQuery,
          )}`}
        </div>
      </Container>
    </Segment>
  );
}

export default EventSearchResultSummary;
