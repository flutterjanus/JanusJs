import { JanusJs } from "typed_janus_js";
export default {
  install(Vue, config) {
    /**
     * @property {string} Vue.prototype
     *  */
    Vue.prototype.$janus = new JanusJs(config);
  },
};
