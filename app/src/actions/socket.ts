import * as WebSocket from 'ws'
import { eventChannel, END, EventChannel } from 'redux-saga';
import { call, put, take, fork, cancel, cancelled } from 'redux-saga/effects'
import { Action, SET_SOCKET_STATUS, SET_MESSAGE_PAYLOAD, DISCONNECT, SET_DISCONNECT_STATUS } from './types';

export const createWebSocketConnection = (url: string) => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url)
    socket.onopen = _ => {
      resolve(socket)
    }
    socket.onclose = err => {
      reject(err)
    }
  })
}

export const createSocketChannel = (socket: WebSocket) => {
  return eventChannel((emit: any) => {
    socket.onmessage = e => {
      emit(e.data)
    }

    socket.onclose = _ => {
      emit(END);
    }

    return () =>  {
      socket.onmessage = null
    }
  })
}

function* listenForSocketMessages(name: string, url: string) {
  let socket: WebSocket
  let channel: EventChannel<any>

  try {
    socket  = yield call(createWebSocketConnection, url);
    channel = yield call(createSocketChannel, socket);
    yield put(<Action>{type: SET_SOCKET_STATUS, status: true})
    while (true) {
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
      channel.close();
      // close the WebSocket connection
      socket.close();
    } else {
      yield put(<Action>{type: SET_SOCKET_STATUS, status: false})
    }
  }
}

export function* connect(name: string, url: string) {
  // starts the task in the background
  const socketTask = yield fork(listenForSocketMessages, name, url);

  // when DISCONNECT action is dispatched, we cancel the socket task
  yield take(DISCONNECT);
  yield cancel(socketTask);
  yield put(<Action>{type: SET_DISCONNECT_STATUS, status: true})
}
