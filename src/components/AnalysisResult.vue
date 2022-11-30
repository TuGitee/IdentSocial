<template>
    <div class="analysis-result">
        <div class="analysis-result-title">
            <span>Analysis Result</span>
        </div>
        <div class="analysis-result-panel">
            <div class="analysis-result-panel-item" v-for="(item, index) in analysisList" :key="index">
                <el-progress type="dashboard" :percentage="item.value" :color="colors" stroke-linecap="round"
                    :stroke-width="8" :format="format" :text-color="colors" ></el-progress>
                <span>{{ item.name }}</span>
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
            colors: [
                { color: '#EDE8EDAA', percentage: 10 },
                { color: '#EDCEF0AA', percentage: 20 },
                { color: '#E682F3AA', percentage: 30 },
                { color: '#C4BCF7AA', percentage: 40 },
                { color: '#A48EE1AA', percentage: 50 },
                { color: '#8E66CAAA', percentage: 60 },
                { color: '#7E44B4AA', percentage: 70 },
                { color: '#73289EAA', percentage: 80 },
                { color: '#6B1187AA', percentage: 90 },
                { color: '#640071AA', percentage: 100 }
            ]
        }
    },
    methods: {
        format(value) {
            return parseInt(value) + ' points';
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
    height: 100%;
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
        background-color: #A493FF;
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
            border: 1rem solid #ed93ff33;
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
            border: 1rem solid #ed93ff77;
            transform: translateX(-25%) translateY(25%) rotate(45deg);
            border-radius: 1rem;
        }
    }

    &-panel {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;

        &-item {
            width: 45%;
            height: fit-content;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: white;
            border-radius: 10px;
            margin-top: .5rem;
            padding: 1rem;
            box-shadow: 0px 5px 15px -5px rgb(166 150 255 / 30%);

            &-title {
                display: flex;
                align-items: center;
                font-size: 1rem;
                font-weight: bold;

                i {
                    margin-left: 1rem;
                    font-size: 1.5rem;
                    color: #A493FF;
                }
            }

            &-content {
                display: flex;
                align-items: center;
                font-size: 1rem;
                font-weight: bold;
                color: #A493FF;
            }
        }
    }
}
</style>