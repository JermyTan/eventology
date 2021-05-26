import { useCallback, useContext } from "react";
import { Divider } from "semantic-ui-react";
import { EventCommentData } from "../../types/events";
import VirtualizedList from "../virtualized-list";
import { PageBodyContext } from "../page-body";
import Comment from "../comment";
import styles from "./event-info-comments-section.module.scss";
import { SingleEventContext } from "../../context-providers";

type Props = {
  comments: EventCommentData[];
};

function EventInfoCommentsSection({ comments }: Props) {
  const { setCommentList } = useContext(SingleEventContext);
  const { pageBodyRef } = useContext(PageBodyContext);

  const commentRenderer = useCallback(
    (index: number) => <Comment comment={comments[index]} />,
    [comments],
  );

  return (
    <VirtualizedList
      ref={setCommentList}
      itemRenderer={commentRenderer}
      dividerRenderer={() => (
        <Divider className={styles.commentDivider} hidden />
      )}
      numItems={comments.length}
      scrollElement={pageBodyRef.current ?? undefined}
      defaultRowHeight={100}
    />
  );
}

export default EventInfoCommentsSection;
