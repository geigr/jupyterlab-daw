import { LabIcon } from '@jupyterlab/ui-components';

import speakerSvgstr from '../style/icons/speaker.svg';
import muteSvgstr from '../style/icons/mute.svg';
import playSvgstr from '../style/icons/play.svg';
import pauseSvgstr from '../style/icons/pause.svg';
import stopSvgstr from '../style/icons/stop.svg';

export const speakerIcon = new LabIcon({
  name: 'daw:speaker',
  svgstr: speakerSvgstr
});

export const muteIcon = new LabIcon({
  name: 'daw:mute',
  svgstr: muteSvgstr
});

export const playIcon = new LabIcon({
  name: 'daw:play',
  svgstr: playSvgstr
});

export const pauseIcon = new LabIcon({
  name: 'daw:pause',
  svgstr: pauseSvgstr
});

export const stopIcon = new LabIcon({
  name: 'daw:stop',
  svgstr: stopSvgstr
});
