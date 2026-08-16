# 돈의 궤적 — 리모션 영상 파이프라인

대본(마크다운)을 기반으로 가로형(1920x1080) 롱폼 영상을 만드는 Remotion 프로젝트.
업로드한 이미지·음성은 실사 장면에, 반복되는 비유 그래픽(자판기·시소·톱니바퀴·붕괴 차트·숫자 카운터)은
코드로 직접 그려서 "하이퍼프레임" 스타일의 몽타주 구간에 사용한다.

## 시작하기

```bash
npm install
npm start        # Remotion Studio 프리뷰
npm run render   # out/video.mp4 로 전체 렌더링
```

## 구조

```
src/
  constants.ts          # 해상도/색상/폰트 등 공용 설정
  Root.tsx               # Composition 등록
  Composition.tsx         # 전체 타임라인 조립 (섹션을 Sequence로 이어붙임)
  scenes/
    ColdOpen.tsx          # 0:00~1:30 콜드 오픈 (완성)
  components/
    Subtitle.tsx           # 하단 자막 트랙
    CenterLines.tsx         # 화면 중앙 강조 문구(흰 글씨 한 줄씩)
    SlideImage.tsx          # 업로드 이미지 켄번즈(줌/팬) 효과
    HyperframeMontage.tsx   # 여러 이미지/그래픽 빠른 전환 몽타주
    NumberDisplay.tsx       # StepValue(뚝뚝 꺾이는 숫자), SpinningCounter(폭증 카운터)
    CrashChart.tsx          # 절벽형 붕괴 차트
    VaultDoor.tsx           # 금고 문 개폐 연출
    VendingMachine.tsx      # 핵심 비유: 자판기(파쇄기+인쇄기)
    Seesaw.tsx / Gear.tsx   # 시소, 톱니바퀴
    TitleCard.tsx           # 채널 로고 카드
  data/
    coldOpenSubtitles.ts   # 콜드 오픈 자막 타임코드(추정치 — 실제 내레이션 녹음 후 교체 필요)
    subtitleUtils.ts        # 텍스트 길이 기반 자막 자동 배치 유틸(스캐폴딩용)
public/
  images/   # 업로드한 실사 이미지를 여기에 넣기
  audio/    # 내레이션/BGM 오디오를 여기에 넣기
```

## 진행 상황

- [x] 프로젝트 스캐폴딩 + 핵심 재사용 컴포넌트
- [x] 1장 콜드 오픈(0:00~1:30) 데모 완성
- [ ] 2~5장 조립 (자판기·시소·톱니 비유 장면 등)
- [ ] 실제 이미지/음성 업로드 반영
- [ ] 자막 타임코드를 실제 내레이션 녹음 기준으로 교체

## 참고

- 자막 타임코드는 현재 대본 문장 길이로 추정한 값. 실제 내레이션 녹음 후
  타임스탬프(또는 SRT)를 `src/data/*.ts`에 반영해야 정확히 싱크된다.
