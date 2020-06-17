import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import './style.scss';
import { Post } from '../../../../types/graphql';
import OakInfiniteScroll from '../../../../oakui/OakInfiniteScroll';
import OakSpinner from '../../../../oakui/OakSpinner';
import PostLink from '../../PostLink';
import OakButton from '../../../../oakui/OakButton';
import { LIST_POSTS } from '../../../Types/PostSchema';

interface Props {
  history: any;
  asset: string;
}

const PostSection = (props: Props) => {
  const { loading, data, fetchMore } = useQuery(LIST_POSTS, {
    variables: { pageSize: 10, pageNo: 0 },
    fetchPolicy: 'cache-and-network',
  });

  const fetchMorePosts = () => {
    if (data?.posts?.hasMore) {
      fetchMore({
        variables: {
          pageNo: data?.posts?.pageNo,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          return {
            posts: {
              ...prev.posts,
              results: [
                ...prev.posts.results,
                ...fetchMoreResult.posts.results,
              ],
              pageNo: fetchMoreResult.posts.pageNo,
              hasMore: fetchMoreResult.posts.hasMore,
            },
          };
        },
      });
    }
  };

  const createPostLink = event => {
    props.history.push(`/${props.asset}/post/create`);
  };

  return (
    <>
      <>
        <div className="section-header">
          <div className="section-title">
            Posts
            <div className="section-subtitle">
              {/* Posts under chosen category */}
              {/* <div
                  className="hyperlink typography-5 post-section-subtitle"
                  onClick={createPostLink}
                >
                  Create new post
                </div> */}
            </div>
            <div className="section-highlight" />
          </div>
          <div>
            <OakButton
              theme="primary"
              variant="regular"
              action={createPostLink}
            >
              New post
            </OakButton>
          </div>
        </div>
        <OakInfiniteScroll handleChange={fetchMorePosts} selector=".app-page">
          <div className="post-section">
            <div className="post-list-container">
              {data?.posts?.results?.map((item: Post) => (
                <PostLink
                  key={item.id}
                  post={item}
                  asset={props.asset}
                  history={props.history}
                />
              ))}
              {data?.posts?.results?.length === 0 && (
                <div className="typography-6">No posts</div>
              )}
            </div>
            <div>{loading ? <OakSpinner /> : ''}</div>
          </div>
        </OakInfiniteScroll>
      </>
    </>
  );
};

export default PostSection;
