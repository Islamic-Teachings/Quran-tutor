import { Observable } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { map, tap } from 'rxjs/operators';
import { Payload, Headers, Request } from '../models';
import { call, put, take, fork, cancel } from 'redux-saga/effects'
import { Action, SET_API_DATA, DISCONNECT } from './types';

const getData = <T>(url: string, headers?: Headers): Observable<T> => {
  return ajax.getJSON(url, headers)
}

const postData = <T>(url: string, payload: Payload, headers?: Headers): Observable<T> => {
  return ajax.post(url, payload, headers).pipe(
    map((res:AjaxResponse) => res.response)
  )
}

const putData = <T>(url: string, payload: Payload, headers?: Headers): Observable<T> => {
  return ajax.put(url, payload, headers).pipe(
    map((res:AjaxResponse) => res.response)
  )
}

const deleteData = <T>(url: string, headers?: Headers): Observable<T> => {
  return ajax.delete(url,headers).pipe(
    map((res:AjaxResponse) => res.response)
  )
}

const patchData = <T>(url: string, payload: Payload, headers?: Headers): Observable<T> => {
  return ajax.patch(url, payload, headers).pipe(
    map((res:AjaxResponse) => res.response)
  )
}

function* callAPITask<T extends Payload> (request: Request) {
  let reqGen: Observable<T>
  switch (request.urlConfig.method) {
    case 'GET':
      reqGen = yield call(getData, request.urlConfig.url, request.urlConfig.headers);
      break;
    case 'GET':
      reqGen = yield call(deleteData, request.urlConfig.url, request.urlConfig.headers);
      break;
    case 'POST':
      reqGen = yield call(postData, request.urlConfig.url, request.payload, request.urlConfig.headers);
      break;
    case 'PUT':
      reqGen = yield call(putData, request.urlConfig.url, request.payload, request.urlConfig.headers);
      break;
    case 'PUT':
      reqGen = yield call(patchData, request.urlConfig.url, request.payload, request.urlConfig.headers);
      break;
  }
  let res: T
  reqGen.pipe(
    tap((data: T) => {
      res = data
    })
  ).subscribe(_ => {
    put(<Action>{type: DISCONNECT})
  })
  yield put(<Action>{type: SET_API_DATA, res: res, name: request.name})
}

export function* callAPI(request: Request) {
  // starts the task in the background
  const apiTask = yield fork(callAPITask, request);
  yield take(DISCONNECT);
  yield cancel(apiTask);
}
