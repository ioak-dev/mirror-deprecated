import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import OakTable from '../../oakui/OakTable';
import { Authorization } from '../Types/GeneralTypes';
import './style.scss';
import OakViewResolver from '../../oakui/OakViewResolver';
import OakView from '../../oakui/OakView';
import OakDialog from '../../oakui/OakDialog';
import { isEmptyOrSpaces } from '../Utils';
import { sendMessage, receiveMessage } from '../../events/MessageService';
import ServiceRequestView from './view';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';
import {
  fetchRequest,
  saveRequest,
  deleteRequest,
} from '../../actions/RequestActions';
import { fetchStage } from '../../actions/StageActions';

interface Props {
  match: any;
  setProfile: Function;
  profile: any;
  authorization: Authorization;
  logout: Function;
  user: any;
  request: any;
  fetchRequest: Function;
  saveRequest: Function;
  deleteRequest: Function;
  stage: any;
  fetchStage: Function;
}

const domain = 'servicerequests';

const Request = (props: Props) => {
  const emptyRequest = {
    title: '',
    description: '',
    priority: 'Low',
    status: 'assigned',
  };

  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState({});
  const [searchPref, setSearchPref] = useState({ text: '' });
  const [items, setItems] = useState<undefined | any[]>([{}]);
  const [data, setData] = useState({
    title: '',
    description: '',
  });
  const [view, setView] = useState<undefined | any[]>([{}]);

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
    if (props.authorization.isAuth) {
      props.fetchRequest(props.match.params.tenant, props.authorization);
    }
    props.fetchStage(props.match.params.tenant, props.authorization);
    props.setProfile({ ...props.profile, tenant: props.match.params.tenant });
  }, []);

  useEffect(() => {
    if (props.authorization.isAuth) {
      props.fetchRequest(props.match.params.tenant, props.authorization);
      props.fetchStage(props.match.params.tenant, props.authorization);
    }
  }, [props.authorization.isAuth]);

  useEffect(() => {
    const stageList = findStage();
    const list: any[] = [];
    props.request.items.forEach(item => {
      if (item.status === 'assigned' && item.stage) {
        const index = props.stage.data.findIndex(x => x._id === item.stage);
        item.statusView = (
          <div className="tag-2">
            <span>{`Assigned_to_${stageList[index]}`}</span>
          </div>
        );
      } else if (item.status === 'assigned' && !item.stage) {
        item.statusView = (
          <div className="tag-4">
            <span>Assigned_to_user</span>
          </div>
        );
      } else if (item.status === 'resolved') {
        item.statusView = (
          <div className="tag-5">
            <span>Resolved</span>
          </div>
        );
      }
      list.push({
        ...item,
        action: (
          <>
            <OakButton
              theme="primary"
              variant="block"
              align="left"
              action={() => openEditDialog(item)}
              icon="open_in_new"
            />
          </>
        ),
      });
    });
    setItems(list);
  }, [props.request.items, props.stage.data]);

  useEffect(() => {
    applySearch();
  }, [searchPref, items]);

  const applySearch = () => {
    const result = searchPref.text
      ? view?.filter(
          item =>
            item.title.toLowerCase().includes(searchPref.text) ||
            item.description.toLowerCase().includes(searchPref.text)
        )
      : items;
    setView(result);
  };

  const findStage = () => {
    const stageList: any[] = [];
    props.stage?.data.forEach(stageData => {
      stageList.push(stageData.name);
    });
    return stageList;
  };

  const toggleNewDialog = () => {
    setNewDialogOpen(!newDialogOpen);
    setSelectedRequest(emptyRequest);
  };

  const toggleEditDialog = () => {
    setEditDialogOpen(!editDialogOpen);
  };

  const openEditDialog = requestInput => {
    setEditDialogOpen(true);
    setSelectedRequest(requestInput);
  };

  const saveRequest = (request, edit = false) => {
    if (!request) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Unknown error',
        duration: 5000,
      });
      return;
    }

    if (isEmptyOrSpaces(request.title)) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Title is missing',
        duration: 5000,
      });
      return;
    }

    if (isEmptyOrSpaces(request.description)) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Description is missing',
        duration: 5000,
      });
      return;
    }
    const requestToSave = edit
      ? request
      : { ...request, stage: props.stage?.data[0]['_id'] };
    props.saveRequest(
      props.match.params.tenant,
      props.authorization,
      requestToSave
    );
    setSelectedRequest(requestToSave);
  };

  const handleChange = event => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSearchPrefChange = event => {
    setSearchPref({ ...searchPref, [event.target.name]: event.target.value });
  };

  return (
    <div className="requests">
      <OakDialog
        visible={newDialogOpen}
        toggleVisibility={() => toggleNewDialog()}
      >
        <div className="dialog-body">
          <OakText
            label="Title"
            data={data}
            id="title"
            handleChange={e => handleChange(e)}
          />
          <OakText
            label="Description"
            data={data}
            id="description"
            handleChange={e => handleChange(e)}
          />
        </div>
        <div className="dialog-footer">
          <OakButton
            action={() => toggleNewDialog()}
            theme="default"
            variant="appear"
            align="left"
          >
            <i className="material-icons">close</i>Cancel
          </OakButton>
          <OakButton
            action={() =>
              saveRequest(
                {
                  ...emptyRequest,
                  title: data.title,
                  description: data.description,
                },
                false
              )
            }
            theme="primary"
            variant="disappear"
            align="right"
          >
            <i className="material-icons">double_arrow</i>Save
          </OakButton>
        </div>
      </OakDialog>
      <ServiceRequestView
        {...props}
        editDialogOpen={editDialogOpen}
        toggleEditDialog={toggleEditDialog}
        saveRequest={saveRequest}
        request={selectedRequest}
        stages={props.stage?.data}
      />
      <OakViewResolver sideLabel="More options">
        <OakView main>
          <div className="search-bar-container">
            <div className="search-bar">
              <OakText
                label="Search"
                data={searchPref}
                handleChange={handleSearchPrefChange}
                id="text"
              />
              {/* </div>
            <div className="clear"> */}
              <OakButton
                action={() => setSearchPref({ ...searchPref, text: '' })}
                theme="default"
                variant="block"
                icon="clear"
              />
            </div>
            <div>
              <OakButton
                action={() => toggleNewDialog()}
                theme="primary"
                variant="disappear"
                align="right"
              >
                <i className="material-icons">double_arrow</i>New Request
              </OakButton>
            </div>
          </div>
          <OakTable
            material
            data={view}
            header={[
              { key: '_id', label: 'Request Number' },
              { key: 'title', label: 'Title' },
              { key: 'description', label: 'Description' },
              { key: 'statusView', label: 'Status' },
              { key: 'category', label: 'Category' },
              { key: 'priority', label: 'Priority' },
              { key: 'createdAt', label: 'Opened On', dtype: 'date' },
              { key: 'action', label: 'Action' },
            ]}
          />
        </OakView>
      </OakViewResolver>
    </div>
  );
};

const mapStateToProps = state => ({
  request: state.request,
  stage: state.stage,
});

export default connect(mapStateToProps, {
  fetchRequest,
  saveRequest,
  deleteRequest,
  fetchStage,
})(Request);
