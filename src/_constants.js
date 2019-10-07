// Sockets
export const SOCKET_STATUS = 'socket-status';
export const SOCKET_PING = 'socket-ping';

// Grid
export const GET_PLANS = 'get-plans';

// WebRTC
export const WEBRTC_JOIN_ROOM = 'webrtc: join-room';
export const WEBRTC_INTERNAL_MESSAGE = 'webrtc: internal-message';
export const WEBRTC_PEER_LEFT = 'webrtc: peer-left';

export const WEBRTC_PEER_CONFIG = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302'
      ]
    }
  ]
};

export const WEBRTC_PEER_OPTIONS = {
  optional: [
    { DtlsSrtpKeyAgreement: true }, // Required for connection between Chrome and Firefox
    { RtpDataChannels: true } // Required in Firefox to use the DataChannels API
  ]
};

export const MSGTYPE_CMD = 1;
export const MSGTYPE_OBJ = 2;
export const MSGTYPE_OBJ_REQ = 3;
export const MSGTYPE_OBJ_DEL = 4;
export const MSGTYPE_EXCEPTION = 5;
export const IS_NONE = 6;
export const GET_SHAPE = 7;
export const SEARCH = 8;
export const FORCE_OBJ_DEL = 9;
export const PLAN_CMD = 10;
