import Mock from 'mockjs';
import { v4 as uuid } from 'uuid';
import { getAllKeys, getUrl } from '@/utils/storage';

export const mockUser = (email, password, id = uuid()) => Mock.mock({
    id,
    'email': email ?? '@email',
    'password': password ?? '@string("number", 6)',
    'age': '@integer(18, 60)',
    'gender': '@pick([0, 1])',
    'phone': /1[3456789]\d{9}/,
    'address': 'China',
    'status': '1',
    'username': '@cname',
    'created_at': Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    'updated_at': Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    'avatar': null,
    'avatarUrl': require('@/assets/images/' + Mock.Random.integer(0, 9) + '.png'),
    'background': null,
    'backgroundUrl': require('@/assets/bg/' + Mock.Random.integer(0, 8) + '.jpg'),
    'score': '@integer(50, 90)',
    'following': '@integer(1000, 5000)',
    'followers': '@integer(100, 1000)',
    'intro': '@cparagraph',
})
export const generateMockUsers = (n = userCount) => {
    const users = [];
    for (let i = 0; i < n; i++) {
        users.push(mockUser());
    }
    return users;
};

async function getAvatarUrl(userList) {
    for (let i = 0; i < userList.length; i++) {
        if (!userList[i].avatar) continue;
        userList[i].avatarUrl = await getUrl(userList[i].avatar);
    }
}

async function getBackgroundUrl(userList) {
    for (let i = 0; i < userList.length; i++) {
        if (!userList[i].background) continue;
        userList[i].backgroundUrl = await getUrl(userList[i].background);
    }
}

export const mockPost = (uid, text, time, img, like, comment, share, postFrom, id = uuid()) => Mock.mock({
    id,
    'text': text ?? '@cparagraph',
    'time': time ?? Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    img: img ?? (() => {
        if (images.length === 0) return [];
        const imgCount = Mock.Random.integer(0, 5);
        const imgUrls = [];
        for (let j = 0; j < imgCount; j++) {
            imgUrls.push(images[Math.floor(Math.random() * images.length)]);
        }
        return imgUrls;
    }),
    'like': like ?? '@integer(0, 100)',
    'comment': comment ?? '@integer(0, 50)',
    'share': share ?? '@integer(0, 30)',
    'postFrom': postFrom ?? null,
    'uid': uid ? uid : userList[Math.floor(Math.random() * userList.length)].id
})

export const generateMockPosts = (n = postCount) => {
    const posts = [];
    for (let i = 0; i < n; i++) {
        posts.push(mockPost());
    }
    posts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    return posts;
};

export const mockComment = (uid, bid, cid, text, time, id = uuid()) => Mock.mock({
    id,
    uid,
    bid,
    cid,
    text,
    time: time ?? Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
})

export const generateMockComments = (n = commentCount) => {
    const commentList = Array.from({ length: n }).map(() => mockComment(userList[Math.floor(Math.random() * userList.length)].id, postList[Math.floor(Math.random() * postList.length)].id, null, '@cparagraph')).sort((a, b) => new Date(b.time) - new Date(a.time));
    return commentList;
}


export const mockFollow = (fid, uid, time, isFollow = true, id = uuid()) => Mock.mock({ id, fid, uid, isFollow, time: time ?? Mock.Random.datetime('yyyy/MM/dd HH:mm:ss') });

export const generateMockFollow = (n = followCount) => {
    const followList = [];
    for (let i = 0; i < n; i++) {
        const fid = userList[Math.floor(Math.random() * userList.length)].id;
        const uid = userList[Math.floor(Math.random() * userList.length)].id;
        if (fid === uid || followList.find(item => item.uid === uid && item.fid === fid)) continue;
        followList.push(mockFollow(fid, uid, null));
    }
    return followList;
}


export const mockLike = (bid, uid, isLike, time, id = uuid()) => Mock.mock({ id, bid, uid, isLike, time: time ?? Mock.Random.datetime('yyyy/MM/dd HH:mm:ss') })

export const generateMockLike = (n = likeCount) => {
    const likeList = [];
    for (let i = 0; i < n; i++) {
        const bid = Mock.Random.pick(postList).id;
        const uid = Mock.Random.pick(userList).id;
        if (likeList.find(item => item.uid === uid && item.bid === bid)) continue;
        likeList.push(mockLike(bid, uid, true));
    }
    return likeList;
}


export function checkFollow() {
    userList.forEach(user => {
        user.following = followList.filter(follow => follow.uid === user.id).length;
        user.followers = followList.filter(follow => follow.fid === user.id).length;
    })
}

export function checkComment() {
    const checkParent = (cid) => {
        if (!cid) return true;
        const parent = commentList.find(comment => comment.id === cid);
        return parent ? checkParent(parent.cid) : false;
    };
    for (let i = 0; i < commentList.length; i++) {
        if (!commentList[i].cid) continue;
        if (!checkParent(commentList[i].cid)) {
            commentList.splice(i, 1);
            i--;
        }
    }
    postList.forEach(post => {
        post.comment = commentList.filter(comment => comment.bid === post.id).length;
    })
}

export function checkLike() {
    postList.forEach(post => {
        post.like = likeList.filter(like => like.bid === post.id).length;
    })
}

export function saveData(type) {
    switch (type) {
        case 'likeList':
            checkLike();
            localStorage.setItem('likeList', JSON.stringify(likeList));
            localStorage.setItem('postList', JSON.stringify(postList));
            localStorage.setItem('userList', JSON.stringify(userList));
            break;
        case 'commentList':
            checkComment();
            localStorage.setItem('commentList', JSON.stringify(commentList));
            localStorage.setItem('postList', JSON.stringify(postList));
            localStorage.setItem('userList', JSON.stringify(userList));
            break;
        case 'postList':
            localStorage.setItem('postList', JSON.stringify(postList));
            localStorage.setItem('userList', JSON.stringify(userList));
            break;
        case 'followList':
            checkFollow();
            localStorage.setItem('followList', JSON.stringify(followList));
            localStorage.setItem('userList', JSON.stringify(userList));
            break;
        case 'userList':
            checkFollow();
            localStorage.setItem('userList', JSON.stringify(userList));
            break;
    }
}

const images = await getAllKeys();
const userCount = 100;
const postCount = 100;
const commentCount = 1000;
const followCount = userCount * userCount / 5;
const likeCount = commentCount * userCount / 5;
export const userList = localStorage.getItem('userList') ? JSON.parse(localStorage.getItem('userList')) : generateMockUsers();
await getAvatarUrl(userList);
await getBackgroundUrl(userList);
export const postList = localStorage.getItem('postList') ? JSON.parse(localStorage.getItem('postList')) : generateMockPosts();
export const commentList = localStorage.getItem('commentList') ? JSON.parse(localStorage.getItem('commentList')) : generateMockComments();
export const followList = localStorage.getItem('followList') ? JSON.parse(localStorage.getItem('followList')) : generateMockFollow();
export const likeList = localStorage.getItem('likeList') ? JSON.parse(localStorage.getItem('likeList')) : generateMockLike();
checkFollow();
checkComment();
checkLike();