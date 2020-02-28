import React, { useState, useEffect } from 'react'
import OakTable from '../../oakui/OakTable';
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import ViewResolver from '../../oakui/ViewResolver';
import View from '../../oakui/View';
import { httpGet, httpPut } from '../Lib/RestTemplate';
import { constants } from '../Constants';
import { sendMessage } from '../../events/MessageService';
import UserAdministrationView from './view';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';

interface Props{
    match: any,
    setProfile: Function,
    profile: any,
    authorization: Authorization,
    logout: Function
}

const UserAdministration = (props: Props) => {
    const [paginationPref, setPaginationPref] = useState({
        pageNo: 1,
        rowsPerPage: 6
    });
    const [data, setData] = useState({
        searchCriteria: ''
    })
    const [items, setItems] = useState<undefined | any[]>([{}]);
    const [view, setView] = useState<undefined | any[]>([{}]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [stages, setStages] = useState([]);
    const [selectedUser, setSelectedUser] = useState<null | {}>(null);

    useEffect(() => {
        if(props.authorization.isAuth) {
            initializeRequest(props.authorization)
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
        initializeRequest(props.authorization)
    }
    }, [props.authorization.isAuth]);

    const openUser = (user) => {
        setSelectedUser(user);
        setDialogOpen(true);
    }

    const initializeRequest = (authorization) => {
        
        httpGet(constants.API_URL_USER + '/' + 
        props.match.params.tenant + "/all",
        {
            headers:{
                Authorization: props.authorization.token
            }
        })
        .then((response) => {
            let list: any[] = [];
            response.data.data.forEach((item) => {
                list.push({
                    ...item, 
                    action: 
                    <>
                        <OakButton theme="primary" variant="block" align="left" action={() => openUser(item)} icon="open_in_new"></OakButton>
                        {item.status === 'resolved' && 
                            <OakButton theme="default" variant="block" align="right" action=""><i className="material-icons">archive</i></OakButton>}
                    </>
                })
            })
            setItems(list);
            setView(list);
        })
        
    }

    const closeAllDialog = () => {
        setSelectedUser(null);
        setDialogOpen(false);
    }

    const saveUser = (user, edit=false) => {
        
        if (!user) {
            sendMessage('notification', true, {type: 'failure', message: 'Unknown error', duration: 5000});
            return;
        }
        
        if (user.roles.length == 0) {
            sendMessage('notification', true, {type: 'failure', message: 'No Roles selected', duration: 5000});
            return;
        } 
        httpPut(constants.API_URL_USER + '/' + 
        props.match.params.tenant + '/',
        user,
        {
          headers: {
            Authorization: props.authorization.token
          }
        })
        .then(function(response) {
            if (response.status === 200) {
                if (edit) {
                    sendMessage('notification', true, {type: 'success', message: 'Request edited', duration: 5000});
                    closeAllDialog();
                } else {
                    sendMessage('notification', true, {type: 'success', message: 'Request created', duration: 5000});
                    closeAllDialog();
                }
                closeAllDialog();
                initializeRequest(props.authorization);
            }
            
        })
        .catch((error) => {
            if (error.response.status === 401) {
                props.logout(null, 'failure', 'Session expired. Login again');
            }
        })
    }

    const find = (event) => {
      setView(items?.filter((item) => (
        item.email.toLowerCase().indexOf(event.target.value) !== -1
      )));
      setData({...data, searchCriteria: event.target.value});
    }

    return (
        <div className="user-administration boxed">
            <UserAdministrationView {...props} isDialogOpen={dialogOpen} toggleDialog={() => setDialogOpen(!dialogOpen)} saveUser={saveUser} user = {selectedUser} stages={stages} />
            <ViewResolver sideLabel='More options'>
                <View main>
                    <div className="search-bar">
                    <div></div>
                    <div><OakText label="Search" data={data} handleChange={find} id="searchCriteria" /></div>
                    <div className="clear"><OakButton theme="default" variant="block" icon="clear"></OakButton></div>
                    </div>
                    <OakTable material
                    data={view} header={[
                            {key:"_id", label:"User Id"},
                            {key:"title", label:"Full Name"},
                            {key:"email", label:"Email"},
                            {key:"status", label:"Status"},
                            {key:"roles", label:"Roles"},
                            {key:"action", label:"Action"}]} />
                </View>
            </ViewResolver> 
        </div>
    )
}

export default UserAdministration;
