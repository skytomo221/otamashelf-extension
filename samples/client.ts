import { endsWithPageExplorer } from 'otamashelf/extensions/endsWithPageExplorer';
import { includesPageExplorer } from 'otamashelf/extensions/includesPageExplorer';
import { otmAddContentPageModifier } from 'otamashelf/extensions/otmAddContentPageModifier'
import { otmAllSearchIndexGenerator } from 'otamashelf/extensions/otmAllSearchIndexGenerator'
import { otmBothSearchIndexGenerator } from 'otamashelf/extensions/otmBothSearchIndexGenerator';
import { otmCreator } from 'otamashelf/extensions/otmCreator';
import { otmDiscriminator } from 'otamashelf/extensions/otmDiscriminator';
import { otmFormSearchIndexGenerator } from 'otamashelf/extensions/otmFormSearchIndexGenerator';
import { otmIndexGenerator } from 'otamashelf/extensions/otmIndexGenerator';
import { otmLayoutBuilder } from 'otamashelf/extensions/otmLayoutBuilder';
import { otmLoader } from 'otamashelf/extensions/otmLoader';
import { otmPageCreator } from 'otamashelf/extensions/otmPageCreator';
import { otmRemoveContentPageModifier } from 'otamashelf/extensions/otmRemoveContentPageModifier';
import { otmRenumberModifier } from 'otamashelf/extensions/otmRenumberModifier';
import { otmSaver } from 'otamashelf/extensions/otmSaver';
import { otmTranslationSearchIndexGenerator } from 'otamashelf/extensions/otmTranslationSearchIndexGenerator';

import OtamashelfWebSocket from '../src/OtamashelfWebSocket';

const client = new OtamashelfWebSocket('ws://127.0.0.1:3000');
client.on('error', console.error);
client.on('open', () => {
  [
    endsWithPageExplorer,
    includesPageExplorer,
    otmAddContentPageModifier,
    otmAllSearchIndexGenerator,
    otmBothSearchIndexGenerator,
    otmCreator,
    otmDiscriminator,
    otmFormSearchIndexGenerator,
    otmIndexGenerator,
    otmLayoutBuilder,
    otmLoader,
    otmPageCreator,
    otmRemoveContentPageModifier,
    otmRenumberModifier,
    otmSaver,
    otmTranslationSearchIndexGenerator,
  ].forEach(client.registerExtension.bind(client));
});
