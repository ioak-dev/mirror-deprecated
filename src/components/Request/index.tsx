import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import OakTable from '../../oakui/OakTable';
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import ViewResolver from '../../oakui/ViewResolver';
import View from '../../oakui/View';
import Sidebar from '../../oakui/Sidebar';
import { httpGet, httpPut } from '../Lib/RestTemplate';
import { constants } from '../Constants';
import OakDialog from '../../oakui/OakDialog';
import { isEmptyOrSpaces } from '../Utils';
import { sendMessage, receiveMessage } from '../../events/MessageService';
import ServiceRequestView from './view';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';
import { fetchRequest, saveRequest, deleteRequest } from '../../actions/RequestActions';

interface Props{
    match: any,
    setProfile: Function,
    profile: any,
    authorization: Authorization,
    logout: Function,
    user: any,
    request: any,
    fetchRequest: Function,
    saveRequest: Function,
    deleteRequest: Function
}

const domain = "servicerequests";

const Request = (props: Props) => {
    const sidebarElements = {
        serviceRequest: [
            {
                label: 'New Request',
                action: () => toggleNewDialog(),
                icon: 'add'
            }
        ]
    };
    const emptyRequest = {title: '', description: '', priority: 'Low', status:'assigned'};

    const [newDialogOpen, setNewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState({});
    const [data, setData] = useState(emptyRequest);
    const [view, setView] = useState([{}]);
    const [stages, setStages] = useState([]);

    useEffect(() => {
        const eventBus = receiveMessage().subscribe(message => {
          if (message.name === domain && message.signal) {
            sendMessage('notification', true, {
              type: 'success',
              message: `${domain} ${message.data.action}`,
              duration: 5000,
            });
            if (message.data.action === 'created') {
              setNewDialogOpen(false);
            } else if (message.data.action === 'updated') {
              setEditDialogOpen(false);
            }
          }
        });
        return () => eventBus.unsubscribe();
      });

    useEffect(() => {
        if(props.authorization.isAuth) {
            props.fetchRequest(props.match.params.tenant, props.authorization);
        }
    
        props.setProfile({...props.profile, tenant: props.match.params.tenant});

        httpGet(constants.API_URL_STAGE + '/' + props.match.params.tenant + '/', 
            {headers: {
                Authorization: props.authorization.token
            }}
            ).then ((response) => {
                setStages(response.data.stage);
            }).catch((error) => {
                console.log(error);
            }
        );
    }, []);
  
    useEffect(() => {
      if(props.authorization.isAuth){
        props.fetchRequest(props.match.params.tenant, props.authorization);
      }
    }, [props.authorization.isAuth]);

    useEffect(() => {
        let list: any[] = [];
        props.request.items.forEach((item) => {
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
                    <OakButton theme="primary" variant="block" align="left" action={() => openEditDialog(item)} icon="open_in_new"></OakButton>
                    {item.status === 'resolved' && 
                        <OakButton theme="default" variant="block" align="right" action=""><i className="material-icons">archive</i></OakButton>}
                </>
            })
        })
        setView(list);
    }, [props.request.items]);

    const toggleNewDialog = () => {
        setNewDialogOpen(!newDialogOpen);
        setSelectedRequest(emptyRequest);
    }

    const toggleEditDialog = () => {
        setEditDialogOpen(!editDialogOpen);
    }

    const openEditDialog = (requestInput) => {
        setEditDialogOpen(true);
        setSelectedRequest(requestInput);
    }

    const saveRequest = (request, edit=false) => {
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
        const requestAToSave = edit ? request : {...request, stage: stages[0]["name"]};
        props.saveRequest(props.match.params.tenant, props.authorization, requestAToSave);
        setSelectedRequest(requestAToSave);
    }

    const handleChange = (event) => {
        setData({...data, [event.target.name]: event.target.value});
    }

    return (
        <div className="requests">
            <OakDialog visible={newDialogOpen} toggleVisibility={() => toggleNewDialog()}>
                <div className="dialog-body">
                    <OakText label="Title" data={data} id="title" handleChange={e => handleChange(e)} />
                    <OakText label="Description" data={data} id="description" handleChange={e => handleChange(e)} />
                </div>
                <div className="dialog-footer">
                    <OakButton action={() => toggleNewDialog()} theme="default" variant="animate in" align="left"><i className="material-icons">close</i>Cancel</OakButton>
                    <OakButton action={() => saveRequest({...emptyRequest, title: data.title, description: data.description}, false)} theme="primary" variant="animate out" align="right"><i className="material-icons">double_arrow</i>Save</OakButton>
                </div>
            </OakDialog>
            <ServiceRequestView {...props} editDialogOpen={editDialogOpen} toggleEditDialog={toggleEditDialog} saveRequest={saveRequest} request = {selectedRequest} stages={stages} />
            <ViewResolver sideLabel='More options'>
                <View main>
                    <OakTable material
                    data={view} header={[
                            {key:"_id", label:"Request Number"},
                            {key:"title", label:"Title"},
                            {key:"description", label:"Description"},
                            {key:"status", label:"Status"},
                            {key:"category", label:"Category"},
                            {key:"priority", label:"Priority"},
                            {key:"createdAt", label:"Opened On", dtype: "date"},
                            {key:"action", label:"Action"}]} />
                </View>
                <View side>
                    <div className="filter-container">
                        <div className="section-main">
                            <Sidebar label="Service Request" elements={sidebarElements['serviceRequest']} icon="add" animate />
                            <Sidebar label="Search" elements={sidebarElements['search']} icon="search" animate>
                                Search content goes here
                            </Sidebar>
                        </div>
                    </div>
                </View>
            </ViewResolver>
                            
        </div>
    )
}

const mapStateToProps = state => ({
    request: state.request,
  });
  
  export default connect(mapStateToProps, {
    fetchRequest,
    saveRequest,
    deleteRequest
  })(Request);
  