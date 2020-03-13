import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './style.scss';
import ArticleItem from './ArticleItem';
import OakDialog from '../../oakui/OakDialog';
import OakSelect from '../../oakui/OakSelect';
import OakViewResolver from '../../oakui/OakViewResolver';
import OakView from '../../oakui/OakView';
import { isEmptyOrSpaces } from '../Utils';
import { sendMessage, receiveMessage } from '../../events/MessageService';
import OakPagination from '../../oakui/OakPagination';
import OakPrompt from '../../oakui/OakPrompt';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';
import {
  fetchArticle,
  saveArticle,
  deleteArticle,
} from '../../actions/ArticleActions';

interface Props {
  match: any;
  setProfile: Function;
  profile: any;
  authorization: any;
  logout: Function;
  article: any;
  fetchArticle: Function;
  saveArticle: Function;
  deleteArticle: Function;
}

const domain = 'article';

const ArticleController = (props: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState('');
  const [data, setData] = useState({
    id: undefined,
    category: '',
    question: '',
    answer: '',
    newCategory: '',
  });
  const [items, setItems] = useState<undefined | any[]>([{}]);
  const [paginationPref, setPaginationPref] = useState({
    pageNo: 1,
    rowsPerPage: 6,
  });

  useEffect(() => {
    const eventBus = receiveMessage().subscribe(message => {
      if (message.name === domain && message.signal) {
        sendMessage('notification', true, {
          type: 'success',
          message: `${domain} ${message.data.action}`,
          duration: 5000,
        });
        if (message.data.action !== 'deleted') {
          setEditDialogOpen(!editDialogOpen);
        }
      }
    });
    return () => eventBus.unsubscribe();
  });

  useEffect(() => {
    if (props.authorization.isAuth) {
      props.fetchArticle(props.match.params.tenant, props.authorization);
    }
    props.setProfile({ ...props.profile, tenant: props.match.params.tenant });
  }, []);

  useEffect(() => {
    if (props.authorization.isAuth) {
      props.fetchArticle(props.match.params.tenant, props.authorization);
    }
  }, [props.authorization.isAuth]);

  useEffect(() => {
    if (!editDialogOpen) {
      setData({
        id: undefined,
        category: '',
        question: '',
        answer: '',
        newCategory: '',
      });
    }
  }, [editDialogOpen]);

  useEffect(() => {
    const result = searchCriteria
      ? props.article.items.filter(
          item => item.question.toLowerCase().indexOf(searchCriteria) !== -1
        )
      : props.article.items;
    setItems(result);
  }, [props.article.items, searchCriteria]);

  const editArticle = article => {
    let categoryName = data.category;
    if (categoryName === '<create new>') {
      categoryName = data.newCategory;
    }
    setEditDialogOpen(true);
    setData({
      id: article._id,
      category: article.category,
      question: article.question,
      answer: article.answer,
      newCategory: '',
    });
  };

  const confirmDeleteFaq = id => {
    setData({
      ...data,
      id,
    });
    setDeleteDialogOpen(true);
  };

  const deleteArticle = () => {
    props.deleteArticle(
      props.match.params.tenant,
      props.authorization,
      data.id
    );
  };

  const addArticle = () => {
    let { category } = data;
    if (category === '<create new>') {
      category = data.newCategory;
    }
    const article = {
      id: data.id,
      question: data.question,
      answer: data.answer,
      category,
    };
    if (isEmptyOrSpaces(article.category)) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Category is missing',
        duration: 5000,
      });
      return;
    }

    if (isEmptyOrSpaces(article.question)) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Question is missing',
        duration: 5000,
      });
      return;
    }

    if (isEmptyOrSpaces(article.answer)) {
      article.answer = 'unsorted';
    }

    props.saveArticle(props.match.params.tenant, props.authorization, article);
  };

  const handleChange = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const onChangePage = (pageNo: number, rowsPerPage: number) => {
    setPaginationPref({
      pageNo,
      rowsPerPage,
    });
  };

  const handleSearchCriteriaChange = event => {
    setSearchCriteria(event.target.value);
  };

  let view: any[] = [];
  if (items) {
    view = items.slice(
      (paginationPref.pageNo - 1) * paginationPref.rowsPerPage,
      paginationPref.pageNo * paginationPref.rowsPerPage
    );
  }
  const listview = view.map(item => (
    <div key={item._id}>
      <ArticleItem
        id={item._id}
        article={item}
        editArticle={editArticle}
        confirmDeleteFaq={() => confirmDeleteFaq(item._id)}
      />
      <br />
    </div>
  ));
  return (
    <div className="article">
      <OakDialog
        visible={editDialogOpen}
        toggleVisibility={() => setEditDialogOpen(!editDialogOpen)}
      >
        <div className="dialog-body">
          <div>
            <OakSelect
              theme="default"
              label="Category"
              data={data}
              id="category"
              handleChange={e => handleChange(e)}
              elements={props.article.categories}
              firstAction="<create new>"
            />
          </div>
          <div>
            {data.category === '<create new>' && (
              <OakText
                label="Category name"
                data={data}
                id="newCategory"
                handleChange={e => handleChange(e)}
              />
            )}
          </div>

          <OakText
            label="Question"
            data={data}
            id="question"
            handleChange={e => handleChange(e)}
          />
          <OakText
            label="Answer"
            data={data}
            id="answer"
            handleChange={e => handleChange(e)}
          />
        </div>
        <div className="dialog-footer">
          <OakButton
            action={() => setEditDialogOpen(!editDialogOpen)}
            theme="default"
            variant="animate in"
            align="left"
          >
            <i className="material-icons">close</i>Cancel
          </OakButton>
          <OakButton
            action={() => addArticle()}
            theme="primary"
            variant="animate out"
            align="right"
          >
            <i className="material-icons">double_arrow</i>Create
          </OakButton>
        </div>
      </OakDialog>

      {deleteDialogOpen}
      <OakPrompt
        action={() => deleteArticle()}
        visible={deleteDialogOpen}
        toggleVisibility={() => setDeleteDialogOpen(!deleteDialogOpen)}
      />

      <OakViewResolver sideLabel="More options">
        <OakView main>
          <div className="search-bar">
            <div>
              <OakText
                label="Search"
                data={searchCriteria}
                handleChange={handleSearchCriteriaChange}
                id="searchCriteria"
              />
            </div>
            <div className="clear">
              <OakButton
                action={() => setSearchCriteria('')}
                theme="default"
                variant="block"
                icon="clear"
              />
            </div>
            <div>
              <OakButton
                action={() => setEditDialogOpen(!editDialogOpen)}
                theme="primary"
                variant="animate out"
                align="right"
              >
                <i className="material-icons">double_arrow</i>Add New Article
              </OakButton>
            </div>
          </div>
          <OakPagination
            totalRows={props.article.items.length}
            onChangePage={onChangePage}
            label="Items per page"
          />
          {listview}
        </OakView>
      </OakViewResolver>
    </div>
  );
};

const mapStateToProps = state => ({
  article: state.article,
});

export default connect(mapStateToProps, {
  fetchArticle,
  saveArticle,
  deleteArticle,
})(ArticleController);
