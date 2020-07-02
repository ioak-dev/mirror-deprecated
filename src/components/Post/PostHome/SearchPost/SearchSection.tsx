import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import './style.scss';
import { Post } from '../../../../types/graphql';
import OakInfiniteScroll from '../../../../oakui/OakInfiniteScroll';
import OakSpinner from '../../../../oakui/OakSpinner';
import PostLink from '../../PostLink';
import { SEARCH_POSTS } from '../../../Types/PostSchema';
import OakText from '../../../../oakui/OakText';
import AlternateSection from './AlternateSection';
import OakSubheading from '../../../../oakui/OakSubheading';

interface Props {
  asset: string;
  history: any;
  text: string;
  handleSearchTextChange: Function;
}

const SearchSection = (props: Props) => {
  const [state, setState] = useState({ text: '' });

  const { loading, error, data, fetchMore, refetch } = useQuery(SEARCH_POSTS, {
    variables: { text: props.text, pageSize: 10, pageNo: 0 },
    // fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    setState({ text: props.text || '' });
    refetch();
  }, [props.text]);

  const onSubmit = event => {
    event.preventDefault();
    if (state.text) {
      props.handleSearchTextChange(state.text);
    }
  };

  const fetchMorePosts = () => {
    if (data?.searchPosts?.hasMore) {
      fetchMore({
        variables: {
          pageNo: data?.searchPosts?.pageNo,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          return {
            searchPosts: {
              ...prev.searchPosts,
              results: [
                ...prev.searchPosts.results,
                ...fetchMoreResult.searchPosts.results,
              ],
              pageNo: fetchMoreResult.searchPosts.pageNo,
              hasMore: fetchMoreResult.searchPosts.hasMore,
            },
          };
        },
      });
    }
  };

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  return (
    <div className="search-section">
      <form method="GET" onSubmit={onSubmit} noValidate>
        <OakText
          data={state}
          id="text"
          handleChange={handleChange}
          label="Type your question"
        />
      </form>
      <OakInfiniteScroll handleChange={fetchMorePosts} selector=".oak-page">
        <div className="search-results-section">
          <div className="search-results-container">
            {data?.searchPosts?.results?.length > 0 && (
              <OakSubheading
                title="Search results"
                subtitle={`Showing results for "${props.text}"`}
              />
            )}
            {data?.searchPosts?.results?.map((item: Post) => (
              <PostLink
                key={item.id}
                post={item}
                asset={props.asset}
                history={props.history}
              />
            ))}
            {data?.searchPosts?.results?.length === 0 &&
              props.text &&
              !loading && (
                <AlternateSection history={props.history} asset={props.asset} />
              )}
          </div>
          <div>{loading ? <OakSpinner /> : ''}</div>
        </div>
      </OakInfiniteScroll>
    </div>
  );
};

export default SearchSection;
