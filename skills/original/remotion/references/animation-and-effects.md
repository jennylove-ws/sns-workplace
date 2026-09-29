# 애니메이션 라이브러리 연동: Framer Motion · CSS · SVG

## 핵심 함정: "실시간" 애니메이션은 그대로 안 먹힌다

Framer Motion, CSS `transition`/`@keyframes`, 그 밖의 실시간 애니메이션 라이브러리는 보통
"경과된 실제 시간"을 기준으로 움직인다. 하지만 Remotion 렌더는 프레임을 하나씩 정지 캡처하는
방식이라, 그 프레임을 캡처하는 순간에 "실제 시간이 얼마나 지났는지"가 없거나 항상 0에 가깝다.
그 결과:
- Framer Motion의 `animate` prop을 `useEffect`나 마운트 시점 트리거로 쓰면, 렌더 중에는 매
  프레임이 새로 마운트되는 것처럼 취급되어 애니메이션이 처음부터 다시 시작되거나 전혀 진행되지
  않을 수 있다.
- CSS `transition: opacity 1s`도 마찬가지로, 실제 1초가 지나가는 걸 관찰할 수 없는 캡처
  환경에서는 상태가 바뀌는 즉시(0초 만에) 캡처될 수 있다.

**해결 원칙**: 애니메이션 라이브러리를 쓰더라도, 값 자체는 항상 `useCurrentFrame()`에서 뽑은
`frame`으로 직접 계산해서 넘긴다 — 라이브러리의 "시간 기반 자동 재생" 기능에 맡기지 않는다.

## Framer Motion을 쓰는 안전한 방법

- `animate` prop에 실시간 트리거를 쓰지 말고, `frame`으로 계산한 값을 `style`이나 `animate`에
  **매 프레임 직접** 넘긴다:
  ```tsx
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 20], [0.8, 1], {extrapolateRight: 'clamp'});
  return <motion.div style={{scale}}>...</motion.div>;
  ```
  이렇게 하면 Framer Motion은 그냥 "그 순간의 스타일을 렌더링하는 컴포넌트"로만 쓰이고, 실제
  애니메이션 진행은 Remotion의 `frame`이 담당한다.
- Framer Motion 고유 기능(스프링 물리, 제스처, layout 애니메이션) 중 "시간 경과에 따라 저절로
  진행되는" 것들은 위 방식으로 대체하기 어렵다 — 그런 경우는 Remotion 자체의 `spring()`
  (아래 참고)이 프레임 기반으로 동작해서 더 안전하다.

## CSS 애니메이션

- `@keyframes`/`animation`/`transition`도 같은 이유로 지양한다. 대신 `interpolate()`로 계산한
  값을 인라인 `style`에 직접 꽂는다.
- 정말 CSS 애니메이션이 필요하면(예: 무한 루프 회전처럼 프레임과 무관하게 계속 도는 효과),
  `animationPlayState`를 프레임 기반으로 수동 제어하거나, 차라리 `transform: rotate(${frame *
  2}deg)`처럼 프레임에서 직접 각도를 계산하는 쪽이 렌더 결과를 보장한다.

## Remotion 자체 애니메이션 프리미티브 (가장 안전한 기본값)

- `interpolate(frame, [입력구간], [출력구간], {extrapolateLeft, extrapolateRight})` — 프레임을
  값으로 매핑하는 가장 기본적인 방법. `extrapolateLeft/Right: 'clamp'`를 거의 항상 붙여서
  구간 밖에서 값이 튀지 않게 한다.
- `spring({frame, fps, config: {damping, stiffness, mass}})` — 물리 기반 탄성 애니메이션.
  `damping`을 낮추면(예: 10) 더 탱글탱글하게 튕기고, 높이면(예: 200) 부드럽게 멈춘다. "젤리처럼
  튕기며 등장" 같은 효과는 이걸로 구현한다.
- `Math.sin(frame / N)` — 파동·펄스처럼 반복되는 유기적 움직임. N이 클수록 느리게 진동한다.

## SVG 드로잉 이펙트 (스트로크 애니메이션)

화살표·강조 원·밑줄을 "손으로 그리는 듯" 보이게 하려면 `stroke-dasharray`/`stroke-dashoffset`을
쓴다:
```tsx
const frame = useCurrentFrame();
const pathLength = 300; // 실제 path의 총 길이(대략치 또는 getTotalLength()로 측정)
const drawn = interpolate(frame, [0, 20], [0, pathLength], {extrapolateRight: 'clamp'});
<path d={...} stroke={COLORS.accent} strokeWidth={3} fill="none"
  strokeDasharray={pathLength} strokeDashoffset={pathLength - drawn} />
```
`stroke-dashoffset`이 `pathLength`에서 0으로 줄어들수록 선이 점점 그려지는 것처럼 보인다.
차트에 화살표로 포인트를 짚거나, 핵심 수치에 밑줄을 그릴 때 자연스럽다.

## 타이핑(typewriter) 효과

문장을 프레임에 비례해 잘라서 보여준다:
```tsx
const frame = useCurrentFrame();
const charsPerFrame = 0.8; // 타이핑 속도 조절
const visibleChars = Math.floor(frame * charsPerFrame);
const visibleText = fullText.slice(0, visibleChars);
```
핵심 단어가 등장하는 프레임 구간에서만 `scale`/글로우를 추가로 얹으면 "타이핑 중 강조 단어가
팝업"되는 효과가 된다. 자막처럼 가독성이 중요한 텍스트에는 타이핑 속도를 너무 빠르게/느리게
하지 않도록 실제 음성 길이에 맞춰 `charsPerFrame`을 조정한다.
