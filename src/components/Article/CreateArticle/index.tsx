import React, { useEffect, useState } from 'react';
import './style.scss';
import CreateItem from './CreateItem';

interface Props {
  location: any;
  history: any;
  space: string;
}

const queryString = require('query-string');

const CreateArticle = (props: Props) => {
  const [urlParam, setUrlParam] = useState({
    categoryid: '',
  });

  useEffect(() => {
    setUrlParam(queryString.parse(props.location.search));
  }, []);

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <CreateItem
            history={props.history}
            categoryid={urlParam.categoryid}
            space={props.space}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
