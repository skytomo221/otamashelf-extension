import * as net from 'net';

import PageExplorer from 'otamashelf/PageExplorer';

export default abstract class RemotePageExplorer extends PageExplorer {
  // eslint-disable-next-line no-undef
  [key: string]: any;

  activate(port: number): void {
    const client: net.Socket = net.connect(port, 'localhost');
    client.on('data', async (buffer: { toString: () => string }) => {
      const data = JSON.parse(buffer.toString());
      const { action } = data;
      const result = await this.call(action, data);
      client.write(JSON.stringify({ action, data: result }));
    });
  }

  private call(action: string, data: any): any {
    return action === 'properties' ? this.properties : this[action](data);
  }
}
