# Backend
## How to run
1. Install node.js (reasonably new 16+)
2. npm i
3. Setup .env and as:
```
IP=<Your IP>
PORT=5000
PAGE_SIZE=20

# Generate both of these with require('crypto').randomBytes(128).toString('hex') make sure both are different!
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

# Accordingly as needed...
DB_NAME= 
DB_USER=
DB_HOST=
DB_PASSWD=
DB_PORT=
```
4. npm run dev