import { useCallback, useContext } from "react";
import { Divider } from "semantic-ui-react";
import classNames from "classnames";
import { EventCommentData } from "../../types/events";
import VirtualizedList from "../virtualized-list";
import { PageBodyContext } from "../page-body";
import Comment from "../comment";
import styles from "./event-info-comments-section.module.scss";
import PlaceholderWrapper from "../placeholder-wrapper";
import { useAppDispatch } from "../../redux/hooks";
import PullToRefreshWrapper from "../pull-to-refresh-wrapper";
import { setEvent } from "../../redux/slices/single-event-slice";
import { useGetSingleEvent } from "../../custom-hooks/api/events-api";

type Props = {
  eventId: number;
  comments: EventCommentData[];
};

const dividerRenderer = () => (
  <Divider className={styles.commentDivider} hidden />
);

const noRowsRenderer = () => (
  <PlaceholderWrapper
    placeholder
    showDefaultContent
    defaultContent={
      <div className={styles.noCommentContainer}>
        <i className={classNames("fal fa-comments huge icon", styles.icon)} />
        <h3 className={styles.text}>No comments found</h3>
      </div>
    }
  />
);

function EventInfoCommentsSection({ eventId, comments }: Props) {
  const { pageBodyRef } = useContext(PageBodyContext);
  const { getSingleEvent } = useGetSingleEvent();
  const dispatch = useAppDispatch();

  const itemRenderer = useCallback(
    (index: number) => <Comment comment={comments[index]} />,
    [comments],
  );

  const onRefresh = async () =>
    dispatch(setEvent(await getSingleEvent(eventId)));

  return (
    <PullToRefreshWrapper onRefresh={onRefresh}>
      <VirtualizedList
        itemRenderer={itemRenderer}
        dividerRenderer={dividerRenderer}
        noRowsRenderer={noRowsRenderer}
        numItems={comments.length}
        scrollElement={pageBodyRef.current ?? undefined}
        defaultRowHeight={100}
        cachePreviousRowHeight
      />
    </PullToRefreshWrapper>
  );
}

export default EventInfoCommentsSection;
