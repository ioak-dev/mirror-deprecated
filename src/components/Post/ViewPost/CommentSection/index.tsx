import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import NewCommentItem from './NewCommentItem';
import CommentList from './CommentList';
import { POST_COMMENTS } from '../../../Types/PostSchema';
import './style.scss';
import OakSubheading from '../../../../oakui/OakSubheading';

interface Props {
  postId: string;
}

const CommentSection = (props: Props) => {
  const { loading, data, fetchMore } = useQuery(POST_COMMENTS, {
    variables: {
      postId: props.postId,
    },
    fetchPolicy: 'network-only',
  });
  const [newComment, setNewComment] = useState(false);
  const [viewComments, setViewComments] = useState(true);

  const getSectionLinks = () => {
    return [
      {
        label: 'New comment',
        icon: 'add_comment',
        action: () => setNewComment(!newComment),
      },
      {
        label: viewComments ? 'Hide' : 'Show',
        icon: viewComments ? 'expand_less' : 'expand_more',
        action: () => setViewComments(!viewComments),
      },
    ];
  };

  return (
    <>
      <div className="section-header">
        <OakSubheading
          title={`Comments (${data?.postComments?.results?.length})`}
          links={getSectionLinks()}
          linkSize="large"
        />
      </div>

      {newComment && (
        <NewCommentItem
          postId={props.postId}
          closeEdit={() => setNewComment(false)}
        />
      )}
      <div className={viewComments ? 'comment-list show' : 'comment-list hide'}>
        <CommentList postId={props.postId} />
      </div>
    </>
  );
};

export default CommentSection;
