import React from 'react';
import './style.scss';
import Link from './Link';
import OakTextField from '../Ux/OakTextField';
import OakDialog from '../Ux/OakDialog';
import OakSelect from '../Ux/OakSelect';
import ViewResolver from '../Ux/ViewResolver';
import View from '../Ux/View';
import { Authorization } from '../Types/GeneralTypes';
import { httpGet, httpDelete, httpPost, httpPut } from '../Lib/RestTemplate';
import { constants } from '../Constants';
import { isEmptyOrSpaces } from '../Utils';
import { sendMessage } from '../../events/MessageService';
import Sidebar from '../Ux/Sidebar';

interface Props{
  match: any,
  setProfile: Function,
  profile: any,
  authorization: Authorization,
  logout: Function
}

interface State{
  faq: any,
  id?: string,
  category: any,
  question: string,
  answer: string,
  editDialogLabel: string,
  isEditDialogOpen:boolean,
  sidebarElements:any,
  existingCategories: any,
  newCategory: String
}

export default class Faq extends React.Component<Props, State> {
  constructor(props){
    super(props)
    this.state = {
      faq:[],
      existingCategories: [],
      isEditDialogOpen: false,
      id: undefined,
      category: '',
      question: '',
      answer: '',
      newCategory: '',
      editDialogLabel: 'Article',

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
    if(nextProps.authorization){
      this.initializeFaq(this.props.authorization)
    }
  }

  initializeFaq(authorization){
    const that = this;
    httpGet(constants.API_URL_FAQ + '/' + 
    this.props.match.params.tenant + '/',
      {
        headers:{
          Authorization: this.props.authorization.token
        }
      })
      .then(function(response){
        that.setState({
          faq:response.data.faq,
          existingCategories: response.data.category
        });

      })
      
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

  deleteFaq = (faqId) => {
    const that = this;
    httpDelete(constants.API_URL_FAQ + '/' + this.props.match.params.tenant + '/' + faqId,
    {
      headers: {
        Authorization: this.props.authorization.token
      }
    })
        .then(function(response) {
            if (response.status === 200) {
                sendMessage('notification', true, {type: 'success', message: 'FAQ deleted', duration: 5000});
                that.initializeFaq(that.props.authorization);
            }
        })
        .catch((error) => {
            if (error.response.status === 401) {
                that.props.logout(null, 'failure', 'Session expired. Login again');
            }
        })

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

    httpPut(constants.API_URL_FAQ + '/' + 
    this.props.match.params.tenant + '/',
    faq,
    {
      headers: {
        Authorization: this.props.authorization.token
      }
    })
    .then(function(response) {
        if (response.status === 200) {
            sendMessage('notification', true, {type: 'success', message: 'FAQ created', duration: 5000});
            that.toggleEditDialog();

            that.initializeFaq(that.props.authorization);
        }
    })
    .catch((error) => {
        if (error.response.status === 401) {
            that.props.logout(null, 'failure', 'Session expired. Login again');
        }
    })
}


  handleChange = (event) => {
    this.setState(
        {
            ...this.state,
            [event.target.name]: event.target.value
        }
    )
  }

  render() {
    const listview = this.state.faq.map(item => (
      <div key={item._id}>
        <Link id={item._id} faq={item} editFaq={this.editFaq} deleteFaq={this.deleteFaq} search={this.searchByWord}></Link>
        <br />
      </div>
    ))
    return (
      <div className="faq">
        <OakDialog title="Add FAQ " visible={this.state.isEditDialogOpen} toggleVisibility={this.toggleEditDialog}>
          <div className="dialog-body">
          <div><OakSelect label="Category" data={this.state} id="category" handleChange={e => this.handleChange(e)} elements={this.state.existingCategories} firstAction="<create new>" /></div>
          <div>
            {this.state.category === '<create new>' && <OakTextField label="Category name" data={this.state} id="newCategory" handleChange={e => this.handleChange(e)} />}
          </div>
            
            <OakTextField label="Question" data={this.state} id="question" handleChange={e => this.handleChange(e)} />
            <OakTextField label="Answer" data={this.state} id="answer" handleChange={e => this.handleChange(e)} />
          </div>
          <div className="dialog-footer">
            <button onClick={this.toggleEditDialog} className="default animate in right align-left"><i className="material-icons">close</i>Cancel</button>
            <button onClick={this.addFaq} className="primary animate out right align-right"><i className="material-icons">double_arrow</i>{this.state.editDialogLabel}</button>
          </div>
        </OakDialog>

        <ViewResolver sideLabel='More options'>
            <View main>
            {listview}
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