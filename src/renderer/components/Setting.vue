<template>
    <div class="setting">
        <h1 style="margin:20px">設定ページ</h1>
        <el-card class="box-card">
            <div>
                <h2>天気</h2>
                <el-switch v-model="value1" active-text="華氏゜F" inactive-text="摂氏゜C">
                </el-switch>
            </div>
        </el-card>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        value1:'',
      }
    },
    watch:{
      value1(val){
        if(val===false){
          this.$store.commit('synctype','C');
        }else if(val===true){
          this.$store.commit('synctype','F');
        }
      }
    },
    mounted(){
      if(this.$store.state.type==='F'){
        this.value1=true;
      }else if(this.$store.state.type==='C'){
        this.value1=false;
      }
    }
  };
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        padding: 10px 0;
    }

    .box-card {
        margin: 20px;
        width: 480px;
    }
</style>