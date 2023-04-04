const store = {};

self.addEventListener('message', function (event) {
    let data = event.data.data;
    let cmd = event.data.cmd;
    switch (cmd) {
        case 'ws-init':
            store.ws = new WebSocket(data);
            let ws = store.ws;
            ws.onopen = function () {
                self.postMessage({ cmd: 'ws-open' });
            };
            ws.onclose = function (e) {
                self.postMessage({ cmd: 'ws-close', data: e.code });
            };
            ws.onerror = function (e) {
                self.postMessage({ cmd: 'ws-error', data: e });
            };
            ws.onmessage = function (e) {
                const response = e.data.split(/,(.+)/);
                const cmd = response[0];
                const data = response[1];
                self.postMessage({ cmd: 'ws-message', data: { cmd, data } });
                return false;
            };
            break;
        case 'ws-send':
            if (store.ws.readyState === WebSocket.OPEN) {
                store.ws.send(JSON.stringify(data));
            } else {
                self.postMessage({ cmd: 'ws-error', data: 'WebSocket Closed' });
            }
            break;
        case 'ws-close':
            store.ws.close(4000);
            break;
    }
});
