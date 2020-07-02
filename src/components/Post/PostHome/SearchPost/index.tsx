import React, { useEffect, useState } from 'react';
import './style.scss';
import SearchSection from './SearchSection';
import OakHeading from '../../../../oakui/OakHeading';
import OakPage from '../../../../oakui/OakPage';
import OakSection from '../../../../oakui/OakSection';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
  asset: string;
}

const queryString = require('query-string');

const SearchPost = (props: Props) => {
  const [urlParam, setUrlParam] = useState({
    text: '',
  });

  useEffect(() => {
    setUrlParam(queryString.parse(props.location.search));
  }, [props.location.search]);

  const browsePost = () => {
    props.history.push(`/${props.asset}/post/browse`);
  };

  const handleSearchTextChange = text => {
    props.history.push(`/${props.asset}/post/search?text=${text}`);
  };

  return (
    <OakPage>
      <OakSection>
        <div className="browse-post">
          <OakHeading
            title="Search posts"
            links={[
              {
                label: 'Or Browse by timeline instead',
                action: () => browsePost(),
              },
            ]}
          />
          {/* <div className="typography-4 align-horizontal">
            Find your questions answered, from the knowledge base. If you
            don&apos;t get your desired answers, you can post your question for
            response from our customer support team or a community member
          </div> */}
          <SearchSection
            asset={props.asset}
            history={props.history}
            text={urlParam.text}
            handleSearchTextChange={handleSearchTextChange}
          />
        </div>
      </OakSection>
    </OakPage>
  );
};

export default SearchPost;
