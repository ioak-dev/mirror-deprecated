import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import './style.scss';
import { POSTS_BY_TAG } from '../../../Types/PostSchema';
import OakInfiniteScroll from '../../../../oakui/OakInfiniteScroll';
import PostLink from '../../PostLink';
import { Post, PostTag } from '../../../../types/graphql';
import OakSpinner from '../../../../oakui/OakSpinner';
import OakHeading from '../../../../oakui/OakHeading';
import OakSection from '../../../../oakui/OakSection';

interface Props {
  tag: string;
  asset: string;
  history: any;
}

const PostSection = (props: Props) => {
  const { loading, error, data, fetchMore, refetch } = useQuery(POSTS_BY_TAG, {
    variables: { tag: props.tag, pageSize: 10, pageNo: 0 },
    fetchPolicy: 'cache-and-network',
  });

  const fetchMorePosts = () => {
    if (data?.postsByTag?.hasMore) {
      fetchMore({
        variables: {
          pageNo: data?.postsByTag?.pageNo,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          return {
            postsByTag: {
              ...prev.postsByTag,
              results: [
                ...prev.postsByTag.results,
                ...fetchMoreResult.postsByTag.results,
              ],
              pageNo: fetchMoreResult.postsByTag.pageNo,
              hasMore: fetchMoreResult.postsByTag.hasMore,
            },
          };
        },
      });
    }
  };
  const goBack = () => {
    props.history.goBack();
  };

  const viewByTags = () => {
    props.history.push(`/${props.asset}/post/tag`);
  };

  const getHeadingLinks = () => {
    return [
      {
        label: 'Go back',
        icon: 'reply',
        action: () => goBack(),
      },
      {
        label: 'See other tags',
        icon: 'local_offer',
        action: () => viewByTags(),
      },
    ];
  };

  return (
    <OakSection>
      <OakHeading
        title="Posts by tag"
        subtitle={`Showing posts for tag "${props.tag}"`}
        links={getHeadingLinks()}
      />
      <div className="tag-post-section">
        <OakInfiniteScroll handleChange={fetchMorePosts} selector=".oak-page">
          <div className="search-results-section">
            <div className="search-results-container">
              {data?.postsByTag?.results?.map((item: PostTag, index) => (
                <div key={item?.post?.id || index}>
                  {item?.post && (
                    <PostLink
                      post={item.post}
                      asset={props.asset}
                      history={props.history}
                    />
                  )}
                </div>
              ))}
              {/* {data?.postsByTag?.results?.length === 0 &&
              props.text &&
              !loading && (
                <AlternateSection history={props.history} asset={props.asset} />
              )} */}
            </div>
            <div>{loading ? <OakSpinner /> : ''}</div>
          </div>
        </OakInfiniteScroll>
      </div>
    </OakSection>
  );
};

export default PostSection;
