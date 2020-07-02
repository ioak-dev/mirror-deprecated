import React, { useEffect, useState } from 'react';
import './style.scss';
import CreateItem from './CreateItem';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';

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
    <OakPage>
      <OakSection>
        <CreateItem
          history={props.history}
          categoryid={urlParam.categoryid}
          asset={props.asset}
        />
      </OakSection>
    </OakPage>
  );
};

export default CreateArticle;
