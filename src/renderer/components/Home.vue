<template>
    <div class="home">
        <Weather></Weather>
        <Alarm></Alarm>
        <Memo></Memo>
        <Time></Time>
        <States></States>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Weather from './home/weather.vue'
    import Alarm from './home/alarm.vue'
    import Memo from './home/memo.vue'
    import Time from './home/time.vue'
    import States from './home/states.vue'
    export default {
        name: 'Home',
        components: {
            Weather,
            Alarm,
            Memo,
            Time,
            States,
        }
    }
</script>

<style scoped>
    .home {
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
        overflow:hidden;
    }

    .home::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('../assets/img/bg02.png') no-repeat;
        background-size: 100% 100%;
        /*filter: blur(50px);*/ 
        z-index: -1;
    }
</style>