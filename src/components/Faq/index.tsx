import React from 'react';
import './style.scss';
import Link from './Link';
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
import OakTable from '../Ux/OakTable';
import OakPagination from '../Ux/OakPagination';
import OakPrompt from '../Ux/OakPrompt';
import OakText from '../Ux/OakText';

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
  isDeleteDialogOpen:boolean,
  sidebarElements:any,
  existingCategories: any,
  newCategory: String,
  data?: any,
  pageNo: number,
  rowsPerPage: number
}

export default class Faq extends React.Component<Props, State> {
  constructor(props){
    super(props)
    this.state = {
      faq:[],
      existingCategories: [],
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

  componentWillMount() {
    // Temporary data for illustration of table
    const rows = [
      this.createData('1 Frozen yoghurt', 159, 6.0, 24, 4.0),
      this.createData('2 Ice cream sandwich', 237, 9.0, 37, 4.3),
      this.createData('3 Eclair', 262, 16.0, 24, 6.0),
      this.createData('4 Cupcake', 305, 3.7, 67, 4.3),
      this.createData('5 Gingerbread', 356, 16.0, 49, 3.9),
      this.createData('6 Frozen yoghurt', 159, 6.0, 24, 4.0),
      this.createData('7 Ice cream sandwich', 237, 9.0, 37, 4.3),
      this.createData('8 Eclair', 262, 16.0, 24, 6.0),
      this.createData('9 Cupcake', 305, 3.7, 67, 4.3),
      this.createData('10 Gingerbread', 356, 16.0, 49, 3.9),
      this.createData('11 Frozen yoghurt', 159, 6.0, 24, 4.0),
      this.createData('12 Ice cream sandwich', 237, 9.0, 37, 4.3),
      this.createData('13 Eclair', 262, 16.0, 24, 6.0),
      this.createData('14 Cupcake', 305, 3.7, 67, 4.3),
      this.createData('15 Gingerbread', 356, 16.0, 49, 3.9),
    ];

    this.setState({
      data: rows
    })
  }

  createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
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
    const that = this;
    httpDelete(constants.API_URL_FAQ + '/' + this.props.match.params.tenant + '/' + this.state.id,
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

  onChangePage = (pageNo: number, rowsPerPage: number) => {
      this.setState({
          pageNo: pageNo,
          rowsPerPage: rowsPerPage
      });
  }

  render() {
    let view: any[] = [];
    if (this.state.faq) {
      view = this.state.faq.slice((this.state.pageNo - 1) * this.state.rowsPerPage, this.state.pageNo * this.state.rowsPerPage);
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
          <div><OakSelect label="Category" data={this.state} id="category" handleChange={e => this.handleChange(e)} elements={this.state.existingCategories} firstAction="<create new>" /></div>
          <div>
            {this.state.category === '<create new>' && <OakText label="Category name" data={this.state} id="newCategory" handleChange={e => this.handleChange(e)} />}
          </div>
            
            <OakText label="Question" data={this.state} id="question" handleChange={e => this.handleChange(e)} />
            <OakText label="Answer" data={this.state} id="answer" handleChange={e => this.handleChange(e)} />
          </div>
          <div className="dialog-footer">
            <button onClick={this.toggleEditDialog} className="default animate in right align-left"><i className="material-icons">close</i>Cancel</button>
            <button onClick={this.addFaq} className="primary animate out right align-right"><i className="material-icons">double_arrow</i>{this.state.editDialogLabel}</button>
          </div>
        </OakDialog>
        
      {this.state.isDeleteDialogOpen}
        {/* <OakDialog small visible={this.state.isDeleteDialogOpen} toggleVisibility={this.toggleDeleteDialog}>
          <div className="dialog-body">
            Are you sure you want to continue?
            </div>
          <div className="dialog-footer">
            <button onClick={this.toggleDeleteDialog} className="default animate in right align-left"><i className="material-icons">close</i>Cancel</button>
            <button onClick={this.deleteFaq} className="primary animate out right align-right"><i className="material-icons">double_arrow</i>{this.state.editDialogLabel}</button>
          </div>
        </OakDialog> */}
        <OakPrompt action={this.deleteFaq} visible={this.state.isDeleteDialogOpen} toggleVisibility={this.toggleDeleteDialog} />

        <ViewResolver sideLabel='More options'>
            <View main>
            {listview}
            <OakPagination totalRows={this.state.faq.length} onChangePage={this.onChangePage} label="Items per page" />
            {/* Temporary for illustration */}
            <OakTable material data={this.state.data} header={[{key: "name", label:"Name"},
                                                      {key: "calories", label:"Calories", dtype: 'string'},
                                                      {key: "fat", label:"Fat", dtype: 'number'},
                                                      {key: "carbs", label:"Carbohydrates"},
                                                      {key: "protein", label:"Protein"}]}/>
            {/* Temporary for illustration */}
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