import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import OakRoute from '../../Auth/OakRoute';
import './style.scss';
import CreateArticle from '../CreateArticle';
import ArticleItem from './ArticleItem';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
  authorization: any;
  cookies: any;
}

const ListArticle = (props: Props) => {
  const categoryid = '5eca57296a086f066690011s'; //to be removed
  const history = useHistory(); // to be removed

  useEffect(() => {
    props.setProfile({
      ...props.profile,
      tenant: props.match.params.tenant,
    });
    console.log(props.match.params.tenant);
  }, []);

  // To be removed
  const nextPath = path => {
    history.push(path);
  };

  return (
    <div className="listArticle">
      {/* {To Be removed} */}
      <button
        onClick={() =>
          nextPath(
            `/${props.profile.tenant}/article/create?categoryid=5eca57296a086f066690011s`
          )
        }
      >
        change path
      </button>
      <ArticleItem />
    </div>
  );
};

export default ListArticle;
