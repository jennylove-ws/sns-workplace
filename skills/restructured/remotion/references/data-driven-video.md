# 데이터 연동: 차트, 실제 데이터, 자동화 파이프라인

## 원칙: 데이터는 렌더 "전에" 가져온다

Remotion 컴포넌트는 주어진 `props`(그리고 `frame`)만으로 매 프레임을 결정론적으로 그려야
한다. 엑셀·DB·API에서 데이터를 가져오는 작업은 **렌더 도중 컴포넌트 안에서 하지 않는다** —
렌더 시작 전에 별도 스크립트로 데이터를 가져와서 JSON으로 만들고, 그 JSON을 `inputProps`로
넘겨서 렌더한다. 컴포넌트 안에서 `fetch`를 호출하면 프레임마다 다른 응답이 오거나 타이밍이
어긋날 위험이 있다.

```
[엑셀/DB/API] → (렌더 전 스크립트) → data.json → renderMedia({ inputProps: data }) → mp4
```

## 차트 라이브러리

- `Chart.js`, `Recharts`, `visx` 등 일반 React 차트 라이브러리를 그대로 쓸 수 있다. 다만
  차트 라이브러리 자체의 "등장 애니메이션"(라이브러리 내부에서 시간 기반으로 그려지는 것)은
  끄고, 차트가 그려지는 정도(예: 막대 높이, 선의 진행률)를 `frame`으로 직접 계산해서 props로
  넘기는 방식을 쓴다 — 이 프로젝트의 `CrashChart`/`StepValue`/`SpinningCounter`가 이미 이
  방식으로 동작한다(라이브러리 없이 직접 그린 경우지만 원리는 같다).
- 정적 스냅샷 데이터라면 미리 JSON으로 받아서 `public/data/`에 두고 `staticFile()`로 읽어도
  되고, `inputProps`로 직접 넘겨도 된다.

## `inputProps`로 파라미터화하기

`Root.tsx`에서 `<Composition>`에 `defaultProps`를 주고, 실제 렌더 시점에는 CLI나 API로 다른
값을 덮어씌울 수 있다:

```bash
npx remotion render src/index.ts MyComp out/video.mp4 --props='{"title":"영상 A","value":123}'
```

컴포넌트 쪽에서는 그 값을 그냥 일반 React props처럼 받아서 쓴다. 영상 길이가 데이터에 따라
달라지는 경우(예: 항목 수만큼 씬이 늘어남)에는 `calculateMetadata`로 `durationInFrames`를
props 기반으로 동적으로 계산한다.

## 여러 개를 자동으로 렌더링하는 파이프라인 (배치/개인화 영상)

기업용 마케팅 영상 자동화, 맞춤형 리포트 영상처럼 "같은 템플릿에 다른 데이터를 넣어서 대량
렌더링"하는 구조는 아래 패턴을 쓴다:

```ts
import {renderMedia, selectComposition} from '@remotion/renderer';
import {bundle} from '@remotion/bundler';

const bundled = await bundle({entryPoint: 'src/index.ts'});

for (const row of dataset) {  // 엑셀/DB에서 미리 읽어온 배열
  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'MyComp',
    inputProps: row,
  });
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: `out/${row.id}.mp4`,
    inputProps: row,
  });
}
```

- `bundle()`은 한 번만 하고, 그 결과(`serveUrl`)를 재사용해서 여러 번 `renderMedia`를 호출하는
  게 훨씬 빠르다 — 매번 새로 번들링하지 않는다.
- 데이터 건수가 많으면(수십~수백 개) 병렬로 여러 렌더를 동시에 돌릴 수도 있지만, 리소스(CPU/
  메모리)가 감당되는 동시 개수로 제한한다 — 무작정 `Promise.all`로 전부 동시에 돌리면 렌더
  서버가 죽을 수 있다.
- 이 스크립트는 Node.js 환경에서 실행하는 별도 오케스트레이션 코드다(Remotion 컴포넌트 코드와는
  분리) — `scripts/` 폴더 같은 곳에 두고 필요할 때 실행한다.

## 언제 이 정도까지 필요한가

한 편짜리 영상(예: 돈의 궤적 각 에피소드)에는 이 자동화 파이프라인이 필요 없다 — 매번 사람이
직접 씬을 설계하고 검수하는 게 이 채널의 방식이다. 이 패턴은 "같은 템플릿으로 데이터만 바뀌는
영상을 여러 개/대량으로" 만들어야 할 때(주간 리포트 영상, 개인화된 안내 영상 등)만 쓴다.
