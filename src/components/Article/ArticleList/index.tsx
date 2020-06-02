import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './style.scss';
import Maybe from 'graphql/tsutils/Maybe';
import OakButton from '../../../oakui/OakButton';
import { Article, ArticlePaginated } from '../../../types/graphql';
import OakInfiniteScroll from '../../../oakui/OakInfiniteScroll';
import OakViewer from '../../../oakui/OakViewer';
import { receiveMessage, newId } from '../../../events/MessageService';
import { INFINITE_SCROLL_HANDLE_CHANGE_PREFIX } from '../../../oakui/OakConstants';
import OakSpinner from '../../../oakui/OakSpinner';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
  space: string;
}

const queryString = require('query-string');

const LIST_ARTICLES = gql`
  query Articles($categoryId: ID!, $pageNo: Int, $pageSize: Int) {
    articles(categoryId: $categoryId, pageNo: $pageNo, pageSize: $pageSize) {
      results {
        id
        title
        description
      }
      pageNo
      hasMore
    }
  }
`;

const CreateArticle = (props: Props) => {
  const [urlParam, setUrlParam] = useState({
    categoryid: '',
  });
  const { loading, error, data, fetchMore } = useQuery(LIST_ARTICLES, {
    variables: { categoryId: urlParam.categoryid, pageSize: 10, pageNo: 0 },
  });

  useEffect(() => {
    setUrlParam(queryString.parse(props.location.search));
  }, []);

  const createArticleLink = event => {
    props.history.push(`/${props.space}/article/create`);
  };

  const viewArticleLink = event => {
    props.history.push(`/${props.space}/article/view`);
  };

  const fetchMoreArticles = () => {
    if (data?.articles?.hasMore) {
      fetchMore({
        variables: {
          pageNo: data?.articles?.pageNo,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          return {
            articles: {
              ...prev.articles,
              results: [
                ...prev.articles.results,
                ...fetchMoreResult.articles.results,
              ],
              pageNo: fetchMoreResult.articles.pageNo,
              hasMore: fetchMoreResult.articles.hasMore,
            },
          };
        },
      });
    }
  };

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <div className="action-header">
            <OakButton
              theme="primary"
              variant="regular"
              action={createArticleLink}
            >
              Create
            </OakButton>
            <OakButton
              theme="primary"
              variant="regular"
              action={viewArticleLink}
            >
              Simulate click of an article from list
            </OakButton>
          </div>
          <OakInfiniteScroll
            handleChange={fetchMoreArticles}
            selector=".app-page"
          >
            <div className="article-list-container">
              <div>
                {data?.articles?.results?.map((item: Article) => (
                  <div key={item.id}>
                    <div className="typography-8">{item.title}</div>
                    <OakViewer>{item.description}</OakViewer>
                    <div className="typography-5 space-bottom-2">{item.id}</div>
                  </div>
                ))}
              </div>
              <div>{loading ? <OakSpinner /> : ''}</div>
            </div>
          </OakInfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
