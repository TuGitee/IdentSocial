import pubsub from '@/utils/pubsub';
import { getToken } from '@/utils/token';
import Pusher from 'pusher-js';

function init() {
    const pusher = new Pusher('ed8ac4713ea8545f1fd1', {
        cluster: 'ap1'
    });
    const channel = pusher.subscribe('all-channel');
    const privateChannel = pusher.subscribe(getToken());
    return [pusher, channel, privateChannel];
}

export let [pusher, channel, privateChannel] = init();

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

const requestURL = process.env.VUE_APP_PUSHER_URL;

pubsub.on('userInfo', (data) => {
    emit(WebSocketType.UserInfo, data);
})

pubsub.on('chatDetail', ()=>{
    const [pusher2, channel2, privateChannel2] = init();
    pusher = pusher2;
    channel = channel2;
    privateChannel = privateChannel2;
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