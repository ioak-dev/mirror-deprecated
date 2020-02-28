import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import OakTable from '../../oakui/OakTable';
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import ViewResolver from '../../oakui/ViewResolver';
import View from '../../oakui/View';
import { sendMessage, receiveMessage } from '../../events/MessageService';
import UserAdministrationView from './view';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';
import { fetchAllUsers, saveUser } from '../../actions/UserActions';
import { fetchStage } from '../../actions/StageActions';

interface Props{
    match: any,
    setProfile: Function,
    profile: any,
    authorization: Authorization,
    logout: Function,
    user: any,
    fetchAllUsers: Function,
    saveUser: Function,
    stage: any,
    fetchStage: Function
}

const domain = 'user';

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
    const [selectedUser, setSelectedUser] = useState<null | {}>(null);

    useEffect(() => {
        const eventBus = receiveMessage().subscribe(message => {
          if (message.name === domain && message.signal) {
            sendMessage('notification', true, {
              type: 'success',
              message: `${domain} ${message.data.action}`,
              duration: 5000,
            });
          }
        });
        return () => eventBus.unsubscribe();
      });

    useEffect(() => {
        if(props.authorization.isAuth) {
            initializeRequest()
        }
    
        props.setProfile({...props.profile, tenant: props.match.params.tenant});
    }, []);
  
    useEffect(() => {
        if(props.authorization.isAuth){
            initializeRequest()
        }
    }, [props.authorization.isAuth]);

    const openUser = (user) => {
        setSelectedUser(user);
        setDialogOpen(true);
    }

    useEffect(() => {
        let list: any[] = [];
        props.user.users.forEach((item) => {
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
    }, [props.user]);

    const initializeRequest = () => {
        props.fetchAllUsers(props.match.params.tenant, props.authorization);
        props.fetchStage(props.match.params.tenant, props.authorization);
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

        props.saveUser(props.match.params.tenant, props.authorization, user);
    }

    const find = (event) => {
      setView(items?.filter((item) => (
        item.email.toLowerCase().indexOf(event.target.value) !== -1
      )));
      setData({...data, searchCriteria: event.target.value});
    }

    return (
        <div className="user-administration boxed">
            <UserAdministrationView {...props} isDialogOpen={dialogOpen} toggleDialog={() => setDialogOpen(!dialogOpen)} saveUser={saveUser} user = {selectedUser} stages={props.stage.data} />
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

const mapStateToProps = state => ({
    user: state.user,
    stage: state.stage
  });
  
  export default connect(mapStateToProps, {
    fetchAllUsers,
    saveUser,
    fetchStage
  })(UserAdministration);
  