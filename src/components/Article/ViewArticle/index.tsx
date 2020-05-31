import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useSelector } from 'react-redux';
import './style.scss';
import ArticleItem from './ArticleItem';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
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
  const authorization = useSelector(state => state.authorization);

  useEffect(() => {
    props.setProfile({
      ...props.profile,
      tenant: props.match.params.tenant,
    });
  }, []);

  useEffect(() => {
    setUrlParam(queryString.parse(props.location.search));
  }, [props.location.search]);

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          {!loading && !error && (
            <ArticleItem
              {...props}
              authorization={authorization}
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
