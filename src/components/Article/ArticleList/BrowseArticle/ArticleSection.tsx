import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './style.scss';
import { Article } from '../../../../types/graphql';
import OakInfiniteScroll from '../../../../oakui/OakInfiniteScroll';
import OakViewer from '../../../../oakui/OakViewer';
import OakSpinner from '../../../../oakui/OakSpinner';
import ArticleLink from '../../ArticleLink';
import OakButton from '../../../../oakui/OakButton';
import { LIST_ARTICLES } from '../../../Types/schema';

interface Props {
  categoryId: string;
  history: any;
  space: string;
}

const ArticleSection = (props: Props) => {
  const { loading, error, data, fetchMore, refetch } = useQuery(LIST_ARTICLES, {
    variables: { categoryId: props.categoryId, pageSize: 10, pageNo: 0 },
    fetchPolicy: 'cache-and-network',
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

  // useEffect(() => {
  //   refetch();
  // }, [props.categoryId]);

  const createArticleLink = event => {
    props.history.push(
      `/${props.space}/article/create?categoryid=${props.categoryId}`
    );
  };

  return (
    <>
      {props.categoryId && (
        <>
          <div className="section-header">
            <div className="section-title">
              Articles
              <div className="section-subtitle">
                {/* Articles under chosen category */}
                {/* <div
                  className="hyperlink typography-5 article-section-subtitle"
                  onClick={createArticleLink}
                >
                  Create new article
                </div> */}
              </div>
              <div className="section-highlight" />
            </div>
            <div>
              <OakButton
                theme="primary"
                variant="regular"
                action={createArticleLink}
              >
                New article
              </OakButton>
            </div>
          </div>
          <OakInfiniteScroll
            handleChange={fetchMoreArticles}
            selector=".app-page"
          >
            <div className="article-section">
              <div className="article-list-container">
                {data?.articles?.results?.map((item: Article) => (
                  <ArticleLink
                    key={item.id}
                    article={item}
                    space={props.space}
                    history={props.history}
                  />
                ))}
                {data?.articles?.results?.length === 0 && (
                  <div className="typography-6">No articles</div>
                )}
              </div>
              <div>{loading ? <OakSpinner /> : ''}</div>
            </div>
          </OakInfiniteScroll>
        </>
      )}
    </>
  );
};

export default ArticleSection;
