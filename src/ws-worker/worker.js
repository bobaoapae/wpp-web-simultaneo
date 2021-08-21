const store = {};

addEventListener('message', function (event) {
    let data = event.data.data;
    let cmd = event.data.cmd;
    switch (cmd) {
        case 'ws-init':
            store.ws = new WebSocket(data);
            store.ws.onopen = function () {
                postMessage({ cmd: 'ws-open' });
            };
            store.ws.onclose = function (e) {
                postMessage({ cmd: 'ws-close', data: e.code });
            };
            store.ws.onerror = function (e) {
                postMessage({ cmd: 'ws-error', data: e });
            };
            store.ws.onmessage = function (e) {
                const response = e.data.split(/,(.+)/);
                const cmd = response[0];
                const data = response[1];
                postMessage({ cmd: 'ws-message', data: { cmd: cmd, data: data } });
                return false;
            };
            break;
        case 'ws-send':
            if (store.ws.readyState === WebSocket.OPEN) {
                store.ws.send(JSON.stringify(data));
            } else {
                postMessage({ cmd: 'ws-error', data: 'WebSocket Closed' });
            }
            break;
        case 'ws-close':
            store.ws.close(4000);
            break;
    }
});
