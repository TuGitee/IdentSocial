<template>
    <div class="loading">
        <div class="loading-img"></div>
        <p class="loading-text">加载中...</p>
    </div>
</template>

<style lang="less" scoped>
.loading {
    width: 100%;
    box-sizing: content-box;
    text-align: center;

    .loading-img {
        background: url('./loading.png') no-repeat;
        background-size: 30px auto;
        width: 30px;
        height: 30px;
        background-position: 0 0;
        animation: running 1s steps(60) infinite;
        margin: auto;

        @keyframes running {
            from {
                background-position: 0 0;
            }

            to {
                background-position: 0 -1800px;
            }
        }
    }

    .loading-text {
        margin-top: 10px;
    }
}
</style>