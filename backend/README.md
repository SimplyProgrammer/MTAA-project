# Backend
## How to run
1. Install node.js (reasonably new 16+)
2. npm i
3. Setup .env and as:
```
IP=<Your IP>
PORT=5000
PAGE_SIZE=20

# Generate both of these with node and require('crypto').randomBytes(128).toString('hex')!
ACCESS_TOKEN_SECRET=

# Accordingly as needed...
DB_NAME= 
DB_USER=
DB_HOST=
DB_PASSWD=
DB_PORT=

Or use this:
DATABASE_URL=
```
4. npm run dev