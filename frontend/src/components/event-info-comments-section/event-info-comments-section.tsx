import { useCallback, useContext } from "react";
import { Divider } from "semantic-ui-react";
import { EventCommentData } from "../../types/events";
import VirtualizedList from "../virtualized-list";
import Comment from "../comment";
import styles from "./event-info-comments-section.module.scss";
import { PageBodyContext } from "../../context-providers";

type Props = {
  comments: EventCommentData[];
};

function EventInfoCommentsSection({ comments }: Props) {
  const { pageBody } = useContext(PageBodyContext);

  const commentRenderer = useCallback(
    (index: number) => <Comment comment={comments[index]} />,
    [comments],
  );

  return (
    <VirtualizedList
      itemRenderer={commentRenderer}
      dividerRenderer={() => (
        <Divider className={styles.commentDivider} hidden />
      )}
      numItems={comments.length}
      scrollElement={pageBody ?? undefined}
      defaultRowHeight={100}
    />
  );
}

export default EventInfoCommentsSection;
