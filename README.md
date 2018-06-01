# r10-vue-mqtt
A Vue plugin based on MQTT.js to make sub/pub messages easier.

example:

In `main.js`
``` sh
  import r10VueMqtt from './plugins/r10-vue-mqtt.js'
  
  Vue.use(r10VueMqtt, {
    hubName: '$mqttHub',                             //- name of the message hub on Vue.protorype 
    clientUrl: 'ws://iot.eclipse.org:80/ws',         //- broker url
    clientOpts: {}                                   //- mqtt options, you will get details from MQTT.js
  })
```
在`main.js`中使用Vue.use使用插件，参数见上方代码，clientOpts 即 MQTT.js对client提供的configure对象.

In `component.vue`
``` sh
  <script>
    export default {
      data...,
      props...,
      
      $mqttHubConf: {
        topic (payload) {
          //- do something in this message callback
        }
      }
    }
  </script>
```
在组件内部进行subcribe的配置，`$mqttHubConf`即是 `${hubName}Conf` 的值, 对象内每个属性名对应要进行订阅的topic名.
属性的value为收到通知时的callback, 参数payload 即 publish的 消息体.
