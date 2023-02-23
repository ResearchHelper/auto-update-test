<template>
  <h1>Welcom</h1>
  <div>message: {{ updateMsg }}</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",

  data() {
    return {
      updateMsg: "",
    };
  },

  mounted() {
    window.updater.updateMessage((event, msg) => {
      console.log("event", event);
      console.log("msg", msg);
      this.updateMsg = msg;
    });
  },
});
</script>
