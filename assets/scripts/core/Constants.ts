export const KEYS = {
  IS_RESET: 'isreset',
  END_GAME: 'endgame',
  SHOW_READY: 'hideready',
  SCREEN_SHOT: 'screenshot',
  SCORE: 'score',
  WIN_CELLS: 'wincells',
  WIN_NUM: 'winnum',
  WIN_RATE: 'winrate',
  WINNER_ID: 'winnerid',
  LOSER_ID: 'loserid',
  SYMBOL: 'symbol',
  ROW: 'row',
  COLUMN: 'column',
  FACEBOOK_ID: 'facebookid',
  BOARD_DIAMOND: 'boarddiamond',
  NAME: 'name',
  ORDER: 'order',
  MONEY: 'money',
  LIST_PLAYER_INFO: 'listplayerinfo',
  LIST_VIEWER_INFO: 'listviewerinfo',
  START_MONEY: 'startmoney',
  RATE: 'rate',
  DATA: 'data',
  SUB_COMMAND: 'sub',
  USER_INFO: 'userinfo',
  USER_MONEY: 'usermoney',
  INDEX: 'index',
  MESSAGE: 'message',
  TYPE: 'type',
  CHANNEL: 'channel',
  DIALOG_TYPE: 'dialog_type',
  CAUSE_COMMAND: 'causecommand',
  MODE_PLAY: 'modeplay',
  USER_NAME: 'username',
  USER_ID: 'userid',
  LOGIN_TYPE: 'loginType',
  CREATE_DATE: 'createdate',
  TOKEN: 'token',
  DISPLAY_NAME: 'displayname',
  ROOM: 'roomid',
  DEVICE_ID: 'deviceid',
  ROOM_ID: 'roomid',
  ROOM_INFO: 'roominfo',
  USER_INFO_LIST: 'listplayerinfo',
  USER_LIST: 'userlist',
  TIME_OUT: 'timeout',
  TURN_NUM: 'turnnum',
  CURRENT_USER_ID: 'currentuserid',
  GET_USER_ID: 'getuserid',
  GIVE_USER_ID: 'giveuserid',
  ACTION_TYPE: 'actiontype',
  ACTION_DATA: 'actiondata',
  POSITION: 'position',
  OWNER_ID: 'ownerid',
  STEP: 'step',
  IS_ACTIVE: 'isactive',
  AVATAR: 'avatar',
  USER_DIAMOND: 'userdiamond',
  LANG: 'lang',
  NUMBER_LIST: 'numberlist',
  NUMBER_ID: 'numberid',
  POSITION_X: 'positionx',
  POSITION_Y: 'positiony',
  ROTATION: 'rotation',
  FONT_SIZE: 'fontsize',
  ITEM_ID: 'itemid',
  CURRENT_NUMBER: 'currentnumber',
  NEXT_NUMBER: 'nextnumber',
  VALUE: 'value',
  RANK: 'rank',
  FIND_NUMBER: 'findnumber',
  LIST_NEW_PLAYER: 'listnewplayer'
};

export const GAME_EVENT = {
  SOCKET_READY: 'SOCKET_READY',
  ON_LANGUAGE_CHANGE: 'ON_LANGUAGE_CHANGE',
  SHOW_LINE_DIALOG: 'SHOW_LINE_DIALOG',
  LEAVE_GAME: 'LEAVE_GAME',
  CLOSE_DIALOG: 'CLOSE_DIALOG',
  CONFIRM: 'CONFIRM',
  ON_REFRESH_USER_SESSION: 'ON_REFRESH_USER_SESSION',
  TOGGLE_CHAT: 'TOGGLE_CHAT',
  NUMBER_CLICK: 'NUMBER_CLICK',
  JOIN_PRIVATE_ROOM: 'JOIN_PRIVATE_ROOM'
};

export const SERVER_EVENT = {
  PING: 'pingme',
  RECONNECT: 'reconnection',
  GET_RANK: 'getrank',
  UPDATE_SCORE: 'updatescore',
  VIEWER_TO_PLAYER: 'viewertoplayer',
  PLAYER_TO_VIEWER: 'playertoviewer',
  LEAVE_ROOM: 'leaveroom',
  VIEWER_JOIN_ROOM: 'viewerjoinroom',
  VIEWER: 'viewer',
  HIT: 'hit',
  CREATE_ROOM: 'createroom',
  READY: 'ready',
  LOGIN_FACEBOOK_INSTANT: 'loginfaceboolinstant',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  LOGIN_SUCCESS: 'loginsuccess',
  PLAY_GAME: 'playgame',
  USER_LEAVE_ROOM: 'userleaveroom',
  VIEWER_LEAVE_ROOM: 'viewerleaveroom',
  ACTION_IN_GAME: 'actioningame',
  LOGIN: 'login',
  LOGOUT: 'logout',
  LOGIN_WITH_ACCESS_TOKEN: 'loginwithtoken',
  NOTIFICATION: 'notification',
  AUTO_JOIN_ROOM: 'autojoinroom',
  JOIN_ROOM: 'joinroom',
  USER_JOIN_ROOM: 'userjoinroom',
  LEAVE_GAME: 'leavegame',
  LOGIN_GUEST: 'loginguest',
  SET_CLIENT_INFO: 'setclientinfo',
  ERROR_MESSAGE: 'errormessage',
  START_GAME: 'startgame',
  END_GAME: 'endgame',
  CHAT: 'chat',
  INVITE_PLAY_GAME: 'inviteplaygame',
  KICK: 'kick',
  NOTIFY: 'notify',
  GET_TIME_START_GAME: 'gettimestartgame',
  CHOOSE_NUMBER: 'choosenumber',
  UPDATE_DIAMOND: 'updatediamond',
  RE_RANDOM_NUMBER: 'rerandomnumber',
  MOVE: 'move',
};

export const LOGIN_TYPE = {
  LOGIN_FAIL: -1,
  LOGIN_GUEST: 0,
  LOGIN_NORMAL: 1,
  LOGIN_FB: 2,
  LOGIN_GG: 3,
  LOGIN_TW: 4
};

export const ERROR_TYPE = {
  REQUIRE_LOGIN: 'requirelogin',
  REQUIRE_SELECT_LINE: 'requireselectline'
};

export const DIALOG_TYPE = {
  TOAST: 0,
  NOTICE: 1,
  CONNECTING: 2,
  WIN: 3,
  LOSE: 4,
  WAITING: 5,
  DRAW: 6
};

export const SCENE_TYPE = {
  LOGIN: 'login',
  MAIN: 'mainmenu',
  PLAY: 'play',
  PRIVATE_ROOM: 'private_room',
  SELECT_SERVER: 'select_server'
};

export const GAME_STATE = {
  WAIT: 'wait_state',
  END: 'end_state',
  PLAY: 'play_state',
  VIEW: 'view_state'
};

export const CHAT_TYPE = {
  NORMAL: 0,
  STICKER: 1
};

export const SOCIAL_TYPE = {
  FACEBOOK: 1,
  TWITTER: 2
};

export const ITEM_TYPE = {};

export const ITEM_TYPE_COLOR = {
  ITEM_X2: '#ec2090',
  ITEM_X3: '#3cff00',
  ITEM_X2_DAIMOND_CURRENT: '#ff8a00',
  ITEM_PLUS: '#ff0000', //TODO thiếu màu item này
  ITEM_RE_RANDOM: '#ea3dff',
  ITEM_MINUS: '#0096ff',
  ITEM_NORMAL: '#000000',
};

export const MOVE_TYPE = {
  X_MOVE: 1,
  O_MOVE: 2
};