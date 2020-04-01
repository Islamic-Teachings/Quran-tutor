export interface Payload {
  name: string
}

type Method = 'GET'|'POST'|'PUT'|'DELETE'|'PATCH'

type Headers = {
  [key:string]: any
}

export type Request = {
  name: string,
  method: Method,
  api: string,
  body?: Payload,
  id?: string,
  headers?: Headers,
  query?: Headers
}
