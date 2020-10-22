And experiment to proxy http and websocket requests and provide an API to mess with websocket connections.

Assuming the proxy is listening on 8015 you can disconnect existing websocket connections and disallow new ones like this:

```
$ curl -d '' http://localhost:8015/disconnect-sockets
```

Once in the disconnected state the proxy will hang on to new incoming connections and not respond to them until it is told to reconnect again. Like this:

```
$ curl -d '' http://localhost:8015/reconnect-sockets
```

Now new connections can be made.

Useful for things like end to end tests that have to make sure that a UI works properly when the connection goes down and comes back up again.
