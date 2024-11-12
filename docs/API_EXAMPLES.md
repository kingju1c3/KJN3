# API Examples

## Node Status

Get the status of a specific node:

```http
GET /.netlify/functions/node-status?nodeId=node-123

Response:
{
  "nodeId": "node-123",
  "status": "active",
  "lastSeen": "2023-11-15T12:00:00Z",
  "metrics": {
    "cpu": 45,
    "memory": 60,
    "network": 80
  }
}
```

## Network Metrics

Get network performance metrics:

```http
GET /.netlify/functions/network-metrics

Response:
{
  "success": true,
  "data": {
    "activeNodes": 25,
    "metrics": {
      "throughput": {
        "current": 750,
        "history": []
      },
      "latency": {
        "current": 30,
        "history": []
      }
    }
  }
}
```

## Authentication

Authenticate a user:

```http
POST /.netlify/functions/authenticate
Content-Type: application/json

{
  "username": "user123",
  "password": "secure-password"
}

Response:
{
  "token": "jwt-token",
  "userId": "user-123",
  "clearanceLevel": "SECRET",
  "expiresAt": "2023-11-16T12:00:00Z"
}
```