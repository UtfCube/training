import { server as WsServer, request as WsRequest, IMessage } from 'websocket';
import { createServer } from 'http';
import { ITraining } from './interfaces/training.interface';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '../config/config.service';


const authService = new AuthService();
const configService = new ConfigService(`${process.env.NODE_ENV}.env`);
let trainings: ITraining[] = [];
let clients = [];

var server = createServer((request, response) => {});

server.listen(configService.wsServerPort, () => {
    console.log((new Date()) + " Server is listening on port " + configService.wsServerPort);
});

var wsServer = new WsServer({
    httpServer: server
});

wsServer.on('request', (request: WsRequest) => {
    console.log((new Date()) + ' Connection from origin ' + request.origin);
    
    let connection = request.accept(null, request.origin); 
  // we need to know client index to remove them on 'close' event
    let client_index: number = clients.push(connection) - 1;
    let training_index: number = null;
    let user_id: number = null;
    console.log((new Date()) + ' Connection accepted');

    connection.on('message', (message: IMessage) => {
        if (message.type === 'utf8') {
            // TODO add dto for data
            let data: any = {};
            try {
                data =  JSON.parse(message.utf8Data);
            }
            catch (e) {
                connection.sendUTF(JSON.stringify({error: "Invalid json"}));
                return;
            }

            switch (data.type) {
                case 'START_TRAINING': {
                    if (user_id) {
                        connection.sendUTF(JSON.stringify({error: "training started already"}));
                        return;    
                    }
                    const jwt = authService.decodeJwt(data.payload.access_token);
                    user_id = jwt.sub;
                    const training: ITraining = {
                        user_id: user_id,
                        training_id: data.payload.training_id,
                        frames: []
                    }
                    training_index = trainings.push(training) - 1;                 
                    break;
                }
                case 'FRAMES': {
                    if (!user_id) {
                        connection.sendUTF(JSON.stringify({error: "training not started"}));
                        return;
                    }
                    const training = trainings.find((x: ITraining) => x.user_id === user_id);
                    training.frames = data.payload;
                    break;
                }
            }
        }
    });

    connection.on('close', () => {
        console.log((new Date()) + " Peer " + clients[client_index].remoteAddress + " disconnected");
        clients.splice(client_index, 1);
        if (user_id) {
            trainings.splice(training_index, 1);
        }
    })
});