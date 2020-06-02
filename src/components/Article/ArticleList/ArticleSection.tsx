import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './style.scss';
import { Article } from '../../../types/graphql';
import OakInfiniteScroll from '../../../oakui/OakInfiniteScroll';
import OakViewer from '../../../oakui/OakViewer';
import OakSpinner from '../../../oakui/OakSpinner';

interface Props {
  categoryId: string;
  history: any;
  space: string;
}

const LIST_ARTICLES = gql`
  query Articles($categoryId: ID, $pageNo: Int, $pageSize: Int) {
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

const ArticleSection = (props: Props) => {
  const { loading, error, data, fetchMore } = useQuery(LIST_ARTICLES, {
    variables: { categoryId: props.categoryId, pageSize: 10, pageNo: 0 },
  });

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

  const viewArticle = id => {
    props.history.push(`/${props.space}/article/view?id=${id}`);
  };

  return (
    <OakInfiniteScroll handleChange={fetchMoreArticles} selector=".app-page">
      <div className="article-list-container">
        <div>
          {data?.articles?.results?.map((item: Article) => (
            <div key={item.id}>
              <div
                className="typography-8"
                onClick={() => viewArticle(item.id)}
              >
                {item.title}
              </div>
              <OakViewer>{item.description}</OakViewer>
              <div className="typography-5 space-bottom-2">{item.id}</div>
            </div>
          ))}
        </div>
        <div>{loading ? <OakSpinner /> : ''}</div>
      </div>
    </OakInfiniteScroll>
  );
};

export default ArticleSection;
