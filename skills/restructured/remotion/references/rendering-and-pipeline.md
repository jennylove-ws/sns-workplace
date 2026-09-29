# 검수 · 렌더 · 압축 (일반 파이프라인)

"돈의 행방"(구 돈의 궤적) 채널 프로젝트(`donui-gwejeok-video`, 코드는 `jennylove-ws/sns-workplace`
브랜치 `claude/remocion-image-audio-editing-7izo61`)가 1화 25개 파트를 실제로 렌더링하면서 검증한
절차를 일반화한 것이다 — 어떤 리모션 프로젝트든 이 순서를 기본으로 따르면 안전하다.

## 1. 타입 체크

```bash
npx tsc --noEmit
```

렌더를 돌리기 전에 항상 먼저 확인한다. props 타입 불일치, export 빠뜨림 같은 실수가 여기서
대부분 걸린다.

## 2. 스틸컷으로 먼저 검수

전체를 렌더하기 전에 대표 프레임 몇 장만 정지 이미지로 뽑아서 육안 확인한다 — 레이아웃 깨짐,
텍스트 겹침, 색상 대비, 3D/데이터 연동처럼 새로 쓴 기법이 의도대로 보이는지를 렌더 전에 잡는
게 훨씬 빠르다:

```bash
npx remotion still src/index.ts <합성ID> out/frame.png --frame=<확인할 프레임 번호>
```

`<합성ID>`는 `Root.tsx`의 `<Composition id="...">` 값이다 — 미리 구성 목록을 확인하고
싶으면 `npx remotion compositions src/index.ts`로 조회할 수 있다.

## 3. 구간만 렌더 (전체를 매번 다시 렌더하지 않는다)

```bash
npx remotion render src/index.ts <합성ID> out/clip.mp4 --frames=<시작>-<끝>
```

작업 중인 구간만 잘라서 렌더하면 반복 검수가 훨씬 빠르다. 전체 렌더는 마지막에 한 번만.

## 4. 긴 렌더는 백그라운드로

3D 씬, 고해상도 이미지가 많은 구간, 데이터 연동 배치 렌더처럼 시간이 오래 걸리는 작업은
포그라운드 타임아웃(대개 120초)에 걸려 끊길 수 있다 — 백그라운드로 돌려서 끝날 때까지
기다린다.

## 5. 용량이 크면 ffmpeg로 압축

전달·업로드 용량 제한을 넘으면 압축한다. 번들된 ffmpeg를 쓰는 프로젝트라면 최초 1회
`chmod +x`가 필요하다:

```bash
chmod +x node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg
node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg -i out/clip.mp4 \
  -c:v libx264 -crf 26 -preset medium -c:a aac -b:a 128k out/clip_compressed.mp4
```

`crf 26`이 눈에 띄는 화질 저하 없이 대부분의 경우 충분하다. 그래도 크면 28~30까지 올려본다.
3D/고해상도 이미지가 많이 들어간 영상은 원본 비트레이트가 높아서 더 강하게 압축해야 할 수
있다.

## 6. 외부 리소스(폰트·CDN 이미지 등)를 쓸 때 주의

렌더가 프록시/샌드박스 환경에서 실행되는 경우, 헤드리스 크로미움이 외부 CDN 요청을 인증서
문제로 거부할 수 있다(`ERR_CERT_AUTHORITY_INVALID` 등). 이런 환경에서는 폰트·이미지·비디오를
전부 `public/`에 미리 받아두고 `staticFile()`로 로컬 참조하는 쪽이 훨씬 안전하다 — 실제로
돈의 행방(`donui-gwejeok-video`) 프로젝트에서 구글 폰트 CDN 로딩이 이 문제로 실패해서 로컬 파일
방식으로 바꾼 전례가 있다(그 스킬의 `known-gaps.md`에 기록돼 있었음). 돈5060 롱폼도 이 이유로
처음부터 Noto Sans KR을 `public/fonts/`에 두고 `FontFace`로 로드한다.
