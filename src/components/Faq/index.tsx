import React from 'react';
import './style.scss';
import Link from './Link';
import ArcTextField from '../Ux/ArcTextField';
import ArcDialog from '../Ux/ArcDialog';
import ViewResolver from '../Ux/ViewResolver';
import View from '../Ux/View';
import { Authorization } from '../Types/GeneralTypes';
import { httpGet, httpPut, httpPost } from '../Lib/RestTemplate';
import { constants } from '../Constants';
import { isEmptyOrSpaces } from '../Utils';
import { sendMessage } from '../../events/MessageService';
import Sidebar from '../Ux/Sidebar';

interface Props{
  match: any,
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
      editDialogLabel: 'Add',

      sidebarElements: {
        addNew: [
            {
                label: 'New FAQ',
                action: this.toggleEditDialog,
                icon: 'faq_add'
            }
        ]
    }
    }
  }

  componentDidMount(){
    if(this.props.authorization.isAuth){
      this.initializeFaq(this.props.authorization)
    }
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
        console.log(response.data.faq)
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

  }

  searchByFaq = (faqName) =>{

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

    httpPost(constants.API_URL_FAQ + '/' + 
    this.props.match.params.tenant + '/',
    faq,
    {
      headers: {
        Authorization: this.props.authorization.token
      }
    })
    .then(function(response) {
        if (response.status === 201) {
            sendMessage('notification', true, {type: 'success', message: 'Bookmark created', duration: 5000});
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
        <Link id={item._id} faq={item} editFaq={this.editFaq} deleteFaq={this.deleteFaq} search={this.searchByFaq}></Link>
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
            <button onClick={this.toggleEditDialog} className="default disabled"><i className="material-icons">close</i>Cancel</button>
            <button onClick={this.addFaq} className="primary block"><i className="material-icons">double_arrow</i>{this.state.editDialogLabel}</button>
          </div>
        </ArcDialog>

        <ViewResolver sideLabel='More options'>
            <View main>
            {listview}
            </View>
            <View side>
              <div className="filter-container">
                  <div className="section-main">
                    <Sidebar label="Add New" elements={this.state.sidebarElements['addNew']} icon="add" animate />
                  </div>
              </div>
            </View>
        </ViewResolver>
      </div>
    );
  }
}