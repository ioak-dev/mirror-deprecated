import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import OakInfiniteScroll from '../../../../oakui/OakInfiniteScroll';
import { POST_COMMENTS } from '../../../Types/PostSchema';
import OakSpinner from '../../../../oakui/OakSpinner';
import { PostComment } from '../../../../types/graphql';
import ViewComment from './ViewComment';
import { USERS } from '../../../Types/schema';

interface Props {
  postId: string;
}

const CommentList = (props: Props) => {
  const { loading, data, fetchMore } = useQuery(POST_COMMENTS, {
    variables: {
      postId: props.postId,
      pageSize: 10,
      pageNo: 0,
    },
    fetchPolicy: 'cache-and-network',
  });
  const { loading: usersLoading, data: usersData } = useQuery(USERS);

  const fetchMoreComments = () => {
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
    <OakInfiniteScroll handleChange={fetchMoreComments} selector=".oak-page">
      <div className="comment-list">
        {data?.postComments?.results?.map((item: PostComment) => (
          <ViewComment
            postId={props.postId}
            comment={item}
            comments={data.postComments?.results}
            users={usersData?.users}
            key={item.id}
          />
        ))}

        {data?.postComments?.results?.length === 0 && (
          <div className="typography-6">No comments</div>
        )}
      </div>
      <div>{loading ? <OakSpinner /> : ''}</div>
    </OakInfiniteScroll>
  );
};

export default CommentList;
