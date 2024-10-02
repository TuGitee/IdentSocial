import Mock from 'mockjs';
import { userList, postList, mockUser, commentList, mockComment, mockPost, mockFollow, followList, likeList, mockLike, saveData } from './data';
import { getCurrentTime } from '@/utils/time';

Mock.mock(/\/mock\/user\/\w+/, 'get', (req) => {
    const id = req.url.split('/').pop();
    const user = userList.find(u => u.id === id);
    if (!user) return Mock.mock({ code: 400, msg: '用户不存在' });
    return Mock.mock({ code: 200, data: user });
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
    saveData('userList');
    return Mock.mock({ code: 200 });
});

Mock.mock(/\/mock\/post\/follow\?/, 'get', (req) => {
    const { page, limit, uid } = req.url.split('?')[1].split('&').reduce((acc, cur) => {
        const [key, value] = cur.split('=');
        acc[key] = value;
        return acc;
    }, {});
    const follow = followList.filter(item => item.uid === uid).map(item => item.fid);
    const data = postList.filter(item => follow.includes(item.uid)).slice((page - 1) * limit, page * limit).map(item => (item.user = userList.find(user => user.id === item.uid), item));
    return Mock.mock({ code: 200, data });
})

Mock.mock(/\/mock\/post\/user\?/, 'get', (req) => {
    const { page, limit, uid } = req.url.split('?')[1].split('&').reduce((acc, cur) => {
        const [key, value] = cur.split('=');
        acc[key] = value;
        return acc;
    }, {});
    const data = postList.filter(item => item.uid === uid).slice((page - 1) * limit, page * limit).map(item => (item.user = userList.find(user => user.id === item.uid), item));
    return Mock.mock({ code: 200, data });
})

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
    const { text, imgs, uid, postFrom } = JSON.parse(req.body);
    const post = mockPost(uid, text, getCurrentTime(), imgs, 0, 0, 0, postFrom);
    postList.unshift(post);
    post.user = userList.find(user => user.id === uid);
    saveData('postList');
    return Mock.mock({ code: 200, data: post });
})

Mock.mock(/\/mock\/post/, 'delete', (req) => {
    const id = req.url.split('/').pop();
    const index = postList.findIndex(post => post.id === id);
    if (index !== -1) {
        const data = postList.splice(index, 1);
        saveData('postList');
        return Mock.mock({ code: 200, data });
    } else {
        return Mock.mock({ code: 500, data: false });
    }
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
    saveData('commentList');
    return Mock.mock({ code: 200, data: comment });
})

Mock.mock(/\/mock\/follow/, 'post', (req) => {
    const { uid, fid, isFollow } = JSON.parse(req.body);
    const item = followList.find(item => item.uid === uid && item.fid === fid);
    let res = null;
    if (item) {
        if (item.isFollow == isFollow) {
            res = Mock.mock({ code: 400, data: item, msg: "重复操作" });
        } else {
            item.isFollow = isFollow;
            res = Mock.mock({ code: 200, data: item });
        }
    } else {
        const follow = mockFollow(fid, uid, getCurrentTime(), true);
        followList.push(follow);
        res = Mock.mock({ code: 200, data: follow });
    }
    saveData('followList');
    return res;
})

Mock.mock(/\/mock\/follow\/\w+/, 'get', (req) => {
    const uid = req.url.split('/').pop();
    return Mock.mock({ code: 200, data: followList.filter(item => item.uid === uid) });
})

Mock.mock(/\/mock\/follower/, 'get', (req) => {
    const uid = req.url.split('/').pop();
    return Mock.mock({ code: 200, data: followList.filter(item => item.fid === uid) });
})

Mock.mock(/\/mock\/like\/\w+/, 'get', (req) => {
    const uid = req.url.split('/').pop();
    return Mock.mock({ code: 200, data: likeList.filter(item => item.uid === uid) });
})

Mock.mock(/\/mock\/like/, 'post', (req) => {
    const { bid, uid, isLike } = JSON.parse(req.body);
    const index = likeList.findIndex(item => item.bid === bid && item.uid === uid);
    let data = null;
    if (index !== -1) {
        if (isLike) {
            return Mock.mock({ code: 400, data: likeList[index], msg: "重复操作" });
        } else {
            data = likeList.splice(index, 1).pop();
            data.isLike = false;
        }
    } else {
        if (isLike) {
            data = mockLike(bid, uid, isLike);
            likeList.push(data);
        } else {
            return Mock.mock({ code: 400, data: null, msg: "操作失败" });
        }
    }
    saveData('likeList');
    return Mock.mock({ code: 200, data });
})