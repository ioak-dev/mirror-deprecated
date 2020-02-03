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
    searchCriteria: string
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
            searchCriteria: ''
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
            selectedUser: user
        })
    }

    initializeRequest(authorization) {
        const that = this;
        
        httpGet(constants.API_URL_SR + '/' + 
        this.props.match.params.tenant + '/main',
        {
            headers:{
                Authorization: this.props.authorization.token
            }
        })
        .then((response) => {
            let list: any[] = [];
            response.data.data.forEach((item) => {
                if (item.status === 'assigned') {
                    item.status = <div className="tag-2"><span>{'Assigned_to_' + item.stage}</span></div>
                } else if (item.status === 'progress') {
                    item.status = <div className="tag-4"><span>{'In_progress_with ' + item.stage}</span></div>
                } else if (item.status === 'resolved') {
                    item.status = <div className="tag-5"><span>Resolved</span></div>
                }

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

    toggleEditDialog = () => {
        this.setState({
            isEditDialogOpen: !this.state.isEditDialogOpen,
            selectedUser: undefined
        })
    }

    saveRequestEvent = () => {
        let stage = [...this.state.stages]
        this.saveRequest({
            priority: 'Low',
            stage: stage[0]["name"],
            status:'assigned'
        })
        this.toggleEditDialog()
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

    addLog = (log) => {
        const that = this;
        if (isEmptyOrSpaces(log.comments[0])) {
            sendMessage('notification', true, {type: 'failure', message: 'Nothing to add', duration: 5000});
            return;
        }
        
        httpPut(constants.API_URL_SR + '/' + 
        this.props.match.params.tenant + '/log' +'/' + log.id,
        {
            request_id:log.id,
            comments: log.comments
        },
        {
          headers: {
            Authorization: this.props.authorization.token
          }
        })
        .then(function(response) {
            if (response.status === 200) {
                sendMessage('notification', true, {type: 'success', message: 'Comments Added  Successfully', duration: 5000});
                that.closeAllDialog();
            }
            that.closeAllDialog();
            that.initializeRequest(that.props.authorization);
             
        })
        .catch((error) => {
            if (error.response.status === 401) {
                that.props.logout(null, 'failure', 'Session expired. Login again');
            }
        })
    }

    saveRequest = (request, edit=false) => {
        const that = this;
        if (!request) {
            sendMessage('notification', true, {type: 'failure', message: 'Unknown error', duration: 5000});
            return;
        }
        
        if (isEmptyOrSpaces(request.title)) {
            sendMessage('notification', true, {type: 'failure', message: 'Title is missing', duration: 5000});
            return;
        }
    
        if (isEmptyOrSpaces(request.description)) {
            sendMessage('notification', true, {type: 'failure', message: 'Description is missing', duration: 5000});
            return;
        }

        httpPut(constants.API_URL_SR + '/' + 
        this.props.match.params.tenant + '/main',
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
        item.title.toLowerCase().indexOf(event.target.value) !== -1 ||
        item.description.toLowerCase().indexOf(event.target.value) !== -1
      ));
      this.setState({dataview: dataview, searchCriteria: event.target.value})
    }

    render() {
        return (
            <div className="user-administration boxed">
                <UserAdministrationView {...this.props} saveRequest={this.saveRequest} addLog={this.addLog} request = {this.state.selectedUser} stages={this.state.stages} />
                <ViewResolver sideLabel='More options'>
                    <View main>
                      <div className="search-bar">
                        <div><OakText label="Search" data={this.state} handleChange={this.find} id="searchCriteria" /></div>
                        <div className="clear"><OakButton theme="default" variant="block" icon="clear"></OakButton></div>
                      </div>
                        <OakTable material
                        data={this.state.dataview} header={[
                                {key:"_id", label:"User Id"},
                                {key:"title", label:"Full Name"},
                                {key:"description", label:"Email"},
                                {key:"status", label:"Status"},
                                {key:"category", label:"Roles"},
                                {key:"action", label:"Action"}]} >
                        </OakTable>                    
                    </View>
                </ViewResolver>
                               
            </div>
        )
    }
}
