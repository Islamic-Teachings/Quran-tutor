import { eventChannel, END, EventChannel } from 'redux-saga';
import { call, put, take, fork, cancel, cancelled } from 'redux-saga/effects'
import { Action, SET_SOCKET_STATUS, SET_MESSAGE_PAYLOAD, DISCONNECT, SET_DISCONNECT_STATUS, START_SOCKET, SEND_MESSAGE } from './types';
import { w3cwebsocket as WebSocket } from "websocket";
import { Payload, Request } from '../models'


const createWebSocketConnection = (host: string, port?: number, path?: string) => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(`${host}${(port) ? ":":"" + port}${(path) ? "/":"" + path}`)
    socket.onopen = () => {
      resolve(socket)
    };
    socket.onerror = err => {
      reject(err)
    }
  })
}

const sendMessage = (socket: WebSocket, req: Request) => {
  socket.send(req)
  // yield put(<Action>{type: CALLED, name: req.name });
}

const createSocketChannel = (socket: WebSocket) => {
  return eventChannel((emit: any) => {
    socket.onmessage = e => {
      emit(e.data)
    }

    socket.onclose = _ => {
      emit(END);
    }

    return () =>  {
      socket.onmessage = e => {
        emit(e.data)
      }
    }
  })
}

function* listenForSocketMessages(url: string) {
  let socket: WebSocket
  let channel: EventChannel<any>

  try {
    socket  = yield call(createWebSocketConnection, url);
    channel = yield call(createSocketChannel, socket);
    yield put(<Action>{type: SET_SOCKET_STATUS, status: true})
    while (true) {
      let sendMessageAction: Action = yield take(SEND_MESSAGE)
      if (sendMessageAction.type == SEND_MESSAGE) {
        sendMessage(socket, sendMessageAction.request)
      }
      // wait for a message from the channel
      const payload = yield take(channel);
      // a message has been received, dispatch an action with the message payload
      yield put(<Action>{type: SET_MESSAGE_PAYLOAD, name, payload});
    }
  } catch(error) {
    yield put(<Action>{type: SET_SOCKET_STATUS, status: false, err: error})
  } finally {
    if (yield cancelled()) {
      // close the channel
      //@ts-ignore
      channel.close();
      // close the WebSocket connection
      //@ts-ignore
      socket.close();
    } else {
      yield put(<Action>{type: SET_SOCKET_STATUS, status: false})
    }
  }
}

export function* connect() {
  const startSocket: Action = yield take(START_SOCKET)
  // starts the task in the background
  let socketTask

  if (startSocket.type == START_SOCKET) {
    socketTask = yield fork(listenForSocketMessages, startSocket.url)
  }

  // when DISCONNECT action is dispatched, we cancel the socket task
  yield take(DISCONNECT);
  yield cancel(socketTask);
  yield put(<Action>{type: SET_DISCONNECT_STATUS, status: true})
}
