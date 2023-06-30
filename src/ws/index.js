import { io } from './socketio.js';
export const socket = io(`ws://47.120.2.219:8084?token=${localStorage.getItem('token')}`);
export const WebSocketType = {
    Error: 0,
    GroupList: 1,
    GroupChat: 2,
    PrivateChat: 3,
    System: 4,
    PrivateRead: 5,
    WorldItem: 6,
    WorldRead: 7,
    PrivateList: 8,
    WorldList: 9,
}