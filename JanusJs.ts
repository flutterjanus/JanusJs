
 class JanusJs {
    private sessions: Map<string, JanusSession> = new Map<string, JanusSession>();
    private transport: JanusTransport;

    constructor(transport: JanusTransport) {
        this.transport = transport;
    }

    async createSession(): Promise<JanusSession> {
        const session = new JanusSession(this.transport);
        await session.init();
        this.sessions.set(session.sessionId, session);
        return session;
    }


}
class JanusPlugin {
    plugin: string = "";
    transport: JanusTransport;
    session: JanusSession;
    handleId: number;
    onMessage: Function;

    constructor(transport: JanusTransport, session: JanusSession, plugin: string) {
        this.transport = transport;
        this.plugin = plugin;
        this.session = session;


    }

    init() {
        console.log('init called')
        if (this.transport instanceof WebSocketJanusTransport) {
            console.log('came here')
            this.transport.webSocket.addEventListener('message', (msg) => {
                var data = JSON.parse(msg.data);
                if (data['sender'] === this.handleId) {
                    const jsep = data['jsep'];
                    delete data['jsep'];
                    this.onMessage(data, jsep);
                }
            });
        }
    }

    async send(data, jsep = null): Promise<any> {
        let request: any = {
            "janus": "message",
            "body": data,
            "transaction": randomString(),
            "session_id": this.session.sessionId,
            "handle_id": this.handleId
        };
        if (data.hasOwnProperty('janus')) {
            delete request['janus'];
            delete request['body'];
            request = {...request, ...data}
        }
        if (jsep) {
            request.jsep = jsep;
        }
        if (this.transport instanceof WebSocketJanusTransport) {
            return await this.transport.send(request)
        }
        return null;
    }

}

class JanusSession {
    public sessionId: string = "";
    private handles:any = <JanusPlugin>{};
    private readonly transport: JanusTransport;
    timeout: number;
    private keepAliveHandler: any;

    constructor(transport: JanusTransport, timeout = 59) {
        this.transport = transport;
        this.timeout = timeout;
    }

    destroy() {
        clearInterval(this.keepAliveHandler);
    }

    async attach(plugin: 'janus.plugin.videoroom' | 'janus.plugin.audiobridge' | 'janus.plugin.videocall' | 'janus.plugin.streaming' | 'janus.plugin.echotest' | 'janus.plugin.sip'): Promise<JanusPlugin|null> {
        const pluginHandle: JanusPlugin = new JanusPlugin(this.transport, this, plugin);
        const attach = {
            janus: "attach",
            plugin: plugin,
            session_id: this.sessionId,
        }
        if (this.transport instanceof WebSocketJanusTransport) {
            const resp = await this.transport.send(attach)
            if (resp['data'] && resp['data'].hasOwnProperty('id')) {
                pluginHandle.handleId = resp['data']['id'];
                this.handles[pluginHandle.handleId] = pluginHandle;
                pluginHandle.init();

                return pluginHandle;
            } else {
                throw resp;
            }
        } else {
            return null;
        }
    }

    async init() {
        const create = {janus: 'create'}
        if (this.transport instanceof WebSocketJanusTransport) {
            const resp = await this.transport.send(create)
            if (resp['data'] && resp['data'].hasOwnProperty('id')) {
                this.sessionId = resp['data']['id'];
                const keepalive = {session_id: this.sessionId, janus: "keepalive"};
                this.keepAliveHandler = setInterval(async () => {
                    if (this.transport instanceof WebSocketJanusTransport) {
                        await this.transport.send(keepalive)
                    }
                }, this.timeout * 1000)
            }
            return resp;
        } else {
            return null;
        }
    }
}
 abstract class JanusTransport {
    protected constructor(url: string) {
        this.url = url;
    }

    url: string;

    destroy() {
    };
}

class WebSocketJanusTransport extends JanusTransport {
    constructor(url: string) {
        super(url);
    }

    // @ts-ignore
    webSocket: WebSocket;


    private async connect(): Promise<WebSocket> {
        if (this.webSocket && this.webSocket?.readyState === 1) {
            return this.webSocket;
        }
        return new Promise<WebSocket>((resolve, reject) => {
            this.webSocket = new WebSocket(this.url, 'janus-protocol');
            this.webSocket.onopen = () => {
                resolve(this.webSocket);
            };
            this.webSocket.onerror = (err: any) => {
                reject(err);
            };

        });
    }


    async send(data: any) {
        return this.connect().then((webSocket: WebSocket) => {
            data.transaction = randomString();
            webSocket.send(JSON.stringify(data));
            return new Promise<any>((resolve, reject) => {
                webSocket.addEventListener('message', (msg) => {
                    let dat = JSON.parse(msg.data);
                    if (dat['transaction'] === data.transaction) {
                        webSocket.removeEventListener('message', () => {
                        });
                        resolve(dat);
                    }
                },);
                webSocket.onerror = (err: any) => {
                    reject(err);
                };
            });
        })
    }


    destroy() {

    }


}

function randomString(len = 10, charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#\$%^&*()_+') {
    let randomString = '';
    for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * (charSet.length - 1));
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString + '_' + new Date().getTime().toString();
}