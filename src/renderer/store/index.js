import Vue from 'vue'
import Vuex from 'vuex'

import {
    createPersistedState,
    createSharedMutations
} from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      rain:'',
      wind:'',
      type:'C',
    },
    mutations:{
      sync(state,msg){
        //console.log(msg);
        state.rain=msg;
      },
      syncwind(state,msg){
        state.wind=msg;
      },
      synctype(state,msg){
        state.type=msg;
      }
    },
    modules,
    plugins: [
        createPersistedState(),
        //createSharedMutations()
    ],
    strict: process.env.NODE_ENV !== 'production'
})