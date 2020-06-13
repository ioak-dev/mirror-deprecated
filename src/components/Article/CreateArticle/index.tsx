import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import './style.scss';
import CreateItem from './CreateItem';
import CategoryTree from '../../Category/CategoryTree';
import { Category } from '../../../types/graphql';
import { LIST_CATEGORIES } from '../../Types/schema';

interface Props {
  location: any;
  history: any;
  asset: string;
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
            asset={props.asset}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
