import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './style.scss';
import Link from './Link';
import OakDialog from '../../oakui/OakDialog';
import OakSelect from '../../oakui/OakSelect';
import ViewResolver from '../../oakui/ViewResolver';
import View from '../../oakui/View';
import { isEmptyOrSpaces } from '../Utils';
import { sendMessage } from '../../events/MessageService';
import Sidebar from '../../oakui/Sidebar';
import OakPagination from '../../oakui/OakPagination';
import OakPrompt from '../../oakui/OakPrompt';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';
import { fetchArticle, saveArticle, deleteArticle } from '../../actions/ArticleActions';

interface Props{
  match: any,
  setProfile: Function,
  profile: any,
  authorization: any,
  logout: Function,
  article: any,
  fetchArticle: Function,
  saveArticle: Function,
  deleteArticle: Function
}

interface State{
  id?: string,
  category: any,
  question: string,
  answer: string,
  editDialogLabel: string,
  isEditDialogOpen:boolean,
  isDeleteDialogOpen:boolean,
  sidebarElements:any,
  newCategory: String,
  data?: any,
  pageNo: number,
  rowsPerPage: number
}

const Faq = (props: Props) => {
  const sidebarElements = {
    article: [
        {
            label: 'New article',
            action: () => setEditDialogOpen(!editDialogOpen),
            icon: 'add'
        }
    ]
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [data, setData] = useState({
    id: undefined,
    category: '',
    question: '',
    answer: '',
    newCategory: '',
  });

  const [paginationPref, setPaginationPref] = useState({
    pageNo: 1,
    rowsPerPage: 6
  });

  useEffect(() => {
    if(props.authorization.isAuth){ 
      props.fetchArticle(props.match.params.tenant, props.authorization);
    }
    props.setProfile({...props.profile, tenant: props.match.params.tenant});
  }, []);

  useEffect(() => {
    if(props.authorization.isAuth){
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
        newCategory: ''
      })
    }
  }, [editDialogOpen])

  const editFaq = (faq) => {
    console.log(faq);
    let categoryName = data.category
    if (categoryName === '<create new>') {
      categoryName = data.newCategory;
    }
    setEditDialogOpen(true);
    setData({
      id: faq._id,
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      newCategory: ''
    });
  }

  const confirmDeleteFaq =(faqId) => {
    setData({
      ...data,
      id: faqId
    });
    setDeleteDialogOpen(true);
  }

  const deleteFaq = () => {
    props.deleteArticle(props.match.params.tenant, props.authorization, data.id);
  }

  const searchByWord = (faqName) =>{

  }

  const addFaq= () => {
    let category = data.category
    if (category === '<create new>') {
      category = data.newCategory;
    }
    let faq = {
        id: data.id,
        question: data.question,
        answer: data.answer,
        category: category
    }
    if (isEmptyOrSpaces(faq.category)) {
        sendMessage('notification', true, {type: 'failure', message: 'Category is missing', duration: 5000});
        return;
    }

    if (isEmptyOrSpaces(faq.question)) {
        sendMessage('notification', true, {type: 'failure', message: 'Question is missing', duration: 5000});
        return;
    }

    if (isEmptyOrSpaces(faq.answer)) {
        faq.answer = 'unsorted';
    }

    props.saveArticle(props.match.params.tenant, props.authorization, faq);
  }

  const handleChange = (event) => {
    setData(
        {
            ...data,
            [event.target.name]: event.target.value
        }
    )
  }

  const onChangePage = (pageNo: number, rowsPerPage: number) => {
      setPaginationPref({
          pageNo: pageNo,
          rowsPerPage: rowsPerPage
      });
  }

  let view: any[] = [];
  if (props.article.items) {
    view = props.article.items.slice((paginationPref.pageNo - 1) * paginationPref.rowsPerPage, paginationPref.pageNo * paginationPref.rowsPerPage);
  }
  const listview = view.map(item => (
    <div key={item._id}>
      <Link id={item._id} faq={item} editFaq={editFaq} confirmDeleteFaq={() => confirmDeleteFaq(item._id)} search={() => searchByWord(item._id)}></Link>
      <br />
    </div>
  ))
  return (
    <div className="faq">
      <OakDialog visible={editDialogOpen} toggleVisibility={() => setEditDialogOpen(!editDialogOpen)}>
        <div className="dialog-body">
        <div><OakSelect theme="default" label="Category" data={data} id="category" handleChange={e => handleChange(e)} elements={props.article.categories} firstAction="<create new>" /></div>
        <div>
          {data.category === '<create new>' && <OakText label="Category name" data={data} id="newCategory" handleChange={e => handleChange(e)} />}
        </div>
          
          <OakText label="Question" data={data} id="question" handleChange={e => handleChange(e)} />
          <OakText label="Answer" data={data} id="answer" handleChange={e => handleChange(e)} />
        </div>
        <div className="dialog-footer">
          <OakButton action={() => setEditDialogOpen(!editDialogOpen)} theme="default" variant="animate in" align="left"><i className="material-icons">close</i>Cancel</OakButton>
          <OakButton action={() => addFaq()} theme="primary" variant="animate out" align="right"><i className="material-icons">double_arrow</i>Create</OakButton>
        </div>
      </OakDialog>
      
    {deleteDialogOpen}
      <OakPrompt action={() => deleteFaq()} visible={deleteDialogOpen} toggleVisibility={() => setDeleteDialogOpen(!deleteDialogOpen)} />

      <ViewResolver sideLabel='More options'>
          <View main>
          {listview}
          <OakPagination totalRows={props.article.items.length} onChangePage={onChangePage} label="Items per page" />
          </View>
          <View side>
            <div className="filter-container">
                <div className="section-main">
                  <Sidebar label="Article" elements={sidebarElements['article']} icon="add" animate />
                  <Sidebar label="Search" elements={sidebarElements['search']} icon="search" animate>
                    Search content goes here
                  </Sidebar>
                </div>
            </div>
          </View>
      </ViewResolver>
    </div>
  );
}

const mapStateToProps = state => ({
  article: state.article,
});

export default connect(mapStateToProps, {
  fetchArticle,
  saveArticle,
  deleteArticle,
})(Faq);
