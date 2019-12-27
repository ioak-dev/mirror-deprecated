import React from 'react';
import './style.scss';
import Link from './Link';
import ArcTextField from '../Ux/ArcTextField';
import ArcDialog from '../Ux/ArcDialog';
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
  category: string,
  question: string,
  answer: string,
  editDialogLabel: string,
  isEditDialogOpen:boolean,
  sidebarElements:any
}

export default class Faq extends React.Component<Props, State> {
  constructor(props){
    super(props)
    this.state = {
      faq:[],
      isEditDialogOpen: false,
      id: undefined,
      category: '',
      question: '',
      answer: '',
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
          faq:response.data.faq
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

    let faq = {
        id: this.state.id,
        category: this.state.category,
        question: this.state.question,
        answer: this.state.answer
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
            [event.currentTarget.name]: event.currentTarget.value
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
        <ArcDialog title="Add FAQ " visible={this.state.isEditDialogOpen} toggleVisibility={this.toggleEditDialog}>
          <ArcTextField label="Category" data={this.state} id="category" handleChange={e => this.handleChange(e)} />
          <ArcTextField label="Question" data={this.state} id="question" handleChange={e => this.handleChange(e)} />
          <ArcTextField label="Answer" data={this.state} id="answer" handleChange={e => this.handleChange(e)} />
          <div className="actions">
            <button onClick={this.toggleEditDialog} className="default animate in right align-left"><i className="material-icons">close</i>Cancel</button>
            <button onClick={this.addFaq} className="primary animate out right align-right"><i className="material-icons">double_arrow</i>{this.state.editDialogLabel}</button>
          </div>
        </ArcDialog>

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