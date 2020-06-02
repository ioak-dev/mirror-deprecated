import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import './style.scss';
import ArticleItem from './ArticleItem';

interface Props {
  location: any;
  history: any;
  space: string;
}

const queryString = require('query-string');

const GET_ARTICLE = gql`
  query Article($id: ID!) {
    article(id: $id) {
      id
      title
      description
      tags {
        id
        name
      }
    }
  }
`;

const ViewArticle = (props: Props) => {
  const [urlParam, setUrlParam] = useState({
    id: '',
  });
  const { loading, error, data } = useQuery(GET_ARTICLE, {
    variables: { id: urlParam.id },
  });

  useEffect(() => {
    setUrlParam(queryString.parse(props.location.search));
  }, [props.location.search]);

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          {!loading && !error && (
            <ArticleItem
              history={props.history}
              id={urlParam.id}
              space={props.space}
              article={data.article}
            />
          )}
          {error && <div className="typography-6">Article does not exist</div>}
        </div>
      </div>
    </div>
  );
};

export default ViewArticle;
