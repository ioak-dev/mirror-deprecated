import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { MirrorConfig } from '../types/MirrorConfigType';
import './MirrorApp.scss';
import MirrorHome from '../components/MirrorHome';
import { MirrorRecordModel } from '../types/MirrorRecordModel';

const queryString = require('query-string');

interface Props {
  config: MirrorConfig;
  children?: any;
  rows: MirrorRecordModel[];
}

const MirrorApp = (props: Props) => {
  const location = useLocation();
  const history = useHistory();

  const [criteria, setCriteria] = useState({
    type: 'home',
    text: null,
    tag: null,
    categoryId: null,
    articleId: null,
  });

  const [slots, setSlots] = useState<any>({});

  useEffect(() => {
    initializeViews();
  }, [props.children]);

  const initializeViews = () => {
    let newSlots = {};
    if (props.children) {
      React.Children.toArray(props.children).forEach((node: any) => {
        newSlots = { ...newSlots, [node.props.slot]: node };
      });
    }
    setSlots(newSlots);
  };

  const [previousCriteria, setPreviousCriteria] = useState({
    type: 'home',
    text: null,
    tag: null,
    categoryId: null,
    articleId: null,
  });

  useEffect(() => {
    const _criteria = queryString.parse(location.search);
    setCriteria({
      articleId: _criteria.id,
      categoryId: _criteria.category,
      text: _criteria.text,
      tag: _criteria.tag,
      type: _criteria.type || 'home',
    });
  }, [location.search]);

  useEffect(() => {
    switch (criteria.type) {
      case 'view':
      case 'edit':
      case 'home':
      default:
        if (
          previousCriteria.text !== criteria.text ||
          previousCriteria.tag !== criteria.tag ||
          previousCriteria.categoryId !== criteria.categoryId
        ) {
          console.log('test');
        }
        break;
    }
    setPreviousCriteria({ ...criteria });
  }, [criteria]);

  const searchByText = (text: string) => {
    history.push(`${location.pathname}?type=home&text=${text}`);
  };

  const searchByCategory = (category: string) => {
    history.push(`${location.pathname}?type=home&category=${category}`);
  };

  const searchByTag = (tag: string) => {
    history.push(`${location.pathname}?type=home&tag=${tag}`);
  };

  return (
    <div className="mirror-app">
      {criteria.type === 'home' && (
        <MirrorHome
          criteria={criteria}
          slots={slots}
          config={props.config.fieldDef}
          rows={props.rows}
        />
      )}
    </div>
  );
};

export default MirrorApp;
