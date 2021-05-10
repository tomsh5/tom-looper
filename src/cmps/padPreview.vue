<template>
  <section
    class="pad-preview flex column justify-center"
    v-bind:class="[isActive ? 'active' : 'not-active']"
    @click="
      toggelClick();
      setSound();
    "
  >
    <h2>{{ pad.title }}</h2>
  </section>
</template>

<script>
export default {
  name: "Pad-Preview",
  props: {
    pad: {
      required: true,
    },
  },
  data() {
    return {
      isActive: false,
      url: null,
    };
  },

  methods: {
    toggelClick() {
      this.isActive = !this.isActive;
    },
    setSound() {

      //Sending active sound url to store

      this.url = require(`../sounds/${this.pad.link}.mp3`);
      if (this.isActive) {
        this.$store.dispatch({ type: "addActiveSoundUrl", url: this.url });
      }

      //Sending unactive sound url to store

      else if (!this.isActive) {
        this.$store.dispatch({ type: "stopSound", url: this.url });
      }
    },
  },
};
</script>
