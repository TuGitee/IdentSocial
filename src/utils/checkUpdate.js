function getVersion() {
    return fetch("/").then(res => res.text()).then(res => {
        const resources = res.match(/<script.*?src="(.+?)".*?>.*?<\/script>/g);
        const version = resources.map(item => item.match(/src="(.+?)"/)[1].replace(".js", "").split(".").pop()).reduce((pre, cur) => pre + cur, '');
        return version;
    })
}

function clearStorage() {
    localStorage.clear();
}

async function checkUpdate() {
    const currentVersion = await getVersion();

    const timer = setInterval(async () => {
        if (currentVersion !== await getVersion()) {
            clearInterval(timer);
            clearStorage();
            confirm("检测到版本更新，即将重新刷新页面！");
            window.location.reload();
        }
    }, 10000);
}

if (process.env.NODE_ENV === "production") {
    checkUpdate();
}