import { Payload } from '../models'
export const SET_MESSAGE_PAYLOAD = 'SET_MESSAGE_PAYLOAD'
export const DISCONNECT = 'DISCONNECT'
export const DELETE_MESSAGE = 'DELETE_MESSAGE'
export const GET_CONFIGS = 'GET_CONFIGS'
export const OPEN_SOCKET = 'OPEN_SOCKET'
export const CALL = 'CALL'
export const SET_SOCKET_STATUS = 'SET_SOCKET_STATUS'
export const SET_DISCONNECT_STATUS = 'SET_DISCONNECT_STATUS'
export const SET_API_DATA = 'SET_API_DATA'

type SetMessagePayload = {
  type: typeof SET_MESSAGE_PAYLOAD
  payload: Payload | string,
  name: string
}

type OpenSocketAction = {
  type: typeof OPEN_SOCKET
  url: string
}

type SetSocketStatusAction = {
  type: typeof SET_SOCKET_STATUS | typeof SET_DISCONNECT_STATUS,
  status: boolean,
  err?: Error
}

type CallAPIAction = {
  type: typeof CALL,
  name: string,
  payload?: Payload,
  error?: Error,
  res?: Payload
}

type SetCallAPIDataAction = {
  type: typeof SET_API_DATA,
  name: string,
  error?: Error,
  res?: Payload
}

type DisconnectAction = {
  type: typeof DISCONNECT
}

export type Action = SetMessagePayload | OpenSocketAction | SetSocketStatusAction | CallAPIAction | SetCallAPIDataAction | DisconnectAction
