import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
<<<<<<< HEAD
  WsResponse,
=======
>>>>>>> refactoring
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Client, Server } from 'socket.io';
import { User } from 'src/entities/user.entity';
<<<<<<< HEAD

const connected = {};
const frames = {};
=======
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { TrainingService } from '../training/training.service';
import { Training } from 'src/entities/training.entity';
import { ExcersiceService } from '../excersice/excersice.service';

const frames = {};
const connected = {};
>>>>>>> refactoring

export const pointsOfInterest = [
  'nose',
  // 'leftEye',
  // 'rightEye',
  // 'leftEar',
  // 'rightEar',
  // 'leftShoulder',
  // 'rightShoulder',
  // 'leftElbow',
  // 'rightElbow',
  // 'leftWrist',
  // 'rightWrist',
  'leftHip',
  'rightHip',
  'leftKnee',
  'rightKnee',
  'leftAnkle',
  'rightAnkle',
];

export function calculateParabola(data, max, step = 1) {
  const maxIndex = data.indexOf(max);

  const x1 = maxIndex;
  const y1 = max;

  const x2 = maxIndex - step;
  const y2 = data[x2];

  const x3 = maxIndex + step;
  const y3 = data[x3];

  if (!x1 || !x2 || !x3 || !y1 || !y2 || !y3) {
    return null;
  }

  const f = x => {
    const a =
      (y3 - (x3 * (y2 - y1) + x2 * y1 - x1 * y2) / (x2 - x1)) /
      (x3 * (x3 - x1 - x2) + x1 * x2);
    const b = (y2 - y1) / (x2 - x1) - a * (x1 + x2);
    const c = (x2 * y1 - x1 * y2) / (x2 - x1) + a * x1 * x2;

    return a * Math.pow(x, 2) + b * x + c;
  };

  const min = Math.min(y1, y2, y3);
  const spread = max - min;

  return {
    f,
    spread,
    left: { x: x2, y: y2 },
    right: { x: x3, y: y3 },
  };
}

export function predictExercise(frames) {
  if (!frames || !frames.length) {
    return null;
  }

  const data = frames.map(f => f.nose);
  const lowestPoints = frames.map(f => f.leftKnee);

  if (!lowestPoints.length) {
    throw new Error(
      'Prediction could not be done, cause lack of lowest points',
    );
  }

  if (!data.length) {
    return null;
  }

  const max = Math.max(...data);

  let step = 1;
  let result = null;
  let prevParabola = null;
  let currentParabola = calculateParabola(data, max, step);

  while (currentParabola) {
    if (result) {
      break;
    }

    if (prevParabola) {
      const leftX = currentParabola.left.x;
      const rightX = currentParabola.right.x;

      const leftY = currentParabola.left.y;
      const rightY = currentParabola.right.y;

<<<<<<< HEAD
      const prevLeftY = prevParabola.f(leftX);
      const prevRightY = prevParabola.f(rightX);
=======
      // const prevLeftY = prevParabola.f(leftX);
      // const prevRightY = prevParabola.f(rightX);
>>>>>>> refactoring

      const diffLeft = prevParabola.left.y - leftY;
      const diffRIght = prevParabola.right.y - rightY;

      const sceletonHeight = lowestPoints[leftX] - leftY;
      const confindence = sceletonHeight / 3;
      const frameSpread = currentParabola.spread;

      if ((diffLeft < 0 || diffRIght < 0) && frameSpread > confindence) {
        result = {
          step: {
            number: step,
            spread: currentParabola.spread,
          },
          left: {
            x: leftX,
            y: leftY,
          },
          right: {
            x: rightX,
            y: rightY,
          },
        };
        break;
      }

<<<<<<< HEAD
      console.log(`
      X: ${leftX} : ${rightX}
      Y: ${leftY} : ${rightY}
      P: ${prevLeftY} : ${prevRightY}
      `);
=======
      // console.log(`
      // X: ${leftX} : ${rightX}
      // Y: ${leftY} : ${rightY}
      // P: ${prevLeftY} : ${prevRightY}
      // `);
>>>>>>> refactoring
    }

    step++;
    prevParabola = currentParabola;
    currentParabola = calculateParabola(data, max, step);
  }

  return result;
}

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

<<<<<<< HEAD
  // @SubscribeMessage('events')
  // findAll(client: Client, data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  // }

  @SubscribeMessage('frame')
  async registerUser(client: Client, frame: any): Promise<any> {
    const maxFramesLength = 14;
    const userFrames = frames[client.id];
    const len = userFrames.push(frame);
=======
  constructor(
    private readonly trainingService: TrainingService,
    private readonly exerciseService: ExcersiceService,
  ) {}

  @SubscribeMessage('frame')
  async registerUser(client: Client, data: any): Promise<any> {
    if (!data.trainId || !data.exerciseId || !data.frame) {
      return null;
    }

    const maxFramesLength = 14;
    const userFrames = frames[client.id];
    const len = userFrames.push(data.frame);
>>>>>>> refactoring

    if (len > maxFramesLength) {
      frames[client.id] = frames[client.id].slice(1);
    }

<<<<<<< HEAD
=======
    const { trainId, exerciseId, frame } = data;
    await this.exerciseService.storeNewFrame(trainId, exerciseId, frame);
>>>>>>> refactoring
    const prediction = predictExercise(frames[client.id]);

    if (prediction) {
      frames[client.id] = frames[client.id].slice(prediction.right.x);
<<<<<<< HEAD
      return prediction;
=======

      const exercise = await this.exerciseService.updateResult(
        trainId,
        exerciseId,
      );

      return { result: exercise.result };
>>>>>>> refactoring
    }

    return null;
  }

<<<<<<< HEAD
=======
  @SubscribeMessage('finish')
  async finishTraining(client: Client, data: any): Promise<any> {
    if (!data.trainId) {
      throw new BadRequestException('Train id is not defined');
    }

    return await this.trainingService.stopTraining(data.trainId);
  }

>>>>>>> refactoring
  async handleConnection(socket) {
    try {
      const user = await User.findOne({
        oauthId: socket.handshake.query.oauthId,
        email: socket.handshake.query.email,
      });

<<<<<<< HEAD
=======
      const trainId = socket.handshake.query.trainId;

      if (!user) {
        throw new UnauthorizedException();
      }

      if (!trainId) {
        throw new BadRequestException('Train id is not defined');
      }

      const training = await this.trainingService.getById(user, trainId);

      if (!training) {
        throw new BadRequestException('Training is not found');
      }

      await this.trainingService.startTraining(trainId);

>>>>>>> refactoring
      frames[socket.id] = [];
      connected[socket.id] = user;
    } catch (err) {
      socket.disconnect(err);
    }
  }

  async handleDisconnect(socket) {
<<<<<<< HEAD
=======
    await this.trainingService.stopTraining(socket.handshake.query.trainId);
>>>>>>> refactoring
    delete frames[socket.id];
    delete connected[socket.id];
  }
}
