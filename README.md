# r10-vue-mqtt
A Vue plugin based on MQTT.js to make sub/pub messages easier.

# What I do:
1.利用vue实例(event hub)作为mqtt消息订阅/发布的载体;
2.通过vue mixins对组件混入created、beforedestroy生命周期执行函数；
3.通过对`hubNameConf`配置对象进行proxy实现对topic的订阅/解除订阅.


# advantages:
1.以vue插件方式全局建立连接，使用简单，配置简单；
2.避免在业务代码中频繁使用MQTT.js建立连接、sub/pub等造成代码冗余；
3.在vue组件的created、beforedestroy生命周期hook中进行了合理处理，避免单独使用MQTT.js造成的事件控制不当的问题.
4.可支持多个broker的场景，每条event hub相互独立.

# shortages:
1.未暴露MQTT.js中client.on接口，如需要使用到其他事件，需要自行对plugin进行扩展；
2.不支持进行定义`topic`规则时，加入`#`通配符.

# use:

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

In `component.vue`
```
this.$mqttHub.publish(topic, msg)
```
在组件中，可以通过`this[hubName]`获取总线实例.
通过this[hubName].publish进行消息广播

```
this.$mqttHub._mqttClient
```
可以通过 `this[hubName]._mqttClient` 获取连接的wrapper实例(`client`)
