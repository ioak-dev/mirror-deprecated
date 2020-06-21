import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { POST_COMMENTS } from '../../Types/PostSchema';
import OakInfiniteScroll from '../../../oakui/OakInfiniteScroll';
import OakSpinner from '../../../oakui/OakSpinner';
import ViewDetails from './ViewDetails';

interface Props {
  postId: string;
}
const ViewItem = (props: Props) => {
  const { loading, data, fetchMore } = useQuery(POST_COMMENTS, {
    variables: {
      postId: props.postId,
      pageSize: 10,
      pageNo: 0,
    },
  });

  const fetchMoreComments = () => {
    if (data?.comments?.hasMore) {
      fetchMore({
        variables: {
          pageNo: data?.comments?.pageNo,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          return {
            comments: {
              ...prev.comments,
              results: [
                ...prev.comments.results,
                ...fetchMoreResult.comments.results,
              ],
              pageNo: fetchMoreResult.comments.pageNo,
              hasMore: fetchMoreResult.comments.hasMore,
            },
          };
        },
      });
    }
  };

  return (
    <>
      <OakInfiniteScroll handleChange={fetchMoreComments} selector=".app-page">
        <div className="post-section">
          <div className="post-list-container">
            <div className="app-subtitle">Comments</div>
            {data?.postComments?.results?.map(item => (
              <>
                <ViewDetails
                  commentId={item.id}
                  postId={props.postId}
                  key={item.id}
                  comment={item.text}
                />
              </>
            ))}

            {data?.comments?.results?.length === 0 && (
              <div className="typography-6">No comments</div>
            )}
          </div>
          <div>{loading ? <OakSpinner /> : ''}</div>
        </div>
      </OakInfiniteScroll>
    </>
  );
};

export default ViewItem;
