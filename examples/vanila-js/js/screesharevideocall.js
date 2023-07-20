import { JanusJs, JanusVideoCallPlugin } from 'typed_janus_js'
import { config } from './conf'

const janus = new JanusJs(config.servercheap)
await janus.init({ debug: true })
const session = await janus.createSession()
const publisher = await session.attach(JanusVideoCallPlugin)
publisher.onMessage.subscribe((msg) => {
    if (msg.jsep) {
        publisher.handleRemoteJsep({ jsep: msg.jsep })
    }
})
const remoteVideo = document.getElementById('remotevideo')
let remoteStream = new MediaStream()
console.log(remoteVideo)
publisher.onRemoteTrack.subscribe(({ mid, on, track }) => {
    if (on) {
        remoteStream.addTrack(track)
    } else {
        remoteStream.removeTrack(track)
    }
})
remoteVideo.srcObject = remoteStream

const username = prompt('Enter your name: ')
await publisher.register(username)
const user = prompt('Enter user you want to call: ')
await publisher.call(
    user,
    await publisher.createOffer({
        tracks: [
            { type: 'audio', capture: true, recv: true },
            { type: 'screen', capture: true, recv: true },
        ],
    })
)
