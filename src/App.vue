<template>
  <q-btn label="Check for updates" @click="checkForUpdates"></q-btn>
  <q-btn icon="settings">
    <q-badge v-if="updateAvailable" floating rounded color="red" />
  </q-btn>
  <div>current version: {{ version }}</div>
  <div>message: {{ updateMsg }}</div>
  <q-btn label="Download update" @click="downloadUpdate"></q-btn>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",

  data() {
    return {
      updateAvailable: false,
      version: "",
      updateMsg: "",
    };
  },

  mounted() {
    this.version = window.updater.versionInfo();

    window.updater.updateAvailable((event, available) => {
      this.updateAvailable = available;
    });

    window.updater.updateMessage((event, msg) => {
      console.log("event", event);
      console.log("msg", msg);
      this.updateMsg = msg;
    });
  },

  methods: {
    checkForUpdates() {
      window.updater.checkForUpdates();
    },

    downloadUpdate() {
      window.updater.downloadUpdate();
    },
  },
});
</script>
