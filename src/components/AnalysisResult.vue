<template>
    <div class="analysis-result">
        <div class="analysis-result-title">
            <span>最近一次打分结果</span>
        </div>
        <div class="analysis-result-panel">
            <div class="analysis-result-panel-item" v-for="(item, index) in analysisList" :key="index">
                <span class="analysis-result-panel-item-content">{{ item.name }}</span>
                <el-progress class="analysis-result-panel-item-progress" :percentage="item.value" stroke-linecap="round" 
                    :stroke-width="16" :format="format" :text-inside="true"></el-progress>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AnalysisResult",
    props: ['analysisList'],
    data() {
        return {
        }
    },
    methods: {
        format(value) {
            return parseInt(value) + '%';
        }
    },
    beforeMount() {
    },
    mounted() {
    },

}
</script>

<style lang="less" scoped>
.analysis-result {
    width: 100%;
    display: flex;
    margin-top: 1rem;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    &-title {
        width: 100%;
        border-radius: 10px;
        height: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: @purple;
        color: white;
        font-size: 1rem;
        font-weight: bold;
        position: relative;
        overflow: hidden;
        box-shadow: -.5rem -.5rem 1rem -.5rem inset rgba(0, 0, 0, .2);

        &::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            height: 6rem;
            width: 6rem;
            border: 1rem solid @lightPink;
            transform: translateX(-25%) translateY(25%) rotate(45deg);
            border-radius: 1rem;
        }

        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            height: 6rem;
            width: 6rem;
            border: 1rem solid @pink;
            transform: translateX(-25%) translateY(25%) rotate(45deg);
            border-radius: 1rem;
        }
    }

    &-panel {
        width: 100%;
        padding: 1rem 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        &-item {
            height: 6vh;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: @white;
            border-radius: 10px;
            margin-top: .5rem;
            padding: 0 1rem;
            box-shadow: 0px 5px 15px -5px rgb(166 150 255 / 30%);

            &-progress {
                flex: 4;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                /deep/ .el-progress-bar__inner {
                    transform: translateX(-100%);
                    animation: move .5s ease-in-out forwards .5s, color 1s linear forwards infinite;
                    background: linear-gradient(90deg, @lightPurple 0%, @purple 100%);
                }

                @keyframes move {
                    from {
                       transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }

                /deep/ .el-progress-bar__innerText {
                    color: white !important;
                    font-size: .8rem;
                    line-height: 1rem;
                    font-weight: bold;
                }
            }

            &-content {
                font-size: 1rem;
                padding-right: 1rem;
                font-weight: bold;
                color: @purple;
            }
        }
    }
}
</style>