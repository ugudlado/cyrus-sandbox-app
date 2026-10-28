# API reference

All endpoints return JSON (`content-type: application/json`). Examples assume the server runs locally on the default port (`npm start`, `PORT=3000`).

## GET /

Returns the app name.

Request:

```sh
curl -i http://localhost:3000/
```

Response:

```http
HTTP/1.1 200 OK
content-type: application/json

{"name":"cyrus-sandbox-app"}
```

## GET /health

Health check.

Request:

```sh
curl -i http://localhost:3000/health
```

Response:

```http
HTTP/1.1 200 OK
content-type: application/json

{"status":"ok","ok":true}
```

## GET /ping

Liveness ping.

Request:

```sh
curl -i http://localhost:3000/ping
```

Response:

```http
HTTP/1.1 200 OK
content-type: application/json

{"pong":true}
```

## GET /hello

Greeting.

Request:

```sh
curl -i http://localhost:3000/hello
```

Response:

```http
HTTP/1.1 200 OK
content-type: application/json

{"hello":"world"}
```

## GET /version

App version.

Request:

```sh
curl -i http://localhost:3000/version
```

Response:

```http
HTTP/1.1 200 OK
content-type: application/json

{"version":"0.1.2"}
```

## Any other path

Unknown paths and methods return 404.

Request:

```sh
curl -i http://localhost:3000/nope
```

Response:

```http
HTTP/1.1 404 Not Found
content-type: application/json

{"error":"not found"}
```

## Request log

The server logs one line per request to stdout in the form `METHOD path status durationms`, for example:

```
GET /ping 200 0.4ms
```
