<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/setting">Setting</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'raincheck'
    }
</script>

<style>
    body {
        margin: 0;
        padding: 0;
    }

    #nav {
        padding: 30px;
        position: fixed;
        bottom: 0px;
    }

    #nav a {
        font-weight: bold;
        color: #2c3e50;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }
</style>