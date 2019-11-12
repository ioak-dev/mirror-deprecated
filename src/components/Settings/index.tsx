import React, { Component } from 'react';
import './style.scss';
import { receiveMessage, sendMessage } from '../../events/MessageService';
import ArcText from '../Ux/ArcText';

interface Props {
    match: any,
    setProfile: Function,
    profile: any
}

interface State { 
  name: string,
  email: string,
  jwtPassword:string,
  banner: any,
  errorFields: {
    name: boolean,
    email: boolean,
    jwtPassword:boolean
  }
}

class Settings extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
          name: '',
          email: '',
          jwtPassword:'',
          banner: null,
          errorFields: {
            name: false,
            email: false,
            jwtPassword: false
          }
        }
    }

    handleImageChange = (e) => {
      this.setState({
        banner: e.target.files[0]
      })
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

    render() {
        return (
            <div className="tenant boxed">
                <div className="typography-3 space-bottom-2">Tenant Profile</div>
                <div className="form">
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
                </div>
            </div>
        );
    }
}

export default Settings;