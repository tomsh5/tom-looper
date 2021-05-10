import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loopStatus: 'not-playing',
    activeSoundsUrls: [],
    soundToStop: null
  },
  
  getters: {

    loopStatus(state) {
      return state.loopStatus
    },
    activeSoundsUrls(state) {
      return state.activeSoundsUrls
    },
    soundToStop(state){
      return state.soundToStop
    }
  },

  mutations: {

    setLoopEnded(state) {
      state.loopStatus = 'ended'
    },
    setLoopStarted(state) {
      state.loopStatus = 'started'
    },
    setLoopInit(state){
      state.loopStatus = 'not-playing'
    },
    setLoopStoped(state){
      state.loopStatus = 'stoped'
    },
    addUrlToActiveSoundsUrls(state, { url }) {
      state.activeSoundsUrls.push(url)
    },
    stopSound(state, { url }) {
      state.soundToStop = url
    },
    removeSound(state, { url }) {
      state.soundToStop = null
      state.activeSoundsUrls.map((sound, idx) => {
        if (sound === url) {
          state.activeSoundsUrls.splice(idx, 1)
        }
      })
    }
  },

  actions: {

    //Updating loop status
    loopEnded({ commit }) {
      commit({ type: 'setLoopEnded' })
    },
    loopStarted({ commit }) {
      commit({ type: 'setLoopStarted' })
    },
    loopInit({ commit }) {
      commit({ type: 'setLoopInit' })
    },
    loopStoped({commit}){
      commit({ type: 'setLoopStoped' })
    },

    // Adding active sound url that came from padPreview

    addActiveSoundUrl({ commit }, { url }) {
      commit({ type: "addUrlToActiveSoundsUrls", url });
    },

    //Updating up with the url of the sound need to be stoped

    stopSound({ commit }, { url }) {
      commit({ type: "stopSound", url });
    },

    //Removing sound that was stoped from state

    removeSound({ commit }, { url }) {
      commit({ type: "removeSound", url });
    }

  },
  modules: {},
});
