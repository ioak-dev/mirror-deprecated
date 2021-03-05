import React, { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import OakButton from '../../../oakui/OakButton';
import OakText from '../../../oakui/OakText';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';
import OakHeading from '../../../oakui/OakHeading';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';
import { fetchSpace } from '../../Auth/AuthService';
import SpaceItem from './SpaceItem';
import './style.scss';
import OakSpinner from '../../../oakui/OakSpinner';

interface Props {
  history: any;
  location: any;
  asset: string;
}

const queryString = require('query-string');

const OneAuth = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [view, setView] = useState<Array<any> | undefined>(undefined);
  const [searchCriteria, setSearchCriteria] = useState({ text: '' });
  const [spinner, setSpinner] = useState(false);
  const [queryParam, setQueryParam] = useState<any>();

  useEffect(() => {
    const queryParam = queryString.parse(props.location.search);
    if (queryParam.space) {
      window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${queryParam.space}/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}&asset=${props.asset}&from=${queryParam.from}`;
    }
    setQueryParam(queryParam);
  }, []);

  useEffect(() => {
    setSpinner(true);
    fetchSpace().then(response => {
      setView(search(response.data, searchCriteria.text));
      setSpinner(false);
    });
  }, [searchCriteria]);

  const search = (existingSpace, criteria) => {
    if (isEmptyOrSpaces(criteria)) {
      return existingSpace;
    }
    return existingSpace.filter(
      item => item.name.toLowerCase().indexOf(criteria.toLowerCase()) !== -1
    );
  };

  const handleSearchCriteria = event => {
    setSearchCriteria({
      ...searchCriteria,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (authorization.isAuth) {
      props.history.push(`/${props.asset}/article`);
    }
  }, [authorization]);

  const goBack = () => {
    props.history.goBack();
  };

  const getHeadingLinks = () => {
    const links: any[] = [];
    if (props.history.length > 2) {
      links.push({
        label: 'Go back',
        icon: 'reply',
        action: () => goBack(),
      });
    }
    return links;
  };

  return (
    <OakPage>
      <OakSection>
        <div className="view-asset-item">
          <div className="page-header">
            <OakHeading
              title="Login via Oneauth"
              subtitle="You will be redirected to oneauth for signing in to your space"
              links={getHeadingLinks()}
              linkSize="large"
            />
          </div>
          {spinner && <OakSpinner />}
          {view && view?.length > 0 ? (
            <OakText
              label="Type company name to filter"
              handleChange={handleSearchCriteria}
              id="text"
              data={searchCriteria}
            />
          ) : (
            'No space found. Check with Oneauth administrator.'
          )}
          <div className="list-spaces">
            <div className="list-spaces--content">
              {view?.map(space => (
                <SpaceItem
                  history={props.history}
                  space={space}
                  key={space._id}
                  asset={props.asset}
                  from={queryParam && queryParam.from ? queryParam.from : null}
                />
              ))}
            </div>
          </div>
        </div>
      </OakSection>
    </OakPage>
  );
};

export default OneAuth;
