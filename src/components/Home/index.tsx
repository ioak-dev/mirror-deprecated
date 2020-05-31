import React from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import cover from '../../images/cover.jpg';
import SearchBar from '../../oakui/SearchBar';
import constants from '../Constants';
import { sendMessage, receiveMessage } from '../../events/MessageService';
import {
  searchTextChangedEvent$,
  searchEvent$,
} from '../../events/SearchEvent';
import { getBanner } from '../Tenant/TenantService';
import { httpGet, httpPost, httpPut } from '../Lib/RestTemplate';
import { Authorization } from '../Types/GeneralTypes';
import OakDialog from '../../oakui/OakDialog';
import { isEmptyOrSpaces } from '../Utils';
import OakPrompt from '../../oakui/OakPrompt';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';

const pageYOffsetCutoff = 10;

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  history: any;
}

const Home = (props: Props) => {
  return <div className="home full">Home page</div>;
};

export default Home;
