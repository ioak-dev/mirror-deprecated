import React, { useState } from 'react';
import OakViewer from '../../../../oakui/OakViewer';
import NewCommentItem from './NewCommentItem';

interface Props {
  postId: string;
  text: string;
}
function CommentContent(props: Props) {
  const [newComment, setNewComment] = useState(false);
  return (
    <>
      <OakViewer>{props.text}</OakViewer>
      <div className="align-horizontal hyperlink-container position-right">
        <i className="material-icons typography-6">edit</i>
        <div className="hyperlink" onClick={() => setNewComment(!newComment)}>
          Reply
        </div>
      </div>
      {newComment && (
        <NewCommentItem postId={props.postId} setNewComment={setNewComment} />
      )}
    </>
  );
}

export default CommentContent;
