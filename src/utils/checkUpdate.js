function getVersion() {
    return fetch("/").then(res => res.text()).then(res => {
        const resources = res.match(/<script.*?src="(.+?)".*?>.*?<\/script>/g);
        const version = resources.map(item => item.match(/src="(.+?)"/)[1].replace(".js", "").split(".").pop()).reduce((pre, cur) => pre + cur, '');
        return version;
    })
}

function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
}

async function checkUpdate() {
    const currentVersion = await getVersion();

    setInterval(async () => {
        if (currentVersion !== await getVersion()) {
            clearStorage();
            alert("检测到版本更新，请刷新页面");
        }
    }, 5000);
}

checkUpdate();
