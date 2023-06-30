<template>
    <div class="analysis-result">
        <div class="analysis-result-title">
            <span>{{ title }}</span>
        </div>
        <div class="analysis-result-panel">
            <div class="analysis-result-panel-item">
                <span class="analysis-result-panel-item-content">性别</span>
                <i class="analysis-result-panel-item-icon"
                    :class="result.gender === 'Male' ? 'el-icon-male' : 'el-icon-female'"></i>

            </div>
            <div class="analysis-result-panel-item">
                <span class="analysis-result-panel-item-content">年龄</span>
                <span class="analysis-result-panel-item-icon">{{ formatAge(result.age) }}</span>

            </div>
            <div class="analysis-result-panel-item">
                <span class="analysis-result-panel-item-content">分数</span>
                <span class="analysis-result-panel-item-icon">{{ result.score.toFixed(1) }}</span>
            </div>
        </div>
        <div class="analysis-result-faces" v-for="item in result.stars" :key="item.name">
            <div class="analysis-result-faces-left">
                <img class="analysis-result-faces-left-img" :src="item.url" alt="">
            </div>
            <div class="analysis-result-faces-right">
                <span class="analysis-result-faces-right-name">{{ item.name }}</span>
                <span class="analysis-result-faces-right-ratio">相似比例</span>
                <el-progress :text-inside="true" :stroke-width="26" :percentage="random(80, 95)" :format="format"
                    class="analysis-result-faces-right-progress"></el-progress>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AnalysisResult",
    props: {
        title: {
            type: String,
            default: '最近一次打分结果'
        },
        result: {
            type: Object,
            default: () => {
                return {
                    score: 92.513,
                    age: "(25-32)",
                    gender: "Male",
                    stars: [
                        {
                            name: "泰勒·斯威夫特",
                            url: "https://img1.baidu.com/it/u=235666361,2576303619&fm=26&fmt=auto&gp=0.jpg",
                        },
                        {
                            name: '莱昂纳多·迪卡普里奥',
                            url: 'https://img1.baidu.com/it/u=235666361,2576303619&fm=26&fmt=auto&gp=0.jpg'
                        }
                    ]
                }
            }
        }
    },
    data() {
        return {
            colors: [
                '#f56c6c', '#e6a23c', '#5cb87a', '#1989fa', '#6f7ad3'
            ],
            isMale: true
        }
    },
    methods: {
        formatAge(age) {
            return parseInt(age.replace(/[\(\)]/g, '').split('-').reduce((prev, cur) => {
                return prev + parseInt(cur);
            }, 0) / 2);
        },
        format(value) {
            return value.toFixed(2) + '%';
        },
        random(min, max) {
            return Math.random() * (max - min + 1) + min;
        }
    },
    beforeMount() {
    },
    mounted() {
        console.log(this.result);
    },

}
</script>

<style lang="less" scoped>
.analysis-result {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding-bottom: 2rem;

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
        position: sticky;
        top: 0;
        z-index: 9;
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
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        padding: .5rem;
        height: max-content;

        &-item {
            height: fit-content;
            flex: 1;
            height: 100%;
            box-sizing: content-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: .5rem 0;
            position: relative;

            &-icon {
                font-size: 3rem;
                font-weight: 700;
                line-height: 1;
                color: @purple;
            }

            &-content {
                font-size: 1rem;
                margin-bottom: 1rem;
                font-weight: bold;
                color: @purple;
            }
        }
    }

    &-faces {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        margin-top: 1rem;
        border-radius: 10px;
        height: 5rem;
        gap: 1rem;



        &-left {
            width: 30%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            position: relative;
            height: 100%;

            &-img {
                width: 100%;
                height: 100%;
                border-radius: 10px;
                object-fit: cover;
                border: 1px solid @purple;
                box-shadow: 0 .1rem 1rem -.3rem rgba(0, 0, 0, .2);
            }

            &-name {
                font-size: 1rem;
                font-weight: bold;
                color: @purple;
                margin-top: 1rem;
            }
        }

        &-right {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            position: relative;
            flex: 1;
            height: 100%;

            &-name {
                font-size: 1.1rem;
                font-weight: bold;
                color: @purple;
                line-height: 1.5;
            }

            &-ratio {
                font-size: .8rem;
                color: @purple;
                line-height: 1.5;
            }

            &-progress {
                flex: 1;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                /deep/ .el-progress-bar__outer {
                    height: 1rem !important;
                }

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

        }
    }
}
</style>