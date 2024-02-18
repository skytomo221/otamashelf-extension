import { Extension } from 'otamashelf/Extension';
import WebSocket from 'ws';

import { Json } from 'otamashelf/Json';
import { ConfigurationReturns } from 'otamashelf/ExtensionBase';
import {
  CreateProps as BookCreateProps,
  CreateReturns as BookCreateReturns,
  BookCreator,
  BookCreatorProperties,
  TemplateProps as BookTemplateProps,
  TemplateReturns as BookTemplateReturns,
} from 'otamashelf/BookCreator';
import {
  BookDiscriminator,
  BookDiscriminatorProperties,
  DiscriminateProps,
  DiscriminateReturns,
} from 'otamashelf/BookDiscriminator';
import {
  BookModifier,
  BookModifierProperties,
  UpdateBookProps,
  UpdateBookReturns,
} from 'otamashelf/BookModifier';
import {
  BookSaver,
  BookSaverProperties,
  SaveProps,
  SaveReturns,
} from 'otamashelf/BookSaver';
import {
  LayoutBuilder,
  LayoutBuilderProperties,
  LayoutProps,
  LayoutReturns,
} from 'otamashelf/LayoutBuilder';
import {
  DecorateLayoutProps,
  DecorateLayoutReturns,
  LayoutDecorator,
  LayoutDecoratorProperties,
} from 'otamashelf/LayoutDecorator';
import {
  TemplateProps as PageTemplateProps,
  TemplateReturns as PageTemplateReturns,
  CreateProps as PageCreateProps,
  CreateReturns as PageCreateReturns,
  PageCreatorProperties,
  PageCreator,
} from 'otamashelf/PageCreator';
import {
  DecoratorPageProps,
  DecoratorPageReturns,
  PageDecorator,
  PageDecoratorProperties,
} from 'otamashelf/PageDecorator';
import { Page } from 'otamashelf/Page';
import {
  NameProps,
  NameReturns,
  PageExplorer,
  PageExplorerProperties,
  SearchProps,
  SearchReturns,
} from 'otamashelf/PageExplorer';
import {
  ModifyProps,
  ModifyReturns,
  PageModifier,
  PageModifierProperties,
} from 'otamashelf/PageModifier';
import {
  GenerateProps as IndexGenerateProps,
  GenerateReturns as IndexGenerateReturns,
  IndexGenerator,
  IndexGeneratorProperties,
} from 'otamashelf/IndexGenerator';
import {
  StyleReturns,
  StyleTheme,
  StyleThemeProperties,
} from 'otamashelf/StyleTheme';
import {
  LoadProps,
  LoadReturns,
  BookLoaderProperties,
  BookLoader,
} from 'otamashelf/BookLoader';
import { ExtensionProperties } from 'otamashelf/ExtensionProperties';
import {
  SearchIndexGenerator,
  SearchIndexGeneratorProperties,
  GenerateProps as SearchIndexGenerateProps,
  GenerateReturns as SearchIndexGenerateReturns,
} from 'otamashelf/SearchIndexGenerator';
import {
  ConvertProps,
  ConvertReturns,
  TextConverter,
  TextConverterProperties,
} from 'otamashelf/TextConverter';
import { RegisterExtension, Request, Response } from './Message';

export default class OtamashelfWebSocket extends WebSocket {
  registerExtension(extension: Extension) {
    this.send(
      JSON.stringify({
        jsonrpc: '2.0',
        method: 'register-extension',
        params: [extension.properties],
      }),
    );
    const { properties } = extension;
    const { id: extensionId } = properties;
    this.on('message', data => {
      const request: Request = JSON.parse(data.toString());
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

  call(
    extensionId: string,
    event: 'configuration',
  ): Promise<ConfigurationReturns>;
  call(
    extensionId: string,
    event: 'load',
    params: LoadProps,
  ): Promise<LoadReturns>;

  call(
    extensionId: string,
    event: 'template',
    params: BookTemplateProps,
  ): Promise<BookTemplateReturns>;

  call(
    extensionId: string,
    event: 'create',
    params: BookCreateProps,
    _type: 'book-creator',
  ): Promise<BookCreateReturns>;

  call(
    extensionId: string,
    event: 'discriminate',
    params: DiscriminateProps,
  ): Promise<DiscriminateReturns>;

  call(
    extensionId: string,
    event: 'load',
    params: LoadProps,
  ): Promise<LoadReturns>;

  call(
    extensionId: string,
    event: 'modify',
    params: UpdateBookProps,
  ): Promise<UpdateBookReturns>;

  call(
    extensionId: string,
    event: 'save',
    params: SaveProps,
  ): Promise<SaveReturns>;

  call(
    extensionId: string,
    event: 'layout',
    params: LayoutProps,
  ): Promise<LayoutReturns>;

  call(
    extensionId: string,
    event: 'decorateLayout',
    params: DecorateLayoutProps,
  ): Promise<DecorateLayoutReturns>;

  call(
    extensionId: string,
    event: 'template',
    params: PageTemplateProps,
  ): Promise<PageTemplateReturns>;

  call(
    extensionId: string,
    event: 'create',
    params: PageCreateProps,
    _type: 'page-creator',
  ): Promise<PageCreateReturns>;

  call<P extends Page>(
    extensionId: string,
    event: 'decoratePage',
    params: DecoratorPageProps<P>,
  ): Promise<DecoratorPageReturns<P>>;

  call(
    extensionId: string,
    event: 'decoratePage',
    params: NameProps,
  ): Promise<NameReturns>;

  call(
    extensionId: string,
    event: 'decoratePage',
    params: NameProps,
  ): Promise<NameReturns>;

  call(
    extensionId: string,
    event: 'save',
    params: SearchProps,
  ): Promise<SearchReturns>;

  call<P extends Page>(
    extensionId: string,
    event: 'modify',
    params: ModifyProps<P>,
  ): Promise<ModifyReturns<P>>;

  call(
    extensionId: string,
    event: 'name',
    params: NameProps,
  ): Promise<NameReturns>;

  call(
    extensionId: string,
    event: 'search',
    params: SearchProps,
  ): Promise<SearchReturns>;

  call(
    extensionId: string,
    event: 'generate',
    params: IndexGenerateProps,
    _type: 'index-generator',
  ): Promise<IndexGenerateReturns>;

  call(
    extensionId: string,
    event: 'generate',
    params: SearchIndexGenerateProps,
    _type: 'search-index-generator',
  ): Promise<SearchIndexGenerateReturns>;

  call(extensionId: string, event: 'style'): Promise<StyleReturns>;

  call(
    extensionId: string,
    event: 'convert',
    params: ConvertProps,
  ): Promise<ConvertReturns>;

  call(
    extensionId: string,
    event: string,
    params?: Json | DecorateLayoutProps | SearchProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _type?: string,
  ) {
    const method = `${extensionId}.${event}`;
    return new Promise((resolve, reject) => {
      const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      const listener = (data: { toString: () => string }) => {
        const response: Response = JSON.parse(data.toString());
        if (response.id === id) {
          this.off('message', listener);
          if ('result' in response) {
            resolve(response.result);
          } else {
            reject(response.error);
          }
        }
      };
      this.on('message', listener);
      this.send(
        JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id,
        }),
      );
    });
  }

  async createBookCreator(
    properties: BookCreatorProperties,
  ): Promise<BookCreator> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const template = (props: BookTemplateProps): Promise<BookTemplateReturns> =>
      this.call(properties.id, 'template', props);
    const create = (props: BookCreateProps): Promise<BookCreateReturns> =>
      this.call(properties.id, 'create', props, 'book-creator');
    return { properties, configuration, template, create };
  }

  async createBookDiscriminator(
    properties: BookDiscriminatorProperties,
  ): Promise<BookDiscriminator> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const discriminate = (
      props: DiscriminateProps,
    ): Promise<DiscriminateReturns> =>
      this.call(properties.id, 'discriminate', props);
    return { properties, configuration, discriminate };
  }

  async createBookLoader(
    properties: BookLoaderProperties,
  ): Promise<BookLoader> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const load = (props: LoadProps): Promise<LoadReturns> =>
      this.call(properties.id, 'load', props);
    return { properties, configuration, load };
  }

  async createBookModidier(
    properties: BookModifierProperties,
  ): Promise<BookModifier> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const modify = (props: UpdateBookProps): Promise<UpdateBookReturns> =>
      this.call(properties.id, 'modify', props);
    return { properties, configuration, modify };
  }

  async createBookSaver(properties: BookSaverProperties): Promise<BookSaver> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const save = (props: SaveProps): Promise<SaveReturns> =>
      this.call(properties.id, 'save', props);
    return { properties, configuration, save };
  }

  async createIndexGenerator(
    properties: IndexGeneratorProperties,
  ): Promise<IndexGenerator> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const generate = (
      props: IndexGenerateProps,
    ): Promise<IndexGenerateReturns> =>
      this.call(properties.id, 'generate', props, 'index-generator');
    return { properties, configuration, generate };
  }

  async createLayoutBuilder(
    properties: LayoutBuilderProperties,
  ): Promise<LayoutBuilder> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const layout = (props: LayoutProps): Promise<LayoutReturns> =>
      this.call(properties.id, 'layout', props);
    return { properties, configuration, layout };
  }

  async createLayoutDecorator(
    properties: LayoutDecoratorProperties,
  ): Promise<LayoutDecorator> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const decorateLayout = (
      props: DecorateLayoutProps,
    ): Promise<DecorateLayoutReturns> =>
      this.call(properties.id, 'decorateLayout', props);
    return { properties, configuration, decorateLayout };
  }

  async createPageCreator(
    properties: PageCreatorProperties,
  ): Promise<PageCreator> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const template = (props: PageTemplateProps): Promise<PageTemplateReturns> =>
      this.call(properties.id, 'template', props);
    const create = (props: PageCreateProps): Promise<PageCreateReturns> =>
      this.call(properties.id, 'create', props, 'page-creator');
    return { properties, configuration, template, create };
  }

  async createPageDecorator(
    properties: PageDecoratorProperties,
  ): Promise<PageDecorator> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const decoratePage = <P extends Page>(
      props: DecoratorPageProps<P>,
    ): Promise<DecoratorPageReturns<P>> =>
      this.call(properties.id, 'decoratePage', props);
    return { properties, configuration, decoratePage };
  }

  async createPageExplorer(
    properties: PageExplorerProperties,
  ): Promise<PageExplorer> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const name = (props: NameProps): Promise<NameReturns> =>
      this.call(properties.id, 'name', props);
    const search = (props: SearchProps): Promise<SearchReturns> =>
      this.call(properties.id, 'search', props);
    return { properties, configuration, name, search };
  }

  async createPageModifier(
    properties: PageModifierProperties,
  ): Promise<PageModifier> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const modify = <P extends Page>(
      props: ModifyProps<P>,
    ): Promise<ModifyReturns<P>> => this.call(properties.id, 'modify', props);
    return { properties, configuration, modify };
  }

  async createSearchIndexGenerator(
    properties: SearchIndexGeneratorProperties,
  ): Promise<SearchIndexGenerator> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const name = (props: NameProps): Promise<NameReturns> =>
      this.call(properties.id, 'name', props);
    const generate = (
      props: SearchIndexGenerateProps,
    ): Promise<SearchIndexGenerateReturns> =>
      this.call(properties.id, 'generate', props, 'search-index-generator');
    return { properties, configuration, name, generate };
  }

  async createStyleTheme(
    properties: StyleThemeProperties,
  ): Promise<StyleTheme> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const style = (): Promise<StyleReturns> =>
      this.call(properties.id, 'style');
    return { properties, configuration, style };
  }

  async createTextConverter(
    properties: TextConverterProperties,
  ): Promise<TextConverter> {
    const configurationReturns = await this.call(
      properties.id,
      'configuration',
    );
    const configuration = () => configurationReturns;
    const convert = (props: ConvertProps): Promise<ConvertReturns> =>
      this.call(properties.id, 'convert', props);
    return { properties, configuration, convert };
  }

  createExtension(properties: ExtensionProperties) {
    switch (properties.type) {
      case 'book-creator':
        return this.createBookCreator(properties);
      case 'book-discriminator':
        return this.createBookDiscriminator(properties);
      case 'book-loader':
        return this.createBookLoader(properties);
      case 'book-modifier':
        return this.createBookModidier(properties);
      case 'book-saver':
        return this.createBookSaver(properties);
      case 'index-generator':
        return this.createIndexGenerator(properties);
      case 'layout-builder':
        return this.createLayoutBuilder(properties);
      case 'layout-decorator':
        return this.createLayoutDecorator(properties);
      case 'page-creator':
        return this.createPageCreator(properties);
      case 'page-decorator':
        return this.createPageDecorator(properties);
      case 'page-explorer':
        return this.createPageExplorer(properties);
      case 'page-modifier':
        return this.createPageModifier(properties);
      case 'search-index-generator':
        return this.createSearchIndexGenerator(properties);
      case 'style-theme':
        return this.createStyleTheme(properties);
      case 'text-converter':
        return this.createTextConverter(properties);
      default:
        break;
    }
    return null;
  }

  onRegisteringExtension(
    listener?: (extension: Extension) => void,
    errorListener?: (error: unknown) => void,
  ) {
    this.on('message', data => {
      try {
        const request: RegisterExtension = JSON.parse(data.toString());
        if (request.method !== 'register-extension') return;
        request.params.forEach(properties => {
          this.createExtension(properties)?.then(listener).catch(errorListener);
        });
      } catch (error) {
        if (errorListener) errorListener(error);
      }
    });
  }
}
