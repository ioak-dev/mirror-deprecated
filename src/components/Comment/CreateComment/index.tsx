import React from 'react';
import CreateItem from './CreateItem';

interface Props {
  postId: string;
  parentId?: string;
  setComment: Function;
}

const CreateComment = (props: Props) => {
  return (
    <CreateItem
      postId={props.postId}
      parentid={props.parentId}
      setComment={props.setComment}
    />
  );
};

export default CreateComment;
