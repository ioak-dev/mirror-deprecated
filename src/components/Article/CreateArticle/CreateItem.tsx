import React, { useState, useEffect } from 'react';
import OakText from '../../../oakui/OakText';
import OakEditor from '../../../oakui/OakEditor';
import SaveItem from './SaveItem';
import CancelItem from './CancelItem';

const CreateItem = props => {
  const [data, setData] = useState({
    title: '',
    description: '',
  });

  const handleChange = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    setData({
      title: '',
      description: '',
    });
  }, []);

  return (
    <div className="createArticle-item">
      <OakText
        label="Title"
        data={data}
        id="title"
        handleChange={e => handleChange(e)}
      />
      <OakEditor
        data={data}
        id="description"
        handleChange={e => handleChange(e)}
      />
      <div className="article-action">
        <SaveItem data={data} {...props} />
        <CancelItem {...props} />
      </div>
    </div>
  );
};
export default CreateItem;
