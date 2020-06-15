import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import './style.scss';
import { ARTICLES_BY_TAG } from '../../../Types/schema';
import OakInfiniteScroll from '../../../../oakui/OakInfiniteScroll';
import ArticleLink from '../../ArticleLink';
import { Article, Tag } from '../../../../types/graphql';
import OakSpinner from '../../../../oakui/OakSpinner';

interface Props {
  tag: string;
  asset: string;
  history: any;
}

const ArticleSection = (props: Props) => {
  const { loading, error, data, fetchMore, refetch } = useQuery(
    ARTICLES_BY_TAG,
    {
      variables: { tag: props.tag, pageSize: 10, pageNo: 0 },
      fetchPolicy: 'cache-and-network',
    }
  );

  const fetchMoreArticles = () => {
    if (data?.articlesByTag?.hasMore) {
      fetchMore({
        variables: {
          pageNo: data?.articlesByTag?.pageNo,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          return {
            articlesByTag: {
              ...prev.articlesByTag,
              results: [
                ...prev.articlesByTag.results,
                ...fetchMoreResult.articlesByTag.results,
              ],
              pageNo: fetchMoreResult.articlesByTag.pageNo,
              hasMore: fetchMoreResult.articlesByTag.hasMore,
            },
          };
        },
      });
    }
  };
  const goBack = () => {
    props.history.goBack();
  };

  const viewByTags = event => {
    props.history.push(`/${props.asset}/article/tag`);
  };

  return (
    <div className="app-content">
      <div className="app-text">
        <div className="page-title">
          Articles by tag
          <div className="page-subtitle">
            Showing articles for tag &quot;{props.tag}&quot;
            <div className="tag-article-section-action">
              <div className="align-horizontal hyperlink-container">
                <i className="material-icons typography-6">reply</i>
                <div className="hyperlink" onClick={goBack}>
                  Go back
                </div>
              </div>
              <div className="align-horizontal hyperlink-container see-other-tags">
                <i className="material-icons typography-6">local_offer</i>
                <div className="hyperlink" onClick={viewByTags}>
                  See other tags
                </div>
              </div>
            </div>
          </div>
          <div className="page-highlight" />
        </div>
        <div className="tag-article-section">
          <OakInfiniteScroll
            handleChange={fetchMoreArticles}
            selector=".app-page"
          >
            <div className="search-results-section">
              <div className="search-results-container">
                {data?.articlesByTag?.results?.map((item: Tag, index) => (
                  <div key={item?.article?.id || index}>
                    {item?.article && (
                      <ArticleLink
                        article={item.article}
                        asset={props.asset}
                        history={props.history}
                      />
                    )}
                  </div>
                ))}
                {/* {data?.articlesByTag?.results?.length === 0 &&
              props.text &&
              !loading && (
                <AlternateSection history={props.history} asset={props.asset} />
              )} */}
              </div>
              <div>{loading ? <OakSpinner /> : ''}</div>
            </div>
          </OakInfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default ArticleSection;
