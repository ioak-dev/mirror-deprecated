import React from 'react';
import './style.scss';
import ArcText from '../Ux/ArcText';
import { sendMessage } from '../../events/MessageService';

interface Props {

}
interface State {
  name: string,
  email: string,
  pageNo: number,
  password: string,
  repeatPassword: string
}
export default class Tenant extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      pageNo: 1
    }
  }
  
  handleChange = (event) => {
      this.setState(
          {
              ...this.state,
              [event.currentTarget.name]: event.currentTarget.value
          }
      )
  }

  createTenant = () => {
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))) {
      sendMessage('notification', true, {type: 'failure', message: 'Email ID is invalid', duration: 3000});
      return;
    } else {
      // tenant creation service call goes here
      // on successful creation status code, move to second page
      this.setState({pageNo: this.state.pageNo+1})
    }
  }

  createAdministrator = () => {
    // user account creation with email and password
    // signup flow
  }

  render() {
    return (
      <div className="tenant">
        Tenant creation
        {this.state.pageNo === 1 && <div className="form">
          <ArcText id="name" data={this.state} label="Tenant Name"  handleChange={e => this.handleChange(e)}></ArcText>
          <ArcText id="email" data={this.state} label="Email"  handleChange={e => this.handleChange(e)}></ArcText>
          <button className="primary invert animate" onClick={this.createTenant}>Next</button>
        </div>}
        {this.state.pageNo === 2 && <div className="form">
          <ArcText id="password" data={this.state} label="Repeat Password"  handleChange={e => this.handleChange(e)}></ArcText>
          <ArcText id="repeatPassword" data={this.state} label="Password"  handleChange={e => this.handleChange(e)}></ArcText>
          <button className="primary invert animate" onClick={this.createAdministrator}>Create Tenant</button>
        </div>}
      </div>
    );
  }
}