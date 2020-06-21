import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import OakInfiniteScroll from '../../../../oakui/OakInfiniteScroll';
import { POST_COMMENTS } from '../../../Types/PostSchema';
import OakSpinner from '../../../../oakui/OakSpinner';
import CommentContent from './CommentContent';

interface Props {
  postId: string;
}

const CommentItem = (props: Props) => {
  const { loading, data, fetchMore } = useQuery(POST_COMMENTS, {
    variables: {
      postId: props.postId,
      pageSize: 10,
      pageNo: 0,
    },
    fetchPolicy: 'cache-and-network',
  });

  const fetchMoreComments = () => {
    console.log(data);
    if (data?.postComments?.hasMore) {
      fetchMore({
        variables: {
          pageNo: data?.postComments?.pageNo,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          return {
            postComments: {
              ...prev.postComments,
              results: [
                ...prev.postComments.results,
                ...fetchMoreResult.postComments.results,
              ],
              pageNo: fetchMoreResult.postComments.pageNo,
              hasMore: fetchMoreResult.postComments.hasMore,
            },
          };
        },
      });
    }
  };

  return (
    <OakInfiniteScroll handleChange={fetchMoreComments} selector=".app-page">
      <div className="post-section">
        <div className="post-list-container">
          {data?.postComments?.results?.map(item => (
            <>
              <CommentContent
                postId={props.postId}
                text={item.text}
                key={item.id}
              />
            </>
          ))}

          {data?.postComments?.results?.length === 0 && (
            <div className="typography-6">No comments</div>
          )}
        </div>
        <div>{loading ? <OakSpinner /> : ''}</div>
      </div>
    </OakInfiniteScroll>
  );
};

export default CommentItem;
