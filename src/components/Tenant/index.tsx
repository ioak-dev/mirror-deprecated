import React from 'react';
import './style.scss';
import ArcText from '../Ux/ArcText';
import { sendMessage } from '../../events/MessageService';
import { sentTenantUrl } from './TenantService'
import {preSignup, createTenant } from '../Auth/AuthService'
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
  jwtPassword:string,
  banner: any,
  created: boolean,
  errorFields: {
    name: boolean,
    email: boolean,
    password: boolean,
    repeatPassword: boolean,
    jwtPassword:boolean
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
      jwtPassword:'',
      banner: null,
      pageNo: 1,
      created: false,
      errorFields: {
        name: false,
        email: false,
        password: false,
        repeatPassword: false,
        jwtPassword: false
      }
    }
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
        repeatPassword: false,
        jwtPassword:false
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

  validate() {
    if (isEmptyOrSpaces(this.state.name)) {
      this.setError('name');
      sendMessage('notification', true, {type: 'failure', message: 'Tenant name cannot be empty', duration: 3000});
      return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))) {
      this.setError('email');
      sendMessage('notification', true, {type: 'failure', message: 'Email ID is invalid', duration: 3000});
      return false;
    } 
    
    if (isEmptyOrSpaces(this.state.password)){
      this.setError('password');
      sendMessage('notification', true, {'type': 'failure', message: 'Password cannot be empty', duration: 3000});
      return false;
    }

    if (this.state.password != this.state.repeatPassword){
      this.setError('repeatPassword');
      sendMessage('notification', true, {'type': 'failure', message: 'Password and repeat password should be same', duration: 3000});
      return false;
    }

    return true;
  }

  submit = (event) => {
    event.preventDefault();
    sendMessage('spinner');
    const that = this;
    this.clearError();
    
    if (!this.validate()) {
      return;
    }

    preSignup({name:that.state.name}).then((response) => {
      if (response.status === 200) {
        this.createTenant(response.data);
      }
    });
  }

  handleImageChange = (e) => {
    this.setState({
      banner: e.target.files[0]
    })

    console.log(e.target.files[0]);
  };

  createTenant = (preSignupData) => {
    createTenant({
      tenantName: this.state.name,
      email: this.state.email,
      password: this.state.password,
      jwtPassword:this.state.jwtPassword,
      solution: preSignupData.solution,
      salt: preSignupData.salt,
      banner: this.state.banner
    })
    .then((response) => {
      if (response.status === 200) {
        sendMessage('notification', true, {'type': 'success', message: 'Tenant has been created. You can proceed now', duration: 3000});
        this.setState({pageNo: this.state.pageNo+1, created: true});
      } else {
        sendMessage('notification', true, {message: 'We are facing some problem, please try after sometime', duration: 3000});
        return
      }
    }).catch((error)=>{
      sendMessage('notification', true, {'type': 'failure', message: 'Unknown error. Please try again or at a later time', duration: 3000});
    });
  }

  gotoTenantPage = () => {
    this.props.history.push("/" + this.state.name + "/home");
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
          <ArcText id="jwtPassword" type="password" data={this.state} label="JWT Password"  handleChange={e => this.handleChange(e)} errorFields={this.state.errorFields}></ArcText>
          <label className="file-upload space-top-1 space-bottom-4">
            <input type="file" accept="image/png, image/jpeg" onChange={this.handleImageChange} required/>
            <i className="material-icons">add_photo_alternate</i>
            {!this.state.banner && "Choose Banner/Cover Image"}
            {this.state.banner && this.state.banner.name}
          </label>
          <div className="action">
            <button className="primary animate in right" onClick={this.submit}>Create Tenant</button>
          </div>
        </div>}
        {this.state.created && <button className="primary animate out right" onClick={this.gotoTenantPage}>Take me to my tenant</button>}
      </div>
    );
  }
}