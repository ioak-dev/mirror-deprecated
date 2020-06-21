import React from 'react';
import ReplyItem from './ReplyItem';

interface Props {
  postId: string;
  commentId: string;
  reply: string;
  setIsReplay: Function;
}

const Reply = (props: Props) => {
  return (
    <>
      {props.reply === 'new' && (
        <ReplyItem
          setIsReplay={props.setIsReplay}
          postId={props.postId}
          commentId={props.commentId}
        />
      )}
    </>
  );
};

export default Reply;
