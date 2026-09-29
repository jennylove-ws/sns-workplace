# 실제 미디어 소스 활용: 비디오·GIF·이미지·오디오

## 기본 컴포넌트

- `<OffthreadVideo src={...} />` — mp4 등 비디오 파일 재생. **`<Video>`보다 이걸 우선 쓴다** —
  `<Video>`는 브라우저의 `<video>` 태그를 그대로 쓰기 때문에 프레임 정확도가 떨어지고 렌더가
  느릴 수 있는데, `OffthreadVideo`는 서버 사이드에서 프레임을 직접 추출해서 붙이기 때문에 더
  정확하고 대체로 더 빠르다.
- `<Img src={...} />` — 고해상도 이미지. 일반 `<img>`처럼 쓰되, Remotion이 로드 완료를 보장하도록
  감싸준다(직접 `<img>` 태그를 쓰면 로드 전에 프레임이 캡처될 수 있음).
- `<Audio src={...} />` — 오디오 트랙. 여러 개를 겹쳐 쓸 수 있고(내레이션+배경음악+효과음),
  `volume` prop으로 개별 볼륨 조절.
- `@remotion/gif`의 `<Gif src={...} />` — GIF 재생. 내부적으로 프레임 단위 이미지 시퀀스로
  변환해서 붙인다.
- 이 모든 소스는 `staticFile('media/파일명.ext')`로 `public/` 폴더 안의 로컬 파일을 참조하거나,
  `https://...` 원격 URL을 직접 넘길 수도 있다. **다만 원격 URL은 렌더 시점에 그 네트워크
  요청이 실패하면 렌더 전체가 실패한다** — 가능하면 미리 다운로드해서 `public/`에 두고
  `staticFile()`로 참조하는 쪽이 안전하다(이 프로젝트의 이미지/음성 자산도 전부 이 방식).

## 자르기 (트리밍)

- `OffthreadVideo`는 `trimBefore`/`trimAfter` prop으로 소스 파일의 특정 구간만 잘라 쓸 수 있다
  (단위는 프레임). 원본 mp4가 60초인데 15~20초 구간만 필요하면 `trimBefore={sec(15)}
  trimAfter={sec(20)}`처럼 쓴다.
- 그 클립을 화면에 "몇 초 동안 보여줄지"는 감싸는 `<Sequence durationInFrames={...}>`가
  결정한다 — 트리밍(소스에서 어느 구간을 가져올지)과 노출 시간(화면에 몇 프레임 보일지)은
  서로 다른 개념이니 헷갈리지 않는다.

## 이어붙이기 (콘카티네이션)

- 클립 여러 개를 순서대로 이어붙이려면 `<Sequence from={...} durationInFrames={...}>`로 각
  클립을 다른 시작 프레임에 배치한다 — 이 프로젝트의 파트별 씬을 이어붙이는 방식(`Composition.tsx`
  의 `PARTN_FROM`/`PARTN_END` 체인)과 완전히 같은 원리다.
- 트랜지션(크로스페이드, 슬라이드 등)이 필요하면 `@remotion/transitions`의
  `<TransitionSeries>`를 쓰면 편하다 — 직접 두 클립의 겹치는 구간에서 opacity를 수동으로
  interpolate하는 것보다 안전하다.

## 크기·비율 조절

- `Img`/`OffthreadVideo`에 `style={{width, height, objectFit: 'cover'}}` 등을 그대로 CSS로
  적용하면 된다 — 리모션 전용 API가 아니라 일반 React/CSS 레이아웃 그대로 동작한다.
- 원본 해상도가 프로젝트 해상도(예: 1920x1080)와 비율이 다르면 `objectFit: 'cover'`로 크롭할지
  `'contain'`으로 여백을 둘지 미리 정해서 일관되게 쓴다.

## 포맷 관련 주의사항

- 렌더 자체가 헤드리스 크로미움으로 동작하므로, 소스 비디오 코덱이 브라우저에서 재생 가능한
  형식(h264/mp4, webm 등)이어야 한다. 특이한 코덱은 미리 ffmpeg로 변환해두는 게 안전하다
  (이 프로젝트에 번들된 ffmpeg 경로는 `node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg`,
  최초 1회 `chmod +x` 필요 — `rendering-and-pipeline.md` 참고).
- 큰 원본 파일을 프로젝트에 그대로 넣기 전에, 실제로 화면에 쓰이는 구간만 ffmpeg로 미리
  잘라내면(`-ss`/`-to`) 리포 용량과 렌더 시간을 아낄 수 있다.
