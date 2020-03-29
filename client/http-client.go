package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/Islamic-Teachings/Quran-tutor/promise"
)

// HTTPClient wrapper around http client
type HTTPClient struct {
	baseURL    *url.URL
	httpClient *http.Client
}

// Response is the return of http call
type Response struct {
	Data   interface{} `json:"data"`
	Status int         `json:"status"`
}

// Handle performs get call to get data.
func (client *HTTPClient) Handle(url, method string, headers map[string]interface{}, body interface{}) promise.Promise {
	return promise.FromFunc(func() (interface{}, error) {
		req, err := createRequest(url, method, body)
		if err != nil {
			return nil, err
		}
		req.Header.Set("Accept", "application/json")
		for headerName, headerValue := range headers {
			req.Header.Set(headerName, headerValue.(string))
		}
		resp, err := client.httpClient.Do(req)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()
		var data interface{}
		err = json.NewDecoder(resp.Body).Decode(&data)
		return Response{Data: data, Status: resp.StatusCode}, err
	})
}

func createRequest(url, method string, body interface{}) (*http.Request, error) {
	var reqBody io.Reader
	if method == "POST" || method == "PUT" || method == "PATCH" {
		var err error
		reqBody, err = createBody(body)
		if err != nil {
			return nil, err
		}
	}
	switch method {
	case "GET":
		return http.NewRequest("GET", url, nil)
	case "DELETE":
		return http.NewRequest("DELETE", url, nil)
	case "POST":
		return http.NewRequest("POST", url, reqBody)
	case "PUT":
		return http.NewRequest("PUT", url, reqBody)
	case "PATCH":
		return http.NewRequest("PATCH", url, reqBody)
	}
	return nil, fmt.Errorf("Couldn't build request")
}

func createBody(body interface{}) (io.Reader, error) {
	var buf io.ReadWriter
	if body != nil {
		buf = new(bytes.Buffer)
		err := json.NewEncoder(buf).Encode(body)
		if err != nil {
			return nil, err
		}
	}
	return buf, nil
}
