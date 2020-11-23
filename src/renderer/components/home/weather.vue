<template>
        <el-card
        class="weathercard"
        :body-style="{width:'560px',display:'flex','justify-content': 'space-around','align-items':'center'}"
        >
            <div class="weathercard-left">
                <h2>{{city}},{{country}}</h2>
                <img :src="nowWeather.iconPath" style="width:100px"/>
                <div>
                    <span>現在の天気:{{nowWeather.description}}</span>
                    <span>{{nowWeather.temperature}}</span>℃
                </div>
            </div>
            <div>
            <table>
            <tr v-for="(list,index) of afterWeather" :key="index">
                <td>{{list.month}}/{{list.date}}</td>
                <td>{{list.description}}</td>
                <td>{{list.temp}}℃</td>
                <td><img :src="list.iconPath" class="image" style="margin-top:5px"/></td>
            </tr>
            </table>
            </div>
        </el-card>
</template>

<script>
export default {
    name: 'Weather',
    data:function(){
        return{
            city:'',
            country:'',
            nowWeather:{},
            afterWeather:[],        
        }
    },
    created:function() {
            //process.env.GOOGLE_API_KEY='AIzaSyBthTv5T_E0Dbm2jQKa33BzMPUyYBE-kG8';
            //navigator.geolocation.getCurrentPosition(this.success,this.fail);  
             this.$http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBthTv5T_E0Dbm2jQKa33BzMPUyYBE-kG8')
             .then(res => {
                this.success(res);
            }) 
    },
    methods:{
        success: function(pos){
            this.$http.defaults.adapter = require('axios/lib/adapters/xhr');
            this.$http.get('https://api.openweathermap.org/data/2.5/forecast',{
                params:{
                    appid:'539a52d7795c91922be02d1769b9d0e1',
                    lat:pos.data.location.lat,
                    lon:pos.data.location.lng,
                    units:'metric',
                    lang:'ja',
                }
                })
            .then((res)=>{
                //console.log(res.data);
                //console.log('都市名:'+res.data.city.name);
                //console.log('国名;'+res.data.city.country);
                this.city=res.data.city.name;
                this.country=res.data.city.country;

                let list=res.data.list;
                let nowData=list[0];
                this.nowWeather={
                    temperature:Math.round(nowData.main.temp),
                    description:nowData.weather[0].description,
                    iconPath:require(`../../assets/img/${nowData.weather[0].icon}.svg`),
                    windspeed:nowData.wind.speed,
                }
                this.$store.commit('syncwind',this.nowWeather.windspeed);
                console.log(this.nowWeather);
                let afterData=[list[8],list[16],list[24]];
                this.afterWeather=afterData.map((item)=>{
                    let dateTime=new Date(this.utcToJSTime(item.dt));
                    return{
                        month:dateTime.getMonth()+1,
                        date:dateTime.getDate(),
                        temp:Math.round(item.main.temp),
                        description:item.weather[0].description,
                        iconPath:require(`../../assets/img/${item.weather[0].icon}.svg`),
                    }  
                })
            })
            .catch((res)=>{
                console.log(res);
            });

        },
        fail: function(error){
            alert('位置情報の取得に失敗しました．エラーコード：'+error.code);
        },
        utcToJSTime:function(utcTime){
            return utcTime * 1000;
        },
    },
    computed:{
    }
}
</script>

<style scoped>
    .weathercard{
        width: 600px;
        border-radius: 40px;
        position: absolute;
        top: 50px;
        left: 50px;
    }
    .weathercard-left{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .weathercard h2{
        margin:0;
    }
    .image{
        width: 30px;
        height: 30px;
    }
</style>