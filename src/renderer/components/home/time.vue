<template>
    <div class="test-clock-container">
    <flip-clock />
    </div>
</template>

<script>
import FlipClock from 'kuan-vue-flip-clock'
export default {
    name: 'Time',
    components: {
        FlipClock
    }
}
</script>

<style scoped lang="scss">
    .test-clock-container {
    font: normal 12px 'Helvetica Neue', Helvetica, sans-serif;
    user-select: none;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
    //background: radial-gradient(ellipse at center, #969696 0%, #595959 100%);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    ::v-deep .flip {
    font-size: 15vh;
    width:5vw;
    height: 20vh;
    line-height: 140%;
    .up::after {
        top: 100%;
        transform: translateY(-50%)
    }
    }
    }
</style>