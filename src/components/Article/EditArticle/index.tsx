import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import './style.scss';
import { useQuery } from '@apollo/react-hooks';
import EditItem from './EditItem';

interface Props {
  space: string;
  location: any;
  history?: any;
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

const EditArticle = (props: Props) => {
  const [urlParam, setUrlParam] = useState({
    id: '',
    categoryId: '',
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
            <EditItem
              history={props.history}
              id={urlParam.id}
              space={props.space}
              article={data.article}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditArticle;
