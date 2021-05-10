<template>
<section class="pad-list">
    <div v-for="pad in pads" :key="pad.id">
        <padPreview :pad="pad"/>
    </div>

</section>
</template>

<script>
import padPreview from './padPreview'

export default {
  name: "Pad-List",
  components: {
      padPreview
  },
  props:{
    pads :{
        required: true
    }
  },

};
</script>

<style>
</style>