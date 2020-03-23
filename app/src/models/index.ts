export interface Payload {
}

type method = 'GET'|'POST'|'PUT'|'DELETE'|'PATCH'

export type Headers = {
  string: any
}

export type URLConfig = {
  url: string,
  method: method,
  headers: Headers
}

export type Request = {
  urlConfig: URLConfig,
  name: string,
  payload?: Payload
}

export type ConfigsState = {
  urls: {string: URLConfig},
  success: boolean,
  failure: boolean
}
