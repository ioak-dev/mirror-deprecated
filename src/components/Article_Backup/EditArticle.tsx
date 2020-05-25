import React, { useState } from 'react';
import OakText from '../../oakui/OakText';
import OakEditor from '../../oakui/OakEditor';

const EditArticle = () => {
  const [data, setData] = useState({
    id: undefined,
    category: '',
    question: '',
    answer: '',
    newCategory: '',
  });

  const handleChange = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <div className="left">
        <div className="icon">
          {/* <i className="material-icons">blur_on</i> */}N
        </div>
        {/* <div className="label one-liner">{props.label}</div> */}
      </div>
      <div className="right">
        <div>
          <i className="material-icons modal-close-icon">close</i>
          {/* <div className="text-esc">esc</div> */}
        </div>
      </div>
      <OakText
        label="Title"
        data={data}
        id="question"
        handleChange={e => handleChange(e)}
      />
      <OakEditor data={data} id="answer" handleChange={e => handleChange(e)} />
    </div>
  );
};

export default EditArticle;
