<template>
    <button class="back" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        <b>返回</b>
    </button>
</template>

<script>
export default {
    methods: {
        goBack() {
            this.$router.back();
        }
    }
}
</script>

<style scoped lang="less">
.back {
    color: var(--color);
    text-shadow: var(--shadow);
    font-weight: bold;
    font-size: 1rem;
    margin-top: 1.2rem;
    width: fit-content;
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    position: relative;
    z-index: 99;

    i {
        margin-right: 4px;
        font-size: 1.2rem;
    }
}
</style>