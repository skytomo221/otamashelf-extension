import { otmLoader } from 'otamashelf/extensions/otmLoader';

import OtamashelfClient from '../src/OtamashelfClient';

const client = new OtamashelfClient('ws://127.0.0.1:3000');
client.on('error', console.error);
client.on('open', () => {
  client.registerExtension(otmLoader);
});
