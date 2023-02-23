<template>
  <h1>Welcom</h1>
  <div>current version: {{ version }}</div>
  <div>message: {{ updateMsg }}</div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",

  data() {
    return {
      version: "",
      updateMsg: "",
    };
  },

  mounted() {
    this.version = window.updater.versionInfo();

    window.updater.updateMessage((event, msg) => {
      console.log("event", event);
      console.log("msg", msg);
      this.updateMsg = msg;
    });
  },
});
</script>
