import mqtt from 'mqtt'

const install = function (Vue, opts = {}) {
  const hubName = opts.hubName || '$mqttHub'
  let hubVM, client

  if (!Vue.prototype[hubName]) {
    hubVM = Vue.prototype[hubName] = new Vue()
  } else {
    console.error(`${hubName} is already exist on Vue prototype!`)
    return
  }

  // vue mixins
  _initMqttLifecycleMixin(Vue, hubName, hubVM)
  // save client for devloppers
  client = hubVM._mqttClient = mqtt.connect(opts.clientUrl, opts.clientOpts)

  client.on('connect', () => {
    console.log('mqtt client successfully connected!')
  })

  client.on('message', (topic, message, packet) => {
    console.log('received message')
    hubVM.$emit(topic, message.toString())
  })

  // expose 'publish' method on hubVM
  hubVM.publish = client.publish.bind(client)
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
}

function _initMqttLifecycleMixin (Vue, hubName, hubVM) {
  Vue.mixin({
    created () {
      const nameStr = `${hubName}Conf`
      let mqttOpts = this.$options[nameStr]

      // proxy this.$options[_nameStr] set and deleteProperty
      // why use a new nameStr with '_' because
      // this.$options[nameStr] used in beforeDestroy hook, must keep it clean
      this.$options[`_${nameStr}`] = new Proxy({}, {
        set (target, key, val) {
          hubVM._mqttClient.subscribe(key)
          hubVM.$on(key, val)
          console.log(hubVM)
          target[key] = val
          return true
        },

        deleteProperty (target, key) {
          hubVM._mqttClient.unsubscribe(key)
          hubVM.$off(key, target[key])

          delete target[key]
          return true
        }
      })

      // dispatch the setter
      if (mqttOpts) {
        Object.keys(mqttOpts).forEach((key) => {
          this.$options[`_${nameStr}`][key] = mqttOpts[key].bind(this)
        })
      }
    },

    beforeDestroy () {
      const nameStr = `${hubName}Conf`
      let mqttOpts = this.$options[nameStr]

      if (mqttOpts) {
        Object.keys(mqttOpts).forEach((key) => {
          delete this.$options[`_${nameStr}`][key]
        })
      }
    }
  })
}
