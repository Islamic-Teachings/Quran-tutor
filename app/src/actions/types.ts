import { Payload, Request } from '../models'
export const SET_MESSAGE_PAYLOAD = 'SET_MESSAGE_PAYLOAD'
export const DISCONNECT = 'DISCONNECT'
export const DELETE_MESSAGE = 'DELETE_MESSAGE'
export const OPEN_SOCKET = 'OPEN_SOCKET'
export const SET_SOCKET_STATUS = 'SET_SOCKET_STATUS'
export const SET_DISCONNECT_STATUS = 'SET_DISCONNECT_STATUS'
export const SEND_MESSAGE = 'SEND_MESSAGE'
export const START_SOCKET = 'START_SOCKET'

type SetMessagePayload = {
  type: typeof SET_MESSAGE_PAYLOAD
  payload: Payload | Payload[],
  name: string
}

type OpenSocketAction = {
  type: typeof OPEN_SOCKET
  url: string
}

type SetSocketStatusAction = {
  type: typeof SET_SOCKET_STATUS | typeof SET_DISCONNECT_STATUS,
  status: boolean,
  name: string,
  err?: Error
}

type DisconnectAction = {
  type: typeof DISCONNECT,
}

type SendMessageAction = {
  type: typeof SEND_MESSAGE,
  request: Request
}

type StartSocket = {
  type: typeof START_SOCKET,
  url: string
}

export type Action = SetMessagePayload | OpenSocketAction | SetSocketStatusAction | DisconnectAction | SendMessageAction | StartSocket
