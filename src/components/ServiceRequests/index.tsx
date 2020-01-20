import React, { Component } from 'react'
import OakTable from '../Ux/OakTable';
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import ViewResolver from '../Ux/ViewResolver';
import View from '../Ux/View';
import Sidebar from '../Ux/Sidebar';
import { httpGet, httpDelete, httpPost, httpPut } from '../Lib/RestTemplate';
import { constants } from '../Constants';
import OakDialog from '../Ux/OakDialog';
import { isEmptyOrSpaces } from '../Utils';
import { sendMessage } from '../../events/MessageService';
import ServiceRequestView from './view';
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
    sidebarElements: any,
    isEditDialogOpen:boolean,
    editDialogLabel: string,
    pageNo: number,
    rowsPerPage: number,
    title: string,
    description: string,
    selectedRequest: any,
    stages: any
    
}

export default class ServiceRequests extends Component<Props, State> {
    constructor(props){
        super(props)
        this.state = {
            data: [],
            pageNo: 1,
            rowsPerPage: 6,
            isEditDialogOpen: false,
            editDialogLabel: 'Service Request',
            title:'',
            description:'',
            selectedRequest: undefined,
            stages: [],
            

            sidebarElements: {
                serviceRequest: [
                    {
                        label: 'New Request',
                        action: this.toggleEditDialog,
                        icon: 'add'
                    }
                ]
            }
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

    openRequest = (request) => {
        this.setState({
            selectedRequest: request
        })
    }

    initializeRequest(authorization) {
        const that = this;
        httpGet(constants.API_URL_SR + '/' + 
        this.props.match.params.tenant + '/',
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
                        <OakButton theme="primary" variant="block" align="left" action={() => this.openRequest(item)} icon="open_in_new"></OakButton>
                        {item.status === 'resolved' && 
                            <OakButton theme="default" variant="block" align="right" action=""><i className="material-icons">archive</i></OakButton>}
                    </>
                })
            })
            this.setState({
                data: list
            });
        })
        
    }

    // onChangePage = (pageNo: number, rowsPerPage: number) => {
    //     this.setState({
    //         pageNo: this.state.pageNo,
    //         rowsPerPage: this.state.rowsPerPage
    //     })
    //     const that = this;
    //     httpGet(constants.API_URL_SR + '/' + 
    //     this.props.match.params.tenant + '/',
    //     {
    //         headers:{
    //             Authorization: this.props.authorization.token
    //         }
    //     })
    //     .then(function(response){
    //         that.setState({
    //             data:response.data.data,
    //         });
    //     })
    //     console.log(pageNo, rowsPerPage);
    // }

    toggleEditDialog = () => {
        this.setState({
            isEditDialogOpen: !this.state.isEditDialogOpen,
            editDialogLabel: 'Create Service Request',
            selectedRequest: undefined
        })
    }

    saveRequestEvent = () =>{
        this.saveRequest({
            title: this.state.title,
            description: this.state.description,
            priority: 'Low',
            createDate: new Date().toLocaleString(),
            updateDate: new Date().toLocaleString(),
            comments:[
                {
                    name: this.props.match.params.tenant,
                    date: new Date().toLocaleString(),
                    comment: "Opened Service Request"
             }]
        })
    }

    closeAllDialog = () =>{
        this.setState({
            isEditDialogOpen:false,
            selectedRequest:undefined
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
        this.props.match.params.tenant + '/',
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
                    sendMessage('closeNoteEditView', true);
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

    render() {
        return (
            <div className="requests">
                <OakDialog visible={this.state.isEditDialogOpen} toggleVisibility={this.toggleEditDialog}>
                    <div className="dialog-body">
                        <OakText label="Title" data={this.state} id="title" handleChange={e => this.handleChange(e)} />
                        <OakText label="Description" data={this.state} id="description" handleChange={e => this.handleChange(e)} />
                    </div>
                    <div className="dialog-footer">
                        <OakButton action={this.toggleEditDialog} theme="default" variant="animate in" align="left"><i className="material-icons">close</i>Cancel</OakButton>
                        <OakButton action={this.saveRequestEvent} theme="primary" variant="animate out" align="right"><i className="material-icons">double_arrow</i>{this.state.editDialogLabel}</OakButton>
                    </div>
                </OakDialog>
                <ServiceRequestView {...this.props} saveRequest={this.saveRequest} request = {this.state.selectedRequest} stages={this.state.stages} />
                <ViewResolver sideLabel='More options'>
                    <View main>
                        <OakTable material
                        data={this.state.data} header={[
                                {key:"_id", label:"Request Number"},
                                {key:"title", label:"Title"},
                                {key:"description", label:"Description"},
                                {key:"status", label:"Status"},
                                {key:"category", label:"Category"},
                                {key:"priority", label:"Priority"},
                                {key:"createDate", label:"Opened On", dtype: "date"},
                                {key:"action", label:"Action"}]} >
                        </OakTable>                    
                    </View>
                    <View side>
                        <div className="filter-container">
                            <div className="section-main">
                                <Sidebar label="ServiceRequest" elements={this.state.sidebarElements['serviceRequest']} icon="add" animate />
                                <Sidebar label="Search" elements={this.state.sidebarElements['search']} icon="search" animate>
                                    Search content goes here
                                </Sidebar>
                            </div>
                        </div>
                    </View>
                </ViewResolver>
                               
            </div>
        )
    }
}
