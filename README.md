Getting Started
---------------

```

# Make it your own
rm -rf .git && git init && npm init

# Install dependencies
npm install

# Start development live-reload server
PORT=8080 npm run dev

# Start production server:
PORT=8080 npm start
#API

#list all streams
curl http://127.0.0.1:8080/api/pilipili | python -mjson.tool
#create stream with title
curl -X POST -H "Content-Type: application/json" -d '{"title":"class_1"}' http://127.0.0.1:8080/api/pilipili | python -mjson.tool
#delete stream with id
curl -X DELETE http://127.0.0.1:8080/api/pilipili/{id} | python -mjson.tool
#get stream with id
curl http://127.0.0.1:8080/api/pilipili/{id} | python -mjson.tool
```
License
-------

MIT
