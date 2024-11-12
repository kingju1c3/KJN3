# API Documentation

## Overview

The Decentralized Network exposes a set of APIs for interacting with the network nodes and managing secure communications.

## Authentication

All API requests must include an authentication token in the Authorization header:

```http
Authorization: Bearer <your-token>
```

## Endpoints

### Node Status

```http
GET /.netlify/functions/node-status
```

Returns the current status of a specific node.

#### Parameters

| Name   | Type   | Description |
|--------|--------|-------------|
| nodeId | string | Node ID     |

#### Response

```json
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

### Network Metrics

```http
GET /.netlify/functions/network-metrics
```

Returns current network performance metrics.

#### Parameters

| Name  | Type   | Description     |
|-------|--------|-----------------|
| start | string | Start timestamp |
| end   | string | End timestamp   |

#### Response

```json
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