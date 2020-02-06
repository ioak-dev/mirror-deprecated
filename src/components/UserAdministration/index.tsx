import React, { Component } from 'react'
import OakTable from '../Ux/OakTable';
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import ViewResolver from '../Ux/ViewResolver';
import View from '../Ux/View';
import Sidebar from '../Ux/Sidebar';
import { httpGet, httpPut } from '../Lib/RestTemplate';
import { constants } from '../Constants';
import OakDialog from '../Ux/OakDialog';
import { isEmptyOrSpaces } from '../Utils';
import { sendMessage } from '../../events/MessageService';
import UserAdministrationView from './view';
import OakText from '../Ux/OakText';
import OakButton from '../Ux/OakButton';


interface Props{
    match: any,
    setProfile: Function,
    profile: any,
    authorization: Authorization,
    logout: Function
}

interface State{
    data?: any,
    dataview?: any,
    isEditDialogOpen:boolean,
    pageNo: number,
    rowsPerPage: number,
    selectedUser: any,
    stages: any,
    searchCriteria: string,
    isDialogOpen: boolean
}

export default class UserAdministration extends Component<Props, State> {
    constructor(props){
        super(props)
        this.state = {
            data: [],
            dataview: [],
            pageNo: 1,
            rowsPerPage: 6,
            isEditDialogOpen: false,
            selectedUser: undefined,
            stages: [],
            searchCriteria: '',
            isDialogOpen: false
        }
    }
    componentDidMount(){
        if(this.props.authorization.isAuth){
          this.initializeRequest(this.props.authorization)
        }
    
        this.props.setProfile({
          ...this.props.profile,
          tenant: this.props.match.params.tenant
        })

        httpGet(constants.API_URL_STAGE + '/' + this.props.match.params.tenant + '/', 
            {headers: {
                Authorization: this.props.authorization.token
            }}
            ).then ((response) => {
                this.setState({
                    stages: response.data.stage
                })
            }).catch((error) => {
                console.log(error);
            })
    
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.authorization){
          this.initializeRequest(this.props.authorization)
        }
      }

    openUser = (user) => {
        this.setState({
            selectedUser: user,
            isDialogOpen: true
        })
    }

    initializeRequest(authorization) {
        const that = this;
        
        httpGet(constants.API_URL_USER + '/' + 
        this.props.match.params.tenant,
        {
            headers:{
                Authorization: this.props.authorization.token
            }
        })
        .then((response) => {
            let list: any[] = [];
            response.data.data.forEach((item) => {
                list.push({
                    ...item, 
                    action: 
                    <>
                        <OakButton theme="primary" variant="block" align="left" action={() => this.openUser(item)} icon="open_in_new"></OakButton>
                        {item.status === 'resolved' && 
                            <OakButton theme="default" variant="block" align="right" action=""><i className="material-icons">archive</i></OakButton>}
                    </>
                })
            })
            this.setState({
                data: list,
                dataview: list
            });
        })
        
    }

    saveRequestEvent = () => {
        let stage = [...this.state.stages]
        this.saveRequest({
            priority: 'Low',
            stage: stage[0]["name"],
            status:'assigned'
        })
    }
    
    clearRequest = () => {
        this.setState({
        })
    }

    closeAllDialog = () => {
        this.setState({
            isEditDialogOpen:false,
            selectedUser:undefined
        })
        this.clearRequest()
    }

    toggleDialog = () => {
        this.setState({isDialogOpen: !this.state.isDialogOpen});
    }

    saveRequest = (request, edit=false) => {
        const that = this;
        
        if (!request) {
            sendMessage('notification', true, {type: 'failure', message: 'Unknown error', duration: 5000});
            return;
        }
        
        if (request.roles.length == 0) {
            sendMessage('notification', true, {type: 'failure', message: 'No Roles selected', duration: 5000});
            return;
        } 

        httpPut(constants.API_URL_USER + '/' + 
        this.props.match.params.tenant + '/' + this.state.selectedUser._id,
        request,
        {
          headers: {
            Authorization: this.props.authorization.token
          }
        })
        .then(function(response) {
            if (response.status === 200) {
                if (edit) {
                    sendMessage('notification', true, {type: 'success', message: 'Request edited', duration: 5000});
                    that.closeAllDialog();
                } else {
                    sendMessage('notification', true, {type: 'success', message: 'Request created', duration: 5000});
                    that.closeAllDialog();
                }
                that.closeAllDialog();
                that.initializeRequest(that.props.authorization);
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

    find = (event) => {
      const dataview = this.state.data.filter((item) => (
        // item.name.toLowerCase().indexOf(event.target.value) !== -1 ||
        item.email.toLowerCase().indexOf(event.target.value) !== -1
      ));
      this.setState({dataview: dataview, searchCriteria: event.target.value})
    }

    render() {
        return (
            <div className="user-administration boxed">
                <UserAdministrationView {...this.props} isDialogOpen={this.state.isDialogOpen} toggleDialog={this.toggleDialog} saveRequest={this.saveRequest} user = {this.state.selectedUser} stages={this.state.stages} />
                <ViewResolver sideLabel='More options'>
                    <View main>
                      <div className="search-bar">
                        <div></div>
                        <div><OakText label="Search" data={this.state} handleChange={this.find} id="searchCriteria" /></div>
                        <div className="clear"><OakButton theme="default" variant="block" icon="clear"></OakButton></div>
                      </div>
                        <OakTable material
                        data={this.state.dataview} header={[
                                {key:"_id", label:"User Id"},
                                {key:"title", label:"Full Name"},
                                {key:"email", label:"Email"},
                                {key:"status", label:"Status"},
                                {key:"roles", label:"Roles"},
                                {key:"action", label:"Action"}]} >
                        </OakTable>                    
                    </View>
                </ViewResolver>
                               
            </div>
        )
    }
}
