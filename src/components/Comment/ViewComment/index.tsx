import React from 'react';
import ViewItem from './ViewItem';

interface Props {
  postId: string;
  parentId?: string;
}

const ViewComment = (props: Props) => {
  return (
    <div className="app-content">
      <ViewItem postId={props.postId} />
    </div>
  );
};

export default ViewComment;
