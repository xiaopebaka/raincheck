<template>
    <el-card class="states">
        <div>
            <table>
                <tr>現在の天気情報:
                    <td><img :src="ticon" style="width:30px">{{weather.Temperature}}°C</td>
                    <td><img :src="hicon" style="width:30px">{{weather.Humidity}}%</td>
                    <td><img :src="picon" style="width:40px">{{weather.Pressure}}</td>
                </tr>
            </table>            
        </div>
        
    </el-card>
</template>

<script>
    import mqtt from 'mqtt'
    var client
    const options = {
        connectTimeout: 40000,
        clientId: 'mqttjs_8a66d5743e',
    }
    client = mqtt.connect('ws://192.168.1.134:8083/mqtt', options)
    export default {
        name: 'States',
        data() {
            return {
                weather: {},
                ticon:require(`../../assets/img/Temperature.svg`),
                picon:require(`../../assets/img/Pressure.svg`),
                hicon:require(`../../assets/img/Humidity.svg`),
            }
        },
        created() {
            this.mqttMsg();
        },
        methods: {
            mqttMsg() {
                client.on('connect', (e) => {
                    console.log("接続成功");
                    client.subscribe('esp8266/test', {
                        qos: 0
                    }, (error) => {
                        if (!error) {
                            console.log('topicの予約は済みました');
                        } else {
                            console.log('topicの予約は失敗しました', e);
                        }
                    })
                })
                client.on('message', (topic, message) => {
                    //console.log(topic,'からのメッセージ:',message.toString());
                    let msg = '';
                    msg = message.toString();
                    this.weather = JSON.parse(msg);
                    this.$store.commit('sync',this.weather.rain);
                    console.log(this.weather);
                })
            }
        }
    }
</script>

<style scoped>
    .states {
        width: 400px;
        height: 100px;
        position: fixed;
        bottom: 50px;
        right: 100px;
        border-radius: 20px;
    }
</style>