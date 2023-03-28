import { LabIcon } from '@jupyterlab/ui-components';

import speakerSvgstr from '../style/icons/speaker.svg';
import muteSvgstr from '../style/icons/mute.svg';

export const speakerIcon = new LabIcon({
  name: 'daw:speaker',
  svgstr: speakerSvgstr
});

export const muteIcon = new LabIcon({
  name: 'daw:mute',
  svgstr: muteSvgstr
});
