---
name: remotion
description: Build, edit, and render videos programmatically with Remotion (React/TypeScript). Covers core primitives (Sequence, useCurrentFrame, interpolate, spring), real media (MP4/GIF/images/audio, trimming and concatenating clips), animation libraries (Framer Motion, CSS, SVG stroke drawing), 3D via Three.js, data-driven/parameterized video (charts from real data, DB/API-driven batch rendering for personalized or at-scale video), and the render → verify → compress → deliver workflow. Use whenever the user asks to build/edit/render a video with Remotion, wants real video/GIF/3D/live-data-chart elements in a Remotion project, wants to automate generating many videos from data, or asks a general "how do I do X in Remotion" question ("리모션으로 영상 만들어줘", "렌더링", "스틸컷"). This is the general Remotion technique reference — for the 돈5060 long-form channel pipeline use it together with don5060-longform (and longform-video-design for beat planning), which build on top of this skill.
---

# Remotion — 영상 제작 범용 스킬

Remotion은 React 컴포넌트를 프레임 단위로 렌더링해서 비디오 파일로 뽑아내는 프레임워크다. "매
프레임마다 이 화면이 어떻게 보여야 하는가"를 순수하게 `frame` 값의 함수로 표현하는 게 핵심이다
— 실시간 애니메이션(CSS transition, 브라우저 타이머 기반 라이브러리)과 근본적으로 다르게
접근해야 한다는 걸 항상 기억한다(아래 "프레임 기반 사고").

## 프레임 기반 사고 (가장 중요한 전제)

Remotion 컴포넌트는 `useCurrentFrame()`으로 현재 프레임 번호를 받아서, 그 프레임에 화면이
어때야 하는지를 **그 자리에서 계산**해야 한다. `setTimeout`, `requestAnimationFrame`,
CSS `transition`/`animation`처럼 "실제 경과 시간"에 의존하는 방식은 렌더링(캡처) 시점에
브라우저의 실제 시계와 무관하게 프레임 하나씩 캡처되기 때문에 **작동하지 않거나 매 프레임 같은
상태로 캡처될 수 있다.** Framer Motion이나 CSS 애니메이션을 가져다 쓸 때 이 함정에 가장 많이
걸린다 — 대응은 `references/animation-and-effects.md`. 같은 이유로 랜덤해 보이는 모션에
`Math.random()`을 쓰지 않는다(미리 계산한 고정 시퀀스를 쓴다).

## 언제 뭘 쓰는지 — 빠른 판단 가이드

| 하고 싶은 것 | 참고 문서 |
|---|---|
| 실제 mp4/GIF/고해상도 이미지/오디오를 불러와서 자르고 이어붙이기 | `references/media-sources.md` |
| Framer Motion, CSS 애니메이션, SVG 드로잉 이펙트 넣기 | `references/animation-and-effects.md` |
| Three.js로 3D 오브젝트/인터랙티브 그래픽 | `references/three-d.md` |
| 실제 데이터(엑셀·DB·API)나 실시간 차트로 인포그래픽 만들기, 여러 개 자동 렌더링 | `references/data-driven-video.md` |
| 타입체크·스틸컷 검수·긴 렌더 처리·용량 압축·전달 | `references/rendering-and-pipeline.md` |

## 정보 신뢰도
- **렌더·전달 파이프라인**(`references/rendering-and-pipeline.md`) — "돈의 행방" 채널 프로젝트가 1화 25개 파트를 실제로 렌더링하며 검증한 절차를 일반화한 것이라 **신뢰도가 높다.**
- **범용 기능 설명**(미디어 임포트, 애니메이션 라이브러리 연동, 3D, 데이터 연동 등) — 리모션 공식 API 기준으로 정확하게 썼지만 **아직 실제 프로젝트에서 검증한 적이 없다.** 처음 쓸 때는 작은 스틸컷/짧은 렌더로 먼저 확인하고 넘어간다.
- 새 기법을 써보고 검증이 끝나면, 해당 문서에 "실제로 이렇게 확인했다"고 갱신해서 검증된 지식으로 남긴다.

## 다른 스킬과의 관계
- 이 스킬은 "리모션으로 무엇을 할 수 있는가"(범용 기술)만 다룬다. 채널별 규칙(자막 파이프라인, 팔레트, 재사용 컴포넌트, 비트 기획)은 여기서 중복 설명하지 않는다.
- **돈5060 롱폼** → `don5060-longform`(전체 워크플로우) + `longform-video-design`(비트 기획 체크리스트)를 같이 쓴다.
- **돈의 행방(구 돈의 궤적) 채널** → 예전엔 `donui-gwejeok-video` 스킬이 그 채널 파이프라인을 담당했으나 **사용자가 잠시 꺼둔 상태일 수 있다.** 목록에 보이면 같이 쓰고, 안 보이는데 그 채널 작업이면 사용자에게 켜달라고 요청하며, 코드는 `jennylove-ws/sns-workplace` 브랜치 `claude/remocion-image-audio-editing-7izo61`을 참고한다.
- 다른 프로젝트에서 리모션으로 영상을 만들 때는 이 스킬만 있으면 된다.
