<template>
  <div id="app">
    <p><img src="./assets/logo.png"></p>
    <p><button @click="tPublish">Publish testMqtt</button></p>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  },

  $mqttHubConf: {
    testMqtt (payload) {
      alert(payload)
    }
  },

  methods: {
    tPublish () {
      this.$mqttHub.publish('testMqtt', 'Hello World!')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
