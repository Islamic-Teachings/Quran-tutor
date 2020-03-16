FROM golang:latest

RUN mkdir /go/src/app

RUN go get -u github.com/golang/dep/cmd/dep

ADD . /go/src/app

COPY ./Gopkg.toml /go/src/app

WORKDIR /go/src/app

RUN dep ensure
RUN go test -v
RUN go build -o main .

CMD ["/go/src/app/main"]
