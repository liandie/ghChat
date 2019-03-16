import { List } from 'immutable';

const UPDATE_HOME_PAGE_LIST = 'UPDATE_HOME_PAGE_LIST';
const CLEAR_UNREAD = 'CLEAR_UNREAD';
const DELETE_CHAT_FROM_LIST = 'DELETE_CHAT_FROM_LIST';
const SET_HOME_PAGE_LIST = 'SET_HOME_PAGE_LIST';
const SHOW_CALL_ME_TIP = 'SHOW_CALL_ME_TIP';

// TODO: 重构和代码注释
const updateHomePageListAction = ({
  homePageList, data, myUserId, increaseUnread = 0, showCallMeTip = false
}) => {
  const homePageListCopy = [...List(homePageList)];
  const dataCopy = { ...data };
  dataCopy.showCallMeTip = showCallMeTip;
  let chatFromId;
  if (dataCopy && dataCopy.to_user) {
    chatFromId = dataCopy.from_user === myUserId ? dataCopy.to_user : dataCopy.from_user;
    dataCopy.user_id = chatFromId;
  } else if (dataCopy && dataCopy.to_group_id) {
    chatFromId = dataCopy.to_group_id;
  }
  const chatExist = homePageListCopy.find(e => e.user_id === chatFromId || e.to_group_id === chatFromId);
  if (chatExist) {
    const length = homePageListCopy.length;
    for (let i = 0; i < length; i++) {
      const { user_id, to_group_id, unread = 0 } = homePageListCopy[i];
      if (user_id === chatFromId || to_group_id === chatFromId) {
        const updatedUnread = unread + increaseUnread;
        homePageListCopy[i] = Object.assign(homePageListCopy[i], {
          message: dataCopy.message, time: dataCopy.time, unread: updatedUnread, showCallMeTip
        });
        break;
      }
    }
  } else {
    dataCopy.unread = increaseUnread;
    homePageListCopy.push(dataCopy);
  }
  return {
    type: UPDATE_HOME_PAGE_LIST,
    data: homePageListCopy
  };
};

const showCallMeTipAction = ({ homePageList, showCallMeTip, chatFromId }) => {
  const homePageListCopy = [...List(homePageList)];
  const length = homePageListCopy.length;
  for (let i = 0; i < length; i++) {
    const { to_group_id } = homePageListCopy[i];
    if (to_group_id === chatFromId) {
      homePageListCopy[i].showCallMeTip = showCallMeTip;
      break;
    }
  }
  return {
    type: SHOW_CALL_ME_TIP,
    data: homePageListCopy
  };
};

const deleteHomePageListAction = ({
  homePageList, chatId
}) => {
  const homePageListCopy = [...List(homePageList)];
  const length = homePageListCopy.length;
  for (let i = 0; i < length; i++) {
    const { to_group_id, user_id } = homePageListCopy[i];
    const id = to_group_id || user_id;
    if (chatId === id) {
      homePageListCopy.splice(i, 1);
      break;
    }
  }
  return {
    type: DELETE_CHAT_FROM_LIST,
    data: homePageListCopy
  };
};

const clearUnreadAction = ({ chatFromId, homePageList }) => {
  const homePageListCopy = [...List(homePageList)];
  const length = homePageListCopy.length;
  for (let i = 0; i < length; i++) {
    const { user_id, to_group_id } = homePageListCopy[i];
    if ((user_id && user_id.toString()) === (chatFromId && chatFromId.toString())
        || to_group_id === chatFromId) {
      homePageListCopy[i].unread = 0;
      break;
    }
  }
  return {
    type: CLEAR_UNREAD,
    data: homePageListCopy
  };
};

const setHomePageListAction = (homePageList = []) => ({
  type: SET_HOME_PAGE_LIST,
  data: homePageList
});

export {
  UPDATE_HOME_PAGE_LIST,
  CLEAR_UNREAD,
  DELETE_CHAT_FROM_LIST,
  SET_HOME_PAGE_LIST,
  SHOW_CALL_ME_TIP,
  updateHomePageListAction,
  clearUnreadAction,
  deleteHomePageListAction,
  setHomePageListAction,
  showCallMeTipAction
};
