import React from 'react';
import CreateItem from './CreateItem';

interface Props {
  postId: string;
  parentId?: string;
  setComment: Function;
}

const CreateComment = (props: Props) => {
  return (
    <div className="app-content">
      <CreateItem
        postId={props.postId}
        parentid={props.parentId}
        setComment={props.setComment}
      />
    </div>
  );
};

export default CreateComment;
