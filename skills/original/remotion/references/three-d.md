# 3D 및 특수 효과 (Three.js)

## 기본 연동

`@remotion/three` 패키지가 Three.js를 프레임 기반으로 쓸 수 있게 감싸준다:

```bash
npm install @remotion/three three @react-three/fiber
```

```tsx
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame} from 'remotion';

const My3DScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <ThreeCanvas width={1920} height={1080}>
      <mesh rotation={[0, frame / 30, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
    </ThreeCanvas>
  );
};
```

`ThreeCanvas`는 일반 `@react-three/fiber`의 `Canvas`와 거의 같지만, Remotion의 프레임 루프와
동기화되도록 감싸져 있다 — 회전·이동 같은 값은 여기서도 항상 `frame`에서 직접 계산해서
넘긴다(실시간 애니메이션 라이브러리와 같은 함정, `animation-and-effects.md` 참고).

## 언제 3D가 필요한가 vs CSS 3D로 충분한가

- 카드가 살짝 기울어지는 정도("공간감을 준다")는 굳이 Three.js 없이 CSS
  `transform: perspective(800px) rotateY(${deg}deg)`로 충분하고 훨씬 가볍다. 대부분의 "인포
  카드 3D 틸트" 요구는 이 정도로 해결된다.
- 실제로 3D 오브젝트를 회전시키거나 카메라가 공간을 이동하는 느낌, 여러 오브젝트가 3D 공간에서
  상호작용하는 장면(제품 목업, 데이터를 3D 막대그래프로, 추상적인 네트워크/구조 시각화 등)은
  Three.js가 필요하다.

## 성능 주의사항

- 3D 렌더링은 헤드리스 크로미움에서 WebGL을 통해 처리되는데, 이건 일반 DOM/CSS 렌더링보다
  프레임당 렌더 시간이 훨씬 길다. 3D 씬이 들어간 구간만 렌더해서 실제로 얼마나 느려지는지
  먼저 재보고, 전체 영상에 넓게 쓸지 결정한다.
- 오브젝트/폴리곤 수가 많을수록, 텍스처가 고해상도일수록 렌더 시간이 늘어난다. 짧은 하이라이트
  구간에만 쓰는 걸 권장한다 — 영상 전체에 상시 3D 배경을 까는 식으로 쓰면 렌더 시간이 급격히
  늘어날 수 있다.
- 렌더 환경에 GPU 가속이 없으면(예: 이 프로젝트가 렌더되는 것과 같은 컨테이너 샌드박스) 소프트웨어
  렌더링으로 떨어져 더 느려질 수 있다 — 실제로 써보기 전에는 렌더 시간을 낙관적으로 가정하지
  않는다.
