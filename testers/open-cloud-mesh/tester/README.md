# Open Cloud Mesh Tests (under construction)
Surface tests for Open Cloud Mesh (under construction)

## Usage
### In development
Start your server with a self-signed cert on port 443 of localhost and run:
```sh
NODE_TLS_REJECT_UNAUTHORIZED=0 SERVER_ROOT=https://localhost npm run jest
```

### Against production
```sh
SERVER_ROOT=https://example.com npm run jest
```
