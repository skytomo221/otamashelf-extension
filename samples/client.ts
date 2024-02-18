import { otmLoader } from 'otamashelf/extensions/otmLoader';

import OtamashelfWebSocket from '../src/OtamashelfWebSocket';

const client = new OtamashelfWebSocket('ws://127.0.0.1:3000');
client.on('error', console.error);
client.on('open', () => {
  client.registerExtension(otmLoader);
});
