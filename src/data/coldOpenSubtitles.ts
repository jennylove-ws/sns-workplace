import {SubtitleLine} from '../components/Subtitle';
import {sec} from '../constants';

// 실제 내레이션 녹음본이 들어오면 이 타임코드는 정확한 값으로 교체해야 함.
// 지금은 대본 문장 길이 기준으로 잡은 추정치.
export const coldOpenSubtitles: SubtitleLine[] = [
  {text: '오늘 우리가 추적할 이 코인은, 가격이 흔들리면 안 됩니다.', startFrame: sec(0), endFrame: sec(4)},
  {text: '무슨 일이 있어도 1달러. 그러라고 만든 코인이거든요.', startFrame: sec(4), endFrame: sec(8)},
  {text: '그런데 흔들립니다.', startFrame: sec(8), endFrame: sec(11), emphasis: true},
  {text: '그리고 무너집니다.', startFrame: sec(11), endFrame: sec(15), emphasis: true},
  {text: '이 코인을 떠받치던 짝꿍 코인도 같이 무너집니다.', startFrame: sec(15), endFrame: sec(19.5)},
  {text: '한 달 전에 119달러였습니다. 지금은 휴지조각이고요.', startFrame: sec(19.5), endFrame: sec(24)},
  {text: '그사이 이 코인은 10억 개에서 6조 개로 불어납니다.', startFrame: sec(24), endFrame: sec(28)},
  {text: '6천 배요. 오타 아닙니다.', startFrame: sec(28), endFrame: sec(32), emphasis: true},
  {
    text: '미국 증권거래위원회는 이 사태로 하룻밤 사이에 약 400억 달러가 증발했다고 밝혔습니다.',
    startFrame: sec(32),
    endFrame: sec(38),
  },
  {text: '우리 돈 50조 원.', startFrame: sec(38), endFrame: sec(42), emphasis: true},
  {text: '여기까지 걸린 시간, 사흘입니다.', startFrame: sec(42), endFrame: sec(48), emphasis: true},
  {text: '어떻게 이런 일이 가능할까요.', startFrame: sec(66), endFrame: sec(69)},
  {text: '그걸 알려면 사흘 전으로 돌아가야 합니다.', startFrame: sec(69), endFrame: sec(73)},
  {
    text: '아니, 조금 더 앞으로. 사람들이 이 코인에 돈을 넣기 시작한 그때까지요.',
    startFrame: sec(73),
    endFrame: sec(78),
  },
  {
    text: '돈이 움직인 사건을 추적합니다. 돈의 궤적, 1화 시작합니다.',
    startFrame: sec(78),
    endFrame: sec(90),
  },
];
