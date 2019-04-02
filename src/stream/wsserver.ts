import { server as WsServer, request as WsRequest, IMessage, connection } from 'websocket';
import { createServer } from 'http';
import { ITraining } from './interfaces/training.interface';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';

class FrameServer {
    private readonly authService: AuthService;
    private readonly configService: ConfigService;
    private trainings: ITraining[];
    private clients: any[];
    private wsServer: WsServer; 
    
    constructor() {
        this.configService = new ConfigService('.env');
        this.authService = new AuthService(this.configService);
        this.trainings = [];
        this.clients = [];
        const server = createServer(() => {});
        server.listen(this.configService.wsServerPort, () => {
            console.log((new Date()) + " Server is listening on port " + this.configService.wsServerPort);
        });
        this.wsServer = new WsServer({
            httpServer: server
        });
        this.onRequestHandle();
    }

    private onRequestHandle(): void {
        this.wsServer.on('request', (request: WsRequest) => {
            console.log((new Date()) + ' Connection from origin ' + request.origin);
            
            let conn: connection = request.accept(null, request.origin);
            let client_index: number = this.clients.push(connection) - 1;
            let training_index: number = null;
            let user_id: number = null;
            console.log((new Date()) + ' Connection accepted');
            
            conn.on('message', (message: IMessage) => {
                if (message.type === 'utf8') {
                    // TODO add dto for data
                    let data: any = {};
                    try {
                        data =  JSON.parse(message.utf8Data);
                    }
                    catch (e) {
                        conn.sendUTF(JSON.stringify({error: "Invalid json"}));
                        return;
                    }
        
                    switch (data.type) {
                        case 'START_TRAINING': {
                            if (user_id) {
                                conn.sendUTF(JSON.stringify({error: "training started already"}));
                                return;    
                            }
                            let jwt = null;
                            try {
                                jwt = this.authService.decodeJwt(data.payload.access_token);
                            } catch(e) {
                                conn.sendUTF(JSON.stringify({error: e.message}));
                            }
                            user_id = jwt.sub;
                            const training: ITraining = {
                                user_id: user_id,
                                training_id: data.payload.training_id,
                                frames: []
                            }
                            training_index = this.trainings.push(training) - 1;                 
                            break;
                        }
                        case 'FRAMES': {
                            if (!user_id) {
                                conn.sendUTF(JSON.stringify({error: "training not started"}));
                                return;
                            }
                            const training = this.trainings.find((x: ITraining) => x.user_id === user_id);
                            training.frames = data.payload;
                            break;
                        }
                    }
                }
            });
        
            conn.on('close', () => {
                console.log((new Date()) + " Peer " + this.clients[client_index].remoteAddress + " disconnected");
                this.clients.splice(client_index, 1);
                if (user_id) {
                    this.trainings.splice(training_index, 1);
                }
            }) 
        });
    }

}

const server: FrameServer = new FrameServer();