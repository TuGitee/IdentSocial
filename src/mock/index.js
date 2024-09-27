import Mock from 'mockjs';
import { userList, postList, mockUser, commentList, mockComment, mockPost, mockFollow, followList, checkComment } from './data';
import { getCurrentTime } from '@/utils/time';

Mock.mock(/\/mock\/user\/\w+/, 'get', (req) => {
    const id = req.url.split('/').pop();
    return Mock.mock({ code: 200, data: userList.find(item => item.id === id) });
});

Mock.mock(/\/mock\/user\/login/, 'post', (req) => {
    const { email, password } = JSON.parse(req.body);
    const user = userList.find(item => item.email === email && item.password === password);
    if (!user) return Mock.mock({ code: 400 });
    return Mock.mock({ code: 200, data: user });
});

const verifyCode = new Map();

Mock.mock(/\/mock\/verify\?email=\w+/, 'get', (req) => {
    const email = req.url.match(/email=(.+)/).pop();
    verifyCode.set(email, Math.random().toString().slice(2, 8));
    return Mock.mock({ code: 200, data: verifyCode.get(email) });
})

Mock.mock(/\/mock\/verify/, 'post', (req) => {
    const { email, code } = JSON.parse(req.body);
    if (verifyCode.get(email) !== code) return Mock.mock({ code: 400 });
    verifyCode.delete(email);
    return Mock.mock({ code: 200 });
})

Mock.mock(/\/mock\/user/, 'post', (req) => {
    const { email, password } = JSON.parse(req.body);
    userList.unshift(mockUser(email, password));
    localStorage.setItem('userList', JSON.stringify(userList));
    return Mock.mock({ code: 200 });
});

Mock.mock(/\/mock\/post\/\w+/, 'get', (req) => {
    const id = req.url.split('/').pop();
    const post = postList.find(item => item.id === id);
    if (!post) return Mock.mock({ code: 404 });
    const user = userList.find(item => item.id === post.uid);
    return Mock.mock({ code: 200, data: { ...post, user } });
});

Mock.mock(/\/mock\/post/, 'get', (req) => {
    const { page, limit } = req.url.split('?')[1].split('&').reduce((acc, cur) => {
        const [key, value] = cur.split('=');
        acc[key] = value;
        return acc;
    }, {});
    const data = postList.slice((page - 1) * limit, page * limit);
    for (let i = 0; i < data.length; i++) {
        data[i].user = userList.find(user => user.id === data[i].uid);
    }
    return Mock.mock({ code: 200, data })
});

Mock.mock(/\/mock\/post/, 'post', (req) => {
    const { text, imgs, uid } = JSON.parse(req.body);
    const post = mockPost(uid, text, getCurrentTime(), imgs);
    postList.unshift(post);
    post.user = userList.find(user => user.id === uid);
    localStorage.setItem('postList', JSON.stringify(postList));
    return Mock.mock({ code: 200, data: post });
})

Mock.mock(/\/mock\/comment\/\w+/, 'get', (req) => {
    const id = req.url.split('/').pop();
    const data = commentList.filter(item => item.bid === id)
    data.forEach(item => item.user = userList.find(user => user.id === item.uid));
    return Mock.mock({ code: 200, data });
})

Mock.mock(/\/mock\/comment/, 'post', (req) => {
    const { text, cid, uid, bid } = JSON.parse(req.body);
    const comment = mockComment(uid, bid, cid, text, getCurrentTime());
    commentList.unshift(comment);
    checkComment();
    localStorage.setItem('commentList', JSON.stringify(commentList));
    return Mock.mock({ code: 200, data: comment });
})

Mock.mock(/\/mock\/follow/, 'post', (req) => {
    const { uid, fid, isFollow } = JSON.parse(req.body);
    const item = followList.find(item => item.uid === uid && item.fid === fid);
    if (item) {
        if (!!item.isFollow === isFollow) {
            return Mock.mock({ code: 400, data: item, msg: "重复操作" });
        } else {
            item.isFollow = isFollow;
            return Mock.mock({ code: 200, data: item });
        }
    }
    const follow = mockFollow(fid, uid, getCurrentTime(), isFollow);
    followList.push(follow);
    return Mock.mock({ code: 200, data: follow });
})

Mock.mock(/\/mock\/follow\/\w+/, 'get', (req) => {
    const uid = req.url.split('/').pop();
    return Mock.mock({ code: 200, data: followList.filter(item => item.uid === uid).map(item => userList.find(user => user.id === item.fid)) });
})