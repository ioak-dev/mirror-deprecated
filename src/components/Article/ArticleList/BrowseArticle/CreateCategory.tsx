import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import './style.scss';
import OakText from '../../../../oakui/OakText';
import OakButton from '../../../../oakui/OakButton';
import { UPDATE_CATEGORY, LIST_CATEGORIES } from '../../../Types/schema';
import { CategoryPayload } from '../../../../types/graphql';

interface Props {
  parentCategoryId: string;
  handleClose: Function;
}

const CreateCategory = (props: Props) => {
  const { updateQuery } = useQuery(LIST_CATEGORIES);
  const [addCategory, { data: savedCategory }] = useMutation(UPDATE_CATEGORY);
  const [state, setState] = useState({ name: '' });

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const onSubmit = event => {
    event.preventDefault();
    const payload: CategoryPayload = {
      name: state.name,
      parentCategoryId: props.parentCategoryId,
    };
    addCategory({
      variables: {
        payload,
      },
      update: (cache, { data: { addCategory } }) => {
        const data: any = cache.readQuery({ query: LIST_CATEGORIES });
        cache.writeQuery({
          query: LIST_CATEGORIES,
          data: { categories: [...data.categories, addCategory] },
        });
      },
    });
    props.handleClose();
  };
  return (
    <div className="create-category">
      <form method="GET" onSubmit={onSubmit} noValidate>
        <OakText
          data={state}
          id="name"
          handleChange={handleChange}
          label="Category name"
        />
      </form>
      <div className="action-footer">
        {state.name && (
          <OakButton theme="primary" variant="appear" action={onSubmit}>
            Save
          </OakButton>
        )}
        <OakButton theme="default" variant="appear" action={props.handleClose}>
          Cancel
        </OakButton>
      </div>
    </div>
  );
};

export default CreateCategory;
