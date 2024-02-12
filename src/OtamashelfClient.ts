import { Extension } from 'otamashelf/Extension';
import WebSocket from 'ws';

import { Request } from './Message';

export default class OtamashelfClient extends WebSocket {
  registerExtension(extension: Extension) {
    this.send(
      JSON.stringify({
        jsonrpc: '2.0',
        method: 'register',
        params: extension.properties,
      }),
    );
    const { properties } = extension;
    const { id: extensionId } = properties;
    this.on('message', (request: Request) => {
      const { jsonrpc, id } = request;
      try {
        const [requestExtensionId, method] = request.method.split('.');
        if (requestExtensionId === extensionId && method in extension) {
          const result = (extension as any)[method](request.params);
          this.send(JSON.stringify({ jsonrpc, result, id }));
        }
      } catch (error) {
        this.send(JSON.stringify({ jsonrpc, error, id }));
      }
    });
    return this;
  }
}
