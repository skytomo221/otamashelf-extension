import { Server, WebSocket } from 'ws';
import { Extension } from 'otamashelf/Extension';
import { ExtensionProperties } from 'otamashelf/ExtensionProperties';
import {
  BookLoader,
  BookLoaderProperties,
  LoadProps,
  LoadReturns,
} from 'otamashelf/BookLoader';
import { Json } from 'otamashelf/Json';
import { ConfigurationReturns } from 'otamashelf/ExtensionBase';
import {
  CreateProps as BookCreateProps,
  CreateReturns as BookCreateReturns,
  TemplateProps as BookTemplateProps,
  TemplateReturns as BookTemplateReturns,
} from 'otamashelf/BookCreator';
import {
  DiscriminateProps,
  DiscriminateReturns,
} from 'otamashelf/BookDiscriminator';
import { UpdateBookProps, UpdateBookReturns } from 'otamashelf/BookModifier';
import { SaveProps, SaveReturns } from 'otamashelf/BookSaver';
import { LayoutProps, LayoutReturns } from 'otamashelf/LayoutBuilder';
import {
  DecorateLayoutProps,
  DecorateLayoutReturns,
} from 'otamashelf/LayoutDecorator';
import {
  TemplateProps as PageTemplateProps,
  TemplateReturns as PageTemplateReturns,
  CreateProps as PageCreateProps,
  CreateReturns as PageCreateReturns,
} from 'otamashelf/PageCreator';
import {
  DecoratorPageProps,
  DecoratorPageReturns,
} from 'otamashelf/PageDecorator';
import { Page } from 'otamashelf/Page';
import {
  NameProps,
  NameReturns,
  SearchProps,
  SearchReturns,
} from 'otamashelf/PageExplorer';
import { ModifyProps, ModifyReturns } from 'otamashelf/PageModifier';
import { GenerateProps, GenerateReturns } from 'otamashelf/IndexGenerator';
import { StyleReturns } from 'otamashelf/StyleTheme';
import { RegisterExtension, Response } from './Message';

export default class OtamashelfServer extends Server {
  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'configuration',
  ): Promise<ConfigurationReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'load',
    params: LoadProps,
  ): Promise<LoadReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'template',
    params: BookTemplateProps,
  ): Promise<BookTemplateReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'create',
    params: BookCreateProps,
  ): Promise<BookCreateReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'discriminate',
    params: DiscriminateProps,
  ): Promise<DiscriminateReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'load',
    params: LoadProps,
  ): Promise<LoadReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'modify',
    params: UpdateBookProps,
  ): Promise<UpdateBookReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'save',
    params: SaveProps,
  ): Promise<SaveReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'layout',
    params: LayoutProps,
  ): Promise<LayoutReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'decorateLayout',
    params: DecorateLayoutProps,
  ): Promise<DecorateLayoutReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'template',
    params: PageTemplateProps,
  ): Promise<PageTemplateReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'create',
    params: PageCreateProps,
  ): Promise<PageCreateReturns>;

  call<P extends Page>(
    webSocket: WebSocket,
    extensionId: string,
    event: 'decoratePage',
    params: DecoratorPageProps<P>,
  ): Promise<DecoratorPageReturns<P>>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'decoratePage',
    params: NameProps,
  ): Promise<NameReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'decoratePage',
    params: NameProps,
  ): Promise<NameReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'save',
    params: SearchProps,
  ): Promise<SearchReturns>;

  call<P extends Page>(
    webSocket: WebSocket,
    extensionId: string,
    event: 'modify',
    params: ModifyProps<P>,
  ): Promise<ModifyReturns<P>>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'name',
    params: NameProps,
  ): Promise<NameReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'generate',
    params: GenerateProps,
  ): Promise<GenerateReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: 'style',
  ): Promise<StyleReturns>;

  call(
    webSocket: WebSocket,
    extensionId: string,
    event: string,
    params?: Json | DecorateLayoutProps | SearchProps,
  ) {
    const method = `${extensionId}.${event}`;
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      const listener = (data: { toString: () => string }) => {
        const response: Response = JSON.parse(data.toString());
        if (response.id === id) {
          webSocket.off('message', listener);
          if ('result' in response) {
            resolve(response.result);
          } else {
            reject(response.error);
          }
        }
      };
      webSocket.on('message', listener);
      this.clients.forEach(client => {
        client.send(
          JSON.stringify({
            jsonrpc: '2.0',
            method,
            params,
            id,
          }),
        );
      });
    });
  }

  async createBookLoader(
    webSocket: WebSocket,
    properties: BookLoaderProperties,
  ): Promise<BookLoader> {
    const configurationReturns = await this.call(
      webSocket,
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const load = (props: LoadProps): Promise<LoadReturns> =>
      this.call(webSocket, properties.id, 'load', props);
    return { properties, configuration, load };
  }

  createExtension(webSocket: WebSocket, properties: ExtensionProperties) {
    switch (properties.type) {
      case 'book-creator':
        break;
      case 'book-discriminator':
        break;
      case 'book-loader':
        return this.createBookLoader(webSocket, properties);
      default:
        break;
    }
    return null;
  }

  onRegisteringExtension(
    webSocket: WebSocket,
    listener?: (extension: Extension) => void,
    errorListener?: (error: unknown) => void,
  ) {
    webSocket.on('message', data => {
      try {
        const request: RegisterExtension = JSON.parse(data.toString());
        if (request.method !== 'register-extension') return;
        request.params.forEach(properties => {
          this.createExtension(webSocket, properties)
            ?.then(listener)
            .catch(errorListener);
        });
      } catch (error) {
        if (errorListener) errorListener(error);
      }
    });
  }
}
