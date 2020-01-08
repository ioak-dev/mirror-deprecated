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
import OakTextField from '../Ux/OakTextField';
import { isEmptyOrSpaces } from '../Utils';
import { sendMessage } from '../../events/MessageService';

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
    description: string
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
        .then(function(response){
            that.setState({
                data:response.data.data,
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
            editDialogLabel: 'Add'
        })
    }

    addRequest = () => {
        const that = this;
        let request = {
            title: this.state.title,
            description: this.state.description,
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
                sendMessage('notification', true, {type: 'success', message: 'Request created', duration: 5000});
                that.toggleEditDialog();
    
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
                        <OakTextField label="Title" data={this.state} id="title" handleChange={e => this.handleChange(e)} />
                        <OakTextField label="Description" data={this.state} id="description" handleChange={e => this.handleChange(e)} />
                    </div>
                    <div className="dialog-footer">
                        <button onClick={this.toggleEditDialog} className="default animate in right align-left"><i className="material-icons">close</i>Cancel</button>
                        <button onClick={this.addRequest} className="primary animate out right align-right"><i className="material-icons">double_arrow</i>{this.state.editDialogLabel}</button>
                    </div>
                </OakDialog>
                <ViewResolver sideLabel='More options'>
                    <View main>
                        <OakTable material
                        data={this.state.data} header={[{key:"requestNo", label:"Request Number"},
                                {key:"title", label:"Title"},
                                {key:"description", label:"Description"},
                                {key:"status", label:"Status"},
                                {key:"category", label:"Category"},
                                {key:"createDate", label:"Create Date"},
                                {key:"updateDate", label:"Update Date "}]} >
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