import Mock from 'mockjs';
import { userList, postList, mockUser, commentList, mockComment } from './data';

Mock.mock(/\/mock\/user\/\w+/, 'get', (req) => {
    const id = req.url.split('/').pop();
    console.log(userList.find(item => item.id === id));
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
    data.forEach(item => item.user = userList.find(user => user.id === item.uid));
    return Mock.mock({ code: 200, data });
});

Mock.mock(/\/mock\/comment\/\w+/, 'get', (req) => {
    const id = req.url.split('/').pop();
    const data = commentList.filter(item => item.bid === id)
    data.forEach(item => item.user = userList.find(user => user.id === item.uid));
    return Mock.mock({ code: 200, data });
})

Mock.mock(/\/mock\/comment/, 'post', (req) => {
    const { text, cid, uid, bid } = JSON.parse(req.body);
    const comment = mockComment(uid, bid, cid, text, new Date().toLocaleString());
    commentList.unshift(comment);
    localStorage.setItem('commentList', JSON.stringify(commentList));
    return Mock.mock({ code: 200, data: comment });
})