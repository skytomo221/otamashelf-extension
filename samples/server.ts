import OtamashelfServer from '../src/OtamashelfServer';

const server = new OtamashelfServer({ port: 3000 });
server.on('error', console.error);
server.on('open', function open() {
  console.log('connected');
});
console.log('start');
server.on('connection', function connection(ws) {
  console.log('connected');
  ws.on('message', message => console.log(message.toString()));
  server.onRegisteringExtension(ws, extension => {
    console.log(extension);
  }, console.error);
});
