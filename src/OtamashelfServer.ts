import { IncomingMessage } from 'http';
import { Server, ServerOptions } from 'ws';
import OtamashelfWebSocket from './OtamashelfWebSocket';

export default class OtamashelfServer<
  T extends typeof OtamashelfWebSocket = typeof OtamashelfWebSocket,
  U extends typeof IncomingMessage = typeof IncomingMessage,
> extends Server<T, U> {
  constructor(options: ServerOptions<T, U>) {
    super({
      ...options,
      WebSocket: options.WebSocket || (OtamashelfWebSocket as T),
    });
  }
}
