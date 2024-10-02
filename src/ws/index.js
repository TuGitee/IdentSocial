import pubsub from '@/utils/pubsub';
import Pusher from 'pusher-js';

const pusher = new Pusher('ed8ac4713ea8545f1fd1', {
    cluster: 'ap1'
});

export const channel = pusher.subscribe('all-channel');
export let privateChannel = null;

export const emit = (eventType, data) => {
    fetch(requestURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            eventType,
            data
        })
    })
}

// const requestURL = 'https://api.face.tuguobin.site/pusher';
const requestURL = 'http://localhost:8084/pusher';

pubsub.on('userInfo', (data) => {
    emit(WebSocketType.UserInfo, data);
    privateChannel = pusher.subscribe(`${data.id}`);
})

export const WebSocketType = {
    Error: 'ERROR',
    GroupList: 'GROUP_LIST',
    GroupChat: 'GROUP_CHAT',
    PrivateChat: 'PRIVATE_CHAT',
    System: 'SYSTEM',
    PrivateRead: 'PRIVATE_READ',
    WorldItem: 'WORLD_ITEM',
    WorldRead: 'WORLD_READ',
    PrivateList: 'PRIVATE_LIST',
    WorldList: 'WORLD_LIST',
    UserInfo: 'USER_INFO',
    Disconnet: 'DISCONNECT',
}