import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import OakTable from '../../oakui/OakTable';
import { Authorization } from '../Types/GeneralTypes';
import './style.scss';
import OakViewResolver from '../../oakui/OakViewResolver';
import OakView from '../../oakui/OakView';
import { sendMessage, receiveMessage } from '../../events/MessageService';
import UserAdministrationView from './view';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';
import { fetchAllUsers, saveUser } from '../../actions/UserActions';
import { fetchStage } from '../../actions/StageActions';

interface Props {
  match: any;
  setProfile: Function;
  profile: any;
  authorization: Authorization;
  logout: Function;
  user: any;
  fetchAllUsers: Function;
  saveUser: Function;
  stage: any;
  fetchStage: Function;
}

const domain = 'user';

const UserAdministration = (props: Props) => {
  const [paginationPref, setPaginationPref] = useState({
    pageNo: 1,
    rowsPerPage: 6,
  });

  const [searchPref, setSearchPref] = useState({ text: '' });
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
    if (props.authorization.isAuth) {
      initializeRequest();
    }

    props.setProfile({ ...props.profile, tenant: props.match.params.tenant });
  }, []);

  useEffect(() => {
    if (props.authorization.isAuth) {
      initializeRequest();
    }
  }, [props.authorization.isAuth]);

  const openUser = user => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  useEffect(() => {
    const list: any[] = [];
    props.user.users.forEach(item => {
      const roleList = findRole(item.roles);
      item.roles = roleList;
      list.push({
        ...item,
        action: (
          <>
            <OakButton
              theme="primary"
              variant="block"
              align="left"
              action={() => openUser(item)}
              icon="open_in_new"
            />
          </>
        ),
      });
    });
    setItems(list);
    setView(list);
  }, [props.user.users]);

  useEffect(() => {
    applySearch();
  }, [searchPref, items]);

  const applySearch = () => {
    const result = searchPref.text
      ? view?.filter(item => item.email.toLowerCase().includes(searchPref.text))
      : items;
    setView(result);
  };

  const findRole = roles => {
    const stageList: any[] = [];
    const roleList: any[] = [];
    let index = 0;
    props.stage?.data.forEach(stageData => {
      stageList.push(stageData.name);
    });
    roles.forEach(item => {
      index = props.stage?.data.findIndex(x => x._id === item);
      roleList.push(index >= 0 ? stageList[index] : item);
    });
    return roleList;
  };

  const initializeRequest = () => {
    props.fetchAllUsers(props.match.params.tenant, props.authorization);
    props.fetchStage(props.match.params.tenant, props.authorization);
  };

  const saveUser = (user, edit = false) => {
    if (!user) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Unknown error',
        duration: 5000,
      });
      return;
    }

    props.saveUser(props.match.params.tenant, props.authorization, user);
  };

  const handleSearchPref = event => {
    setSearchPref({ ...searchPref, [event.target.name]: event.target.value });
  };

  return (
    <div className="user-administration">
      <UserAdministrationView
        {...props}
        isDialogOpen={dialogOpen}
        toggleDialog={() => setDialogOpen(!dialogOpen)}
        saveUser={saveUser}
        user={selectedUser}
        stages={props.stage.data}
      />
      <OakViewResolver>
        <OakView main>
          <div className="search-bar">
            <div />
            <div>
              <OakText
                label="Search"
                data={searchPref}
                handleChange={handleSearchPref}
                id="text"
              />
            </div>
            <div className="clear">
              <OakButton
                action={() => setSearchPref({ ...searchPref, text: '' })}
                theme="default"
                variant="block"
                icon="clear"
              />
            </div>
          </div>
          <OakTable
            material
            data={view}
            header={[
              { key: '_id', label: 'User Id' },
              { key: 'title', label: 'Full Name' },
              { key: 'email', label: 'Email' },
              { key: 'status', label: 'Status' },
              { key: 'roles', label: 'Roles' },
              { key: 'action', label: 'Action' },
            ]}
          />
        </OakView>
      </OakViewResolver>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  stage: state.stage,
});

export default connect(mapStateToProps, {
  fetchAllUsers,
  saveUser,
  fetchStage,
})(UserAdministration);
