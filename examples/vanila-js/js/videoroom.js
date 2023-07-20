import { JanusJs, JanusVideoRoomPlugin } from 'typed_janus_js'
import { config } from './conf'
const remotePublishers = {}
/**
 * @type {{[key:string]:{audio:MediaStream;video:MediaStream}}}
 */
const publisherIdToMediaStream = {}
/**
 * @type {{[key:string]:any}}
 */
const midToPublisherIdMap = {}
const myRoom = 1234
const janus = new JanusJs(config.servercheap)
await janus.init({ debug: true })
const session = await janus.createSession()
const publisher = await session.attach(JanusVideoRoomPlugin)
/**
 * @type {JanusVideoRoomPlugin?}
 */
let subscriber
const username = prompt('Enter your name: ')
await publisher.joinRoomAsPublisher(myRoom, { display: username })

publisher.onMessage.subscribe(async ({ jsep, message }) => {
    const { publishers, leaving, unpublished, videoroom } = message || {}
    if (videoroom === 'joined') {
        await publisher.publishAsPublisher(
            await publisher.createOffer({
                tracks: [
                    { capture: true, recv: false, type: 'video' },
                    { capture: true, recv: false, type: 'audio' },
                ],
            }),
            { bitrate: 200000 }
        )
    }
    if (publishers && publishers.length > 0) {
        const streamsToSubscribe = []
        for (const publisher of publishers) {
            remotePublishers[publisher.id] = publisher
            for (const stream of publisher.streams) {
                midToPublisherIdMap[stream.mid] = publisher.id
                streamsToSubscribe.push({ mid: stream.mid, feed: publisher.id })
            }
        }
        updateSubscription(streamsToSubscribe)
    }
    if (unpublished) {
        console.log(unpublished)
        updateSubscription(undefined, [{ feed: unpublished }])
    }
    if (leaving) {
        console.log(leaving)
        updateSubscription(undefined, [{ feed: leaving }])
    }

    if (jsep) {
        publisher.handleRemoteJsep({ jsep })
    }
})

const updateSubscription = async (
    subscribeStreams = undefined,
    unSubscribeStreams = undefined
) => {
    if (subscriber) {
        await subscriber.updateAsSubscriber({
            subscribe: subscribeStreams,
            unsubscribe: unSubscribeStreams,
        })
        return
    }

    subscriber = await session.attach(JanusVideoRoomPlugin)
    await subscriber.joinRoomAsSubscriber(myRoom, { streams: subscribeStreams })
    subscriber.onMessage.subscribe(async ({ jsep, message }) => {
        if (jsep) {
            const answer = await subscriber.createAnswer({
                jsep,
                tracks: [{ type: 'audio', capture: false, recv: true }],
            })
            await subscriber.startAsSubscriber(answer)
        }
    })
    subscriber.onRemoteTrack.subscribe(({ track, on, mid }) => {
        const publisherId = midToPublisherIdMap[mid]
        if (on) {
            const existingPublisherStream =
                publisherIdToMediaStream[publisherId]
            if (existingPublisherStream) {
                if (track.kind === 'audio') {
                    existingPublisherStream.audio = new MediaStream([track])
                } else if (track.kind === 'video') {
                    existingPublisherStream.video = new MediaStream([track])
                }
            } else {
                publisherIdToMediaStream[publisherId] = {}
                if (track.kind === 'audio') {
                    publisherIdToMediaStream[publisherId].audio =
                        new MediaStream([track])
                } else if (track.kind === 'video') {
                    publisherIdToMediaStream[publisherId].video =
                        new MediaStream([track])
                }
            }
        } else {
            if (track.kind === 'audio') {
                publisherIdToMediaStream[publisherId].audio = null
            } else if (track.kind === 'video') {
                publisherIdToMediaStream[publisherId].video = null
            }
        }
        updateUi(publisherIdToMediaStream)
        console.log(publisherIdToMediaStream)
    })
}
const updateUi = (publisherIdToMediaStream) => {
    const videosContainer = document.getElementById('videos')
    const audioContainer = document.getElementById('audios')
    for (const publisherId in publisherIdToMediaStream) {
        const mediaStream = publisherIdToMediaStream[publisherId]
        const videoId = 'video_' + publisherId
        const audioId = 'audio_' + publisherId
        const videoToBeReplaced = document.getElementById(videoId)
        const audioToBeReplaced = document.getElementById(audioId)
        const videoElement = document.createElement('video')
        videoElement.id = videoId
        videoElement.controls = true
        videoElement.autoplay = true
        videoElement.style.objectFit = 'contain'
        videoElement.style.width = '300px'
        videoElement.style.height = 'auto'
        videoElement.srcObject = mediaStream.video
        const audioElement = document.createElement('audio')
        audioElement.id = audioId
        audioElement.controls = true
        audioElement.autoplay = true
        audioElement.style.width = '20px'
        audioElement.style.height = 'auto'
        audioElement.srcObject = mediaStream.audio
        if (!mediaStream.audio || !mediaStream.video) {
            videosContainer.removeChild(videoElement)
            audioContainer.removeChild(audioElement)
        }
        if (videoToBeReplaced) {
            videoToBeReplaced.replaceWith(videoElement)
        } else {
            videosContainer.appendChild(videoElement)
        }
        if (audioToBeReplaced) {
            audioToBeReplaced.replaceWith(audioElement)
        } else {
            audioContainer.appendChild(audioElement)
        }

        // videosContainer.remo
    }

    // videosContainer.appendChild()
}
function unpublish() {
    publisher.send({ message: { request: 'unpublish' } })
}
document.getElementById('unpublish').onclick = unpublish
