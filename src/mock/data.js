import Mock from 'mockjs';
import { v4 as uuid } from 'uuid';

const userCount = 100;
const postCount = 100;
const commentCount = 1000;

export const mockUser = (email, password, id = uuid()) => Mock.mock({
    id,
    'email': email ?? '@email',
    'password': password ?? '@string("number", 6)',
    'age': '@integer(18, 60)',
    'gender': '@pick(["Male", "Female"])',
    'phone': /1[3456789]\d{9}/,
    'address': 'China',
    'status': '1',
    'nickname': '@cname',
    'created_at': Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    'updated_at': Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    'avatar': require('@/assets/images/' + Mock.Random.integer(0, 9) + '.png'),
    'faceScore': '@integer(50, 90)',
    'following': '@integer(1000, 5000)',
    'followers': '@integer(100, 1000)',
    'intro': '@cparagraph',
    'analysisList': [
        {
            'name': '总分',
            'value': '@integer(50, 90)'
        },
        {
            'name': '颜值',
            'value': '@integer(60, 100)'
        },
        {
            'name': '皮肤',
            'value': '@integer(50, 85)'
        },
        {
            'name': '五官',
            'value': '@integer(40, 80)'
        }
    ]
})
export const generateMockUsers = (n = userCount) => {
    const users = [];
    for (let i = 0; i < n; i++) {
        users.push(mockUser());
    }
    localStorage.setItem('userList', JSON.stringify(users));
    return users;
};

export const userList = localStorage.getItem('userList') ? JSON.parse(localStorage.getItem('userList')) : generateMockUsers();

export const mockPost = (uid, text, time, id = uuid()) => Mock.mock({
    id,
    'text': text ?? '@cparagraph',
    'time': time ?? Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    img() {
        const imgCount = Mock.Random.integer(0, 5);
        const imgUrls = [];
        for (let j = 0; j < imgCount; j++) {
            imgUrls.push(`Blog${Mock.Random.integer(0, 9)}.png`);
        }
        return imgUrls;
    },
    'like': '@integer(0, 100)',
    'comment': '@integer(0, 50)',
    'share': '@integer(0, 30)',
    'uid': uid ? uid : userList[Math.floor(Math.random() * userList.length)].id
})
export const generateMockPosts = (n = postCount) => {
    const posts = [];
    for (let i = 0; i < n; i++) {
        posts.push(mockPost());
    }
    posts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    localStorage.setItem('postList', JSON.stringify(posts));
    return posts;
};

export const postList = localStorage.getItem('postList') ? JSON.parse(localStorage.getItem('postList')) : generateMockPosts();

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
    localStorage.setItem('commentList', JSON.stringify(commentList));
    return commentList;
}

export const commentList = localStorage.getItem('commentList') ? JSON.parse(localStorage.getItem('commentList')) : generateMockComments();