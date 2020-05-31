import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './style.scss';
import OakButton from '../../../oakui/OakButton';
import { Article } from '../../../types/graphql';

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
  {
    articles {
      id
      title
      description
    }
  }
`;

const CreateArticle = (props: Props) => {
  const { loading, error, data } = useQuery(LIST_ARTICLES);
  const [urlParam, setUrlParam] = useState({
    categoryid: '',
  });

  useEffect(() => {
    props.setProfile({
      ...props.profile,
      tenant: props.match.params.tenant,
    });
    setUrlParam(queryString.parse(props.location.search));
  }, []);

  const createArticleLink = event => {
    props.history.push(`/${props.space}/article/create`);
  };

  const viewArticleLink = event => {
    props.history.push(`/${props.space}/article/view`);
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
          <div className="separate-as-new-component">
            {data?.articles.map((item: Article) => (
              <>
                <div className="typography-8">{item.title}</div>
                <div className="typography-5 space-bottom-2">
                  {item.description}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
