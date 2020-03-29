package socket

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/Islamic-Teachings/Quran-tutor/client"
	"github.com/gorilla/websocket"
)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type request struct {
	Method  string                 `json:"method"`
	Body    interface{}            `json:"body"`
	API     string                 `json:"api"`
	ID      string                 `json:"id"`
	Headers map[string]interface{} `json:"headers"`
	Query   map[string]interface{} `json:"query"`
}

// Socket wrapper ws socket
type Socket struct {
	httpClient *client.HTTPClient
	edgeURL    string
}

const edgeServiceURL = "http://localhost:9000"

// NewSocket creates sockets
func NewSocket(prodURL string) *Socket {
	s := new(Socket)
	s.httpClient = new(client.HTTPClient)
	if prodURL != "" {
		s.edgeURL = prodURL
	} else {
		s.edgeURL = edgeServiceURL
	}
	return s
}

func (s *Socket) wshandler(w http.ResponseWriter, r *http.Request) {
	conn, err := wsupgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatalln(fmt.Errorf("Failed to set websocket upgrade:\n%w", err))
		return
	}

	for {
		t, msg, err := conn.ReadMessage()
		var req request
		if err != nil {
			break
		}
		err = json.Unmarshal(msg, &req)
		if err != nil {
			errMsg, err := json.Marshal(client.Response{Data: "Error parsing request", Status: 500})
			if err != nil {
				break
			}
			conn.WriteMessage(t, errMsg)
		}
		s.httpClient.Handle(s.buildURL(req), req.Method, req.Headers, req.Body).Then(func(res interface{}) (interface{}, error) {
			resMsg, err := json.Marshal(res.(client.Response))
			conn.WriteMessage(t, resMsg)
			return resMsg, err
		}).Catch(func(err error) {
			errMsg, _ := json.Marshal(client.Response{Data: "Error parsing request", Status: 500})
			conn.WriteMessage(t, errMsg)
		})
	}
}

func (s *Socket) buildURL(req request) string {
	query := ""
	if req.Query != nil {
		for k, v := range req.Query {
			query = query + "?" + k + "=" + v.(string)
		}
	}
	id := ""
	if req.ID != "" {
		id = "/" + req.ID
	}
	url := s.edgeURL
	url = url + "/" + id + query
	return url
}
