import React from 'react';
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

class Faq extends React.Component<Props, State> {
  constructor(props){
    super(props)
    this.state = {
      isEditDialogOpen: false,
      isDeleteDialogOpen: false,
      id: undefined,
      category: '',
      question: '',
      answer: '',
      newCategory: '',
      editDialogLabel: 'Article',
      pageNo: 1,
      rowsPerPage: 6,

      sidebarElements: {
        article: [
            {
                label: 'New article',
                action: this.toggleEditDialog,
                icon: 'add'
            }
        ]
    }
    }
  }

  componentDidMount(){
    if(this.props.authorization.isAuth){
      this.initializeFaq(this.props.authorization)
    }

    this.props.setProfile({
      ...this.props.profile,
      tenant: this.props.match.params.tenant
    })

  }

  componentWillReceiveProps(nextProps){
    if(nextProps.authorization && !this.props.authorization && !this.props.authorization.isAuth && nextProps.authorization.isAuth){
      this.initializeFaq(this.props.authorization)
    }
  }

  initializeFaq(authorization){
    this.props.fetchArticle(this.props.match.params.tenant, authorization);
  }

  toggleEditDialog = () => {
    this.setState({
        isEditDialogOpen: !this.state.isEditDialogOpen,
        id: undefined,
        category: '',
        question: '',
        answer: '',
        editDialogLabel: 'Add'
    })
  }

  toggleDeleteDialog = () => {
    this.setState({
        isDeleteDialogOpen: !this.state.isDeleteDialogOpen
    })
  }

  editFaq = (faq) => {
    let category = this.state.category
    if (category === '<create new>') {
      category = this.state.newCategory;
    }
    
    this.setState({
      isEditDialogOpen: true,
      id: faq._id,
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      editDialogLabel: 'Save'
    })
  }

  confirmDeleteFaq =(faqId) => {
    this.setState({
      isDeleteDialogOpen: true,
      id: faqId,
      editDialogLabel: 'Delete'   
    })
  }

  deleteFaq = () => {
    this.props.deleteArticle(this.props.match.params.tenant, this.props.authorization, this.state.id);
  }

  searchByWord = (faqName) =>{

  }

  addFaq= () => {
    const that = this;
    let category = this.state.category
    if (category === '<create new>') {
      category = this.state.newCategory;
    }
    let faq = {
        id: this.state.id,
        question: this.state.question,
        answer: this.state.answer,
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

    this.props.saveArticle(this.props.match.params.tenant, this.props.authorization, faq);
}


  handleChange = (event) => {
    this.setState(
        {
            ...this.state,
            [event.target.name]: event.target.value
        }
    )
  }

  onChangePage = (pageNo: number, rowsPerPage: number) => {
      this.setState({
          pageNo: pageNo,
          rowsPerPage: rowsPerPage
      });
  }

  render() {
    let view: any[] = [];
    if (this.props.article.items) {
      view = this.props.article.items.slice((this.state.pageNo - 1) * this.state.rowsPerPage, this.state.pageNo * this.state.rowsPerPage);
    }
    const listview = view.map(item => (
      <div key={item._id}>
        <Link id={item._id} faq={item} editFaq={this.editFaq} confirmDeleteFaq={this.confirmDeleteFaq} search={this.searchByWord}></Link>
        <br />
      </div>
    ))
    return (
      <div className="faq">
        <OakDialog visible={this.state.isEditDialogOpen} toggleVisibility={this.toggleEditDialog}>
          <div className="dialog-body">
          <div><OakSelect theme="default" label="Category" data={this.state} id="category" handleChange={e => this.handleChange(e)} elements={this.props.article.categories} firstAction="<create new>" /></div>
          <div>
            {this.state.category === '<create new>' && <OakText label="Category name" data={this.state} id="newCategory" handleChange={e => this.handleChange(e)} />}
          </div>
            
            <OakText label="Question" data={this.state} id="question" handleChange={e => this.handleChange(e)} />
            <OakText label="Answer" data={this.state} id="answer" handleChange={e => this.handleChange(e)} />
          </div>
          <div className="dialog-footer">
            <OakButton action={this.toggleEditDialog} theme="default" variant="animate in" align="left"><i className="material-icons">close</i>Cancel</OakButton>
            <OakButton action={this.addFaq} theme="primary" variant="animate out" align="right"><i className="material-icons">double_arrow</i>{this.state.editDialogLabel}</OakButton>
          </div>
        </OakDialog>
        
      {this.state.isDeleteDialogOpen}
        <OakPrompt action={this.deleteFaq} visible={this.state.isDeleteDialogOpen} toggleVisibility={this.toggleDeleteDialog} />

        <ViewResolver sideLabel='More options'>
            <View main>
            {listview}
            <OakPagination totalRows={this.props.article.items.length} onChangePage={this.onChangePage} label="Items per page" />
            </View>
            <View side>
              <div className="filter-container">
                  <div className="section-main">
                    <Sidebar label="Article" elements={this.state.sidebarElements['article']} icon="add" animate />
                    <Sidebar label="Search" elements={this.state.sidebarElements['search']} icon="search" animate>
                      Search content goes here
                    </Sidebar>
                  </div>
              </div>
            </View>
        </ViewResolver>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  article: state.article,
});

export default connect(mapStateToProps, {
  fetchArticle,
  saveArticle,
  deleteArticle,
})(Faq);
