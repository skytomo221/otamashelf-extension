import OtamashelfServer from '../src/OtamashelfServer';

const server = new OtamashelfServer({ port: 3000 });
server.on('error', console.error);
server.on('connection', function connection(ws) {
  console.log('connected');
  ws.on('message', message => console.log(message.toString()));
  ws.onRegisteringExtension(extension => {
    console.log('extension →', extension);
    console.log('extension.configuration() →', extension.configuration());
  }, console.error);
});
