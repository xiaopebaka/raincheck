<template>
</template>

<script>
    export default {
        name: 'Alarm',
        data(){
            return{
                count:'',
                time:{
                    mm:0,
                    ss:0,
                },
            }
        },
        methods: {
            open1() {
                this.counter();
                this.$notify({
                    title: '警告',
                    dangerouslyUseHTMLString:true,
                    message: `雨が降ってきました,傘を忘れないでください!`,
                    iconClass: 'el-icon-bell',
                    duration: 0,
                    showClose: false,
                });                
            },
            counter(){
                setInterval(this.secsetup, 1000);
            },
            secsetup(){
                if(this.time.ss<59){
                    this.time.ss++;
                    this.$nextTick(()=>{
                        const node = document.getElementsByClassName('el-notification__content')[0];
                        const nodeP = node.getElementsByTagName('p')[0];
                        let sst=this.time.ss.toString();
                        nodeP.innerHTML=`雨が降ってきました,傘を忘れないでください!<span id="timer">${this.time.mm}:${sst.padStart(2,'0')}経過</span>`;
                    });
                }else {
                    this.time.ss=0;
                    this.time.mm++;
                    this.$nextTick(()=>{
                        const node = document.getElementsByClassName('el-notification__content')[0];
                        const nodeP = node.getElementsByTagName('p')[0];
                        let sst=this.time.ss.toString();
                        nodeP.innerHTML=`雨が降ってきました,傘を忘れないでください!<span id="timer">${this.time.mm}:${sst.padStart(2,'0')}経過</span>`;
                    });
                }
                console.log(this.time.ss);
            }
        },
        created() {
            if (this.$store.state.rain === 0) {
                this.open1();
            }
        }
    }
</script>

<style>
@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    20% {
        transform: rotate(10deg);
    }
    40% {
        transform: rotate(-10deg);
    }
    60% {
        transform: rotate(20deg);
    }
    80% {
        transform: rotate(-20deg);
    }
    100% {
        transform: rotate(0deg);
    }
}
.el-icon-bell {
    transition: all .5s;
    transform-origin: top center;
    animation: rotate 2s linear infinite;
}
#timer{
    display: flex;
    justify-content: flex-end;
}
</style>