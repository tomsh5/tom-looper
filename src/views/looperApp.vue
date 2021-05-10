<template>
  <section>
    <appHeader />
    <div class="looper-app main-layout">
      <div class="list-container flex column">
        <div class="control-container flex space-between">
          <i
            @click="play = !play"
            v-bind:class="[play ? 'fa-stop' : 'fa-play']"
            class="fas"
          ></i>
        </div>
        <padList :pads="pads" />
      </div>
    </div>
  </section>
</template>

<script>
import looperService from "../services/looper-service";
import appHeader from "../cmps/appHeader";
import { Howl } from "howler";
import padList from "../cmps/padList";
import store from "../store/index";

export default {
  name: "Looper-App",
  components: {
    looperService,
    appHeader,
    padList,
  },

  data() {
    return {
      pads: null,
      activeSoundsUrls: null,
      sounds: null,
      play: false,
    };
  },

  computed: {

    //Getting info from store: active sound urls, loop status, and sound to stop

    soundsUrls() {
      return this.$store.getters.activeSoundsUrls;
    },
    loopStatus() {
      return this.$store.getters.loopStatus;
    },
    soundToStop() {
      return this.$store.getters.soundToStop;
    },
  },

  methods: {

    //Loading pads from service

    async loadPads() {
      this.pads = await looperService.loadPads();
    },

  // Taking the active sounds urls and place them as sounds, using Howler.js

    placeSounds() {
      this.sounds = [];
      this.activeSoundsUrls.map((url) => {
        const sound = new Howl({
          src: url,
          onplay: function () {
            store.dispatch({ type: "loopStarted" });
          },
          onend: function () {
            store.dispatch({ type: "loopEnded" });
          },
        });
        this.sounds.push(sound);
      });
    },

    //Stoping all active sounds

    stopActiveSounds() {
      this.sounds.map((sound) => {
        sound.stop();
      });
      this.$store.dispatch({ type: "loopStoped" });
    },

    //Playing all active sounds

    playActiveSounds() {
      this.sounds.map((sound) => {
        sound.play();
      });
    },
  },
  created() {
    this.loadPads();
  },

  watch: {
    soundsUrls: function () {
      // getting the active sounds urls and place them as sounds

      this.activeSoundsUrls = this.soundsUrls;
      this.placeSounds();

      if (!this.activeSoundsUrls) {
        this.stopActiveSounds();
      }
    },

    sounds: function () {
      // Starting the first sound, without a loop

      if (
        this.sounds.length > 0 &&
        this.loopStatus === "not-playing" &&
        this.play
      ) {
        this.stopActiveSounds();
        this.playActiveSounds();
      }

      //Initializing the loop status when no sounds to play

      if (!this.sounds.length && this.play) {
        this.$store.dispatch({ type: "loopInit" });
      }
    },

    // Chacking if loop was ended, stoping the loop and playing all active loops

    loopStatus: function () {
      if (this.loopStatus === "ended" && this.play === true) {
        this.stopActiveSounds();
        this.playActiveSounds();
      }
    },

    // Stoping the sound that is no more active immediately

    soundToStop: function () {
      if (this.soundToStop) {
        this.sounds.map((sound) => {
          if (sound._src === this.soundToStop) {
            sound.stop();
            this.$store.dispatch({ type: "removeSound", url: sound._src });
          }
        });
      }
    },

    // Playing and stopping active sounds

    play: function () {
      if (this.play === false) {
        this.stopActiveSounds();
      } else if (this.play === true) {
        if (this.sounds) {
          this.stopActiveSounds();
          this.playActiveSounds();
        }
      }
    },
  },
};
</script>