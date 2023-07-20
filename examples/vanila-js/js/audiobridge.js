import _ from 'lodash'
import {
    JanusAudioBridgePlugin,
    JanusJs,
    JanusStreamingPlugin,
} from 'typed_janus_js'
import { config } from './conf'
const janus1 = new JanusJs(config.servercheap)
await janus1.init({ debug: true })
const session1 = await janus1.createSession()
const audioBridgePlugin = await session1.attach(JanusAudioBridgePlugin)
const streamingPlugin = await session1.attach(JanusStreamingPlugin)
audioBridgePlugin.onMessage.subscribe(({ message, jsep }) => {
    console.log({ message, jsep })
})
await audioBridgePlugin.joinRoom(1234, { display: 'shivansh' })
await audioBridgePlugin.configure({
    offer: await audioBridgePlugin.createOffer({
        tracks: [{ capture: true, recv: true, type: 'audio' }],
    }),
})
