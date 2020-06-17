import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import './style.scss';
import { Article } from '../../../../types/graphql';
import OakInfiniteScroll from '../../../../oakui/OakInfiniteScroll';
import OakSpinner from '../../../../oakui/OakSpinner';
import ArticleLink from '../../ArticleLink';
import { SEARCH_ARTICLES } from '../../../Types/ArticleSchema';
import OakText from '../../../../oakui/OakText';
import AlternateSection from './AlternateSection';

interface Props {
  asset: string;
  history: any;
  text: string;
  handleSearchTextChange: Function;
}

const SearchSection = (props: Props) => {
  const [state, setState] = useState({ text: '' });

  const { loading, error, data, fetchMore, refetch } = useQuery(
    SEARCH_ARTICLES,
    {
      variables: { text: props.text, pageSize: 10, pageNo: 0 },
      // fetchPolicy: 'cache-and-network',
    }
  );

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

  const fetchMoreArticles = () => {
    if (data?.searchArticles?.hasMore) {
      fetchMore({
        variables: {
          pageNo: data?.searchArticles?.pageNo,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          return {
            searchArticles: {
              ...prev.searchArticles,
              results: [
                ...prev.searchArticles.results,
                ...fetchMoreResult.searchArticles.results,
              ],
              pageNo: fetchMoreResult.searchArticles.pageNo,
              hasMore: fetchMoreResult.searchArticles.hasMore,
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
      <OakInfiniteScroll handleChange={fetchMoreArticles} selector=".app-page">
        <div className="search-results-section">
          <div className="search-results-container">
            {data?.searchArticles?.results?.length > 0 && (
              <div className="section-title">
                Search results
                <div className="section-subtitle">
                  Showing results for &quot;{props.text}&quot;
                </div>
                {data?.searchArticles?.results?.total}
                <div className="section-highlight" />
              </div>
            )}
            {data?.searchArticles?.results?.map((item: Article) => (
              <ArticleLink
                key={item.id}
                article={item}
                asset={props.asset}
                history={props.history}
              />
            ))}
            {data?.searchArticles?.results?.length === 0 &&
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
