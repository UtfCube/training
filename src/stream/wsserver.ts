import {
  server as WsServer,
  request as WsRequest,
  IMessage,
  connection,
} from 'websocket';
import { createServer } from 'http';
import { ITraining } from './interfaces/training.interface';
import { ConfigService } from 'src/modules/config/config.service';

class FrameServer {
  private readonly configService: ConfigService;
  private trainings: ITraining[];
  private clients: any[];
  private wsServer: WsServer;

  constructor() {
    this.configService = new ConfigService();
    console.log(this.configService);
    this.trainings = [];
    this.clients = [];

    const server = createServer();

    server.listen(this.configService.get('WS_SERVER_PORT'), () => {
      console.log(
        new Date() +
          ' Server is listening on port ' +
          this.configService.get('WS_SERVER_PORT'),
      );
    });

    this.wsServer = new WsServer({
      httpServer: server,
    });

    this.onRequestHandle();
  }

  private onRequestHandle(): void {
    this.wsServer.on('request', (request: WsRequest) => {
      console.log(new Date() + ' Connection from origin ' + request.origin);

      let conn: connection = request.accept(null, request.origin);
      let client_index: number = this.clients.push(connection) - 1;
      let training_index: number = null;
      let user_id: number = null;
      console.log(new Date() + ' Connection accepted');

      conn.on('message', (message: IMessage) => {
        if (message.type === 'utf8') {
          // TODO add dto for data
          let data: any = {};
          try {
            data = JSON.parse(message.utf8Data);
          } catch (e) {
            conn.sendUTF(JSON.stringify({ error: 'Invalid json' }));
            return;
          }

          switch (data.type) {
            case 'START_TRAINING': {
              break;
            }
            case 'FRAMES': {
              break;
            }
          }
        }
      });

      conn.on('close', () => {
        console.log(
          new Date() +
            ' Peer ' +
            this.clients[client_index].remoteAddress +
            ' disconnected',
        );
        this.clients.splice(client_index, 1);
        if (user_id) {
          this.trainings.splice(training_index, 1);
        }
      });
    });
  }
}

const server: FrameServer = new FrameServer();
