import React from 'react';
import './style.scss';
import ArcText from '../Ux/ArcText';
import { sendMessage } from '../../events/MessageService';
import { createTenant, sentTenantUrl } from './TenantService'
import {preSignup, signup} from '../Auth/AuthService'
import { Authorization, Profile } from '../Types/GeneralTypes';
import { isEmptyOrSpaces } from '../Utils';

interface Props {
  getProfile: Function,
  profile: Profile,
  history: any
}
interface State {
  name: string,
  email: string,
  pageNo: number,
  password: string,
  repeatPassword: string,
  created: boolean,
  errorFields: {
    name: boolean,
    email: boolean,
    password: boolean,
    repeatPassword: boolean
  }
}
export default class Tenant extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.props.getProfile();
    this.state = {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      pageNo: 1,
      created: false,
      errorFields: {
        name: false,
        email: false,
        password: false,
        repeatPassword: false
      }
    }
  }
  
  success = (data) => {
    this.setState({created: true});
  }
  

  handleChange = (event) => {
      this.setState(
          {
              ...this.state,
              [event.currentTarget.name]: event.currentTarget.value,
              errorFields: {
                ...this.state.errorFields,
                [event.currentTarget.name]: false
              }
          }
      )
  }

  sentTenantUrl =() =>{
    sentTenantUrl({
      name: this.state.name,
      })
      .then((response: any) => {
          if (response === 200) {
            sendMessage('notification', true, {message: 'Password sent successfully', type: 'success', duration: 3000});
          } else {
            sendMessage('notification', true, {'type': 'failure', message: 'Invalid Email error', duration: 3000});
          }
      })
      .catch((error) => {
          sendMessage('notification', true, {'type': 'failure', message: 'Bad request', duration: 3000});
      })
  }

  clearError() {
    this.setState({
      errorFields: {
        name: false,
        email: false,
        password: false,
        repeatPassword: false
      }
    })
  }

  setError(fieldName) {
    this.setState({
      errorFields: {
        ...this.state.errorFields,
        [fieldName]: true
      }
    })
  }

  createTenant = (event) => {
    event.preventDefault();
    sendMessage('spinner');
    const that = this;
    this.clearError();
    if (isEmptyOrSpaces(this.state.name)) {
      this.setError('name');
      sendMessage('notification', true, {type: 'failure', message: 'Tenant name cannot be empty', duration: 3000});
      return;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))) {
      this.setError('email');
      sendMessage('notification', true, {type: 'failure', message: 'Email ID is invalid', duration: 3000});
      return;
    } 
    
    if (isEmptyOrSpaces(this.state.password)){
      this.setError('password');
      sendMessage('notification', true, {'type': 'failure', message: 'Password cannot be empty', duration: 3000});
      return;
    }

    if (this.state.password != this.state.repeatPassword){
      this.setError('repeatPassword');
      sendMessage('notification', true, {'type': 'failure', message: 'Password and repeat password should be same', duration: 3000});
      return;
    }
    // tenant creation service call 
    preSignup({name:that.state.name}).then(function(response) {
      if (response.status === 200) {
        createTenant({
        name: that.state.name,
        email: that.state.email,
        })
        .then(function(response) {
            if (response.status === 200) {
                sendMessage('notification', true, {'type': 'success', message: 'Tenant has been created. You can proceed now', duration: 3000});
                that.setState({pageNo: that.state.pageNo+1})
            } else if (response.status===401){
              sendMessage('notification', true, {message: 'You are not authorised to create tenant', duration: 3000});
              return 
            } else if (response.status===405){
              sendMessage('notification', true, {message: 'You are not authorised to create tenant', duration: 3000});
              return 
            } else if (response.status===415){
              sendMessage('notification', true, {message: 'Wrong data sent for tenant creation', duration: 3000});
              return 
            } else if (response.status===500){
              sendMessage('notification', true, {message: 'We are facing some problem, please try after sometime', duration: 3000});
              that.setState({
                name:'',
                email:''
              })
              return 
              
            } else if (response.status===404){
              sendMessage('notification', true, {message: 'Problem with Tenant creation. Please contact support team', duration: 3000});
              return 
            }
        }).catch((error)=>{
          sendMessage('notification', true, {'type': 'failure', message: 'Unknown error. Please try again or at a later time', duration: 3000});
          that.setState({
            name:'',
            email:''
          })
      });

      signup({
        name:that.state.name,
        password: that.state.password,
        email: that.state.email,
        solution: response.data.solution,
        salt: response.data.salt
        })
        .then(function(status) {
          if (status === 200) {
              sendMessage('notification', true, {'type': 'success', message: 'Tenant [' + that.state.name + '] has been setup successfully', duration: 6000});
              that.success(response.data);
          }
        })
      }
    });
  }

  gotoTenantPage = () => {
    this.props.history.push("/" + this.state.name + "/home");
  }

  createAdministrator = () => {
    // user account creation with email and password
    // signup flow
  }

  render() {
    return (
      <div className="tenant boxed">
        {!this.state.created && <div className="typography-3 space-bottom-4">Tenant creation</div>}
        {this.state.created && <div className="typography-3 space-bottom-4">Tenant [{this.state.name}] available now</div>}
        {this.state.pageNo === 1 && <div className="form">
          <ArcText id="name" data={this.state} label="Tenant Name"  handleChange={e => this.handleChange(e)} errorFields={this.state.errorFields}></ArcText>
          <ArcText id="email" data={this.state} label="Administrator Email"  handleChange={e => this.handleChange(e)} errorFields={this.state.errorFields}></ArcText>
          <ArcText id="password" type="password" data={this.state} label="Administrator Password"  handleChange={e => this.handleChange(e)} errorFields={this.state.errorFields}></ArcText>
          <ArcText id="repeatPassword" type="password" data={this.state} label="Repeat Password"  handleChange={e => this.handleChange(e)} errorFields={this.state.errorFields}></ArcText>
          <button className="primary alt animate" onClick={this.createTenant}>Next</button>
        </div>}
        {this.state.created && <button className="primary alt block" onClick={this.gotoTenantPage}>Take me to my tenant</button>}
      </div>
    );
  }
}