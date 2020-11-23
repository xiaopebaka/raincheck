<template>
    <el-card class="states">
        <div>現在の天気情報:
            <table class="datas">
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="室外温度" placement="top"><img :src="ticon" style="width:30px"></el-tooltip>{{weather.Temperature}}°C
                    </td>
                    <td>
                        <el-tooltip class="item" effect="dark" content="湿度" placement="top"><img :src="hicon" style="width:30px"></el-tooltip>{{weather.Humidity}}%
                    </td>
                    <td>
                        <el-tooltip class="item" effect="dark" content="気圧" placement="top"><img :src="picon" style="width:40px"></el-tooltip>{{weather.Pressure}}hPa
                    </td>
                    <td>
                        <el-tooltip class="item" effect="dark" content="室外体感温度" placement="top"><img :src="ficon" style="width:30px"></el-tooltip>{{weather.fat|toFixedTwo}}°C
                    </td>
                </tr>
            </table>
        </div>
    </el-card>
</template>

<script>
    import mqtt from 'mqtt'
    var client
    const options = {
        connectTimeout: 60000,
        clientId: 'mqttjs_8a66d5743e',
    }
    client = mqtt.connect('ws://192.168.1.134:8083/mqtt', options)
    export default {
        name: 'States',
        filters: {
            toFixedTwo(str) {
                if (str) {
                    return str.toFixed(2);
                }
                return '--'
            }
        },
        data() {
            return {
                weather: {},
                fat: '',
                ticon: require(`../../assets/img/Temperature.svg`),
                picon: require(`../../assets/img/Pressure.svg`),
                hicon: require(`../../assets/img/Humidity.svg`),
                ficon: require(`../../assets/img/fat.svg`),
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
                    this.$store.commit('sync', this.weather.rain);
                    //console.log(this.weather);
                    this.feltairtmp();
                })
            },
            feltairtmp() {
                const e = (this.weather.Humidity / 100) * 6.105 * Math.pow(Math.E, ((17.27 * this.weather.Temperature) / (237.27 * this.weather.Temperature)));
                //console.log(e);
                let fatt = 1.07 * this.weather.Temperature + 0.2 * e - 0.065 * this.$store.state.wind - 2.7;
                //console.log(fatt);
                this.weather["fat"] = fatt;
            },
            setStorage() {
                sessionStorage.setItem('states', JSON.stringify(this.weather));
            },
            getStorage() {
                return sessionStorage.getItem('states');
            },
        },
        mounted(){
            if (JSON.parse(this.getStorage())) {
                this.weather = JSON.parse(this.getStorage());
            }
        },
        beforeDestroy(){
            this.setStorage();
        }
    }
</script>

<style scoped>
    .states {
        width: 400px;
        height: 150px;
        position: fixed;
        bottom: 50px;
        right: 100px;
        border-radius: 20px;
    }

    .datas {
        margin: 15px;
        display: flex;
        justify-content: center;
    }
</style>