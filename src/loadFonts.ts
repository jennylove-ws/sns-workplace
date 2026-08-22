import {continueRender, delayRender, staticFile} from 'remotion';

// Noto Sans KR을 구글 폰트 CDN이 아니라 public/fonts에 미리 받아둔 로컬 파일로 로드한다.
// 렌더는 이 프로젝트에서 항상 프록시를 통과하는 샌드박스 안에서 실행되는데, 헤드리스
// 크로미움이 그 프록시의 재서명된 인증서를 신뢰하지 않아 외부 폰트 CDN 요청이
// ERR_CERT_AUTHORITY_INVALID로 실패한다 — 이미지·음성처럼 완전히 로컬 자산으로 두면
// 이 문제 자체가 발생하지 않는다.
const WEIGHTS: Array<{weight: string; file: string}> = [
  {weight: '400', file: 'NotoSansKR-400.ttf'},
  {weight: '500', file: 'NotoSansKR-500.ttf'},
  {weight: '700', file: 'NotoSansKR-700.ttf'},
  {weight: '800', file: 'NotoSansKR-800.ttf'},
];

if (typeof FontFace !== 'undefined') {
  WEIGHTS.forEach(({weight, file}) => {
    const handle = delayRender(`Noto Sans KR ${weight} 로드`);
    const font = new FontFace('Noto Sans KR', `url(${staticFile(`fonts/${file}`)})`, {
      weight,
    });
    font
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch((err) => {
        console.error(`Noto Sans KR ${weight} 로드 실패`, err);
        continueRender(handle);
      });
  });
}
