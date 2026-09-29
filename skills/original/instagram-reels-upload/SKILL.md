---
name: instagram-reels-upload
description: 돈5060 쇼츠를 인스타그램 릴스에 Meta Graph API로 업로드한다(쓰레드는 수동). 로컬 mp4를 릴스 규격으로 변환하고, Cloudinary에 올려 퍼블릭 URL을 만들어 컨테이너를 생성한 뒤 게시한다. 캡션은 SEO·GEO 기준으로 쓴다. 사용자가 "인스타에 올려줘", "릴스 업로드", "쓰레드에도 올려줘", "인스타 API로 올려줘", "인스타 다시 해줘" 같은 말을 하면 반드시 이 스킬을 쓴다. 인스타그램·릴스·쓰레드·Threads·Meta Graph API·크로스포스팅이 언급되면 먼저 이 스킬을 참고할 것.
---

# 인스타그램 릴스 업로드 (돈5060)

> **⏸ 현재 중지 중.** 사용자가 **"인스타 다시 해줘"**라고 명시하기 전에는 실행하지 않는다(스크립트 호출·Cloudinary 업로드·커버·캡션 제작 모두). 재개할 때 그동안 밀린 영상(`distribution_queue.md`의 인스타 칸 `[ ]`)을 올릴지 먼저 묻는다.
>
> **쓰레드는 수동.** 계정이 두 번 정지돼 Threads API를 호출하거나 토큰을 요청하지 않는다. 500자 이내 문안만 만들어 준다. 사용자가 "쓰레드 자동으로 올려도 돼"라고 할 때만 재개.

프로젝트 루트: `C:\Users\koyon\클로드\Claude코드\코딩프로젝트\돈5060-유튜브팀`
스크립트: `scripts/upload_instagram.py` (Cloudinary → Meta 컨테이너 → 게시 → 정리)

## 알아야 할 제약

1. **로컬 파일을 직접 못 올린다.** 이 계정은 "Instagram 테스터" 방식(`graph.instagram.com`)이라 resumable 업로드가 거부된다 → **Cloudinary에 올려 퍼블릭 URL을 넘긴다**(스크립트 기본값, `.env`의 `CLOUDINARY_URL`).
2. **임시 터널(cloudflared, trycloudflare.com)은 쓰지 않는다** — 그 방식으로 올린 직후 Meta가 앱을 "비정상적인 활동"으로 차단했다. Cloudinary가 막혀도 터널로 되돌아가지 않는다.
3. **예약 게시가 없다.** `media_publish`는 즉시 올라간다. 예약하려면 컨테이너만 만들어 두고 원하는 시각에 publish만 호출(컨테이너는 약 24시간 뒤 만료).
4. **크로스포스팅은 API 게시에 적용되지 않는다** — 쓰레드·페이스북에는 각각 올려야 한다.
5. 하루 25건 제한(우리 페이스로는 무관). **토큰은 60일** — 만료되면 사용자가 Meta 콘솔에서 재발급.

## 오류가 나면 — 멈추고 묻는다

- 컨테이너 생성·상태 확인·게시·Cloudinary 업로드 어디서든 오류가 나면 **그 자리에서 멈추고** 메시지 원문과 어디까지 됐는지 알린다.
- 같은 호출 재시도, 잠깐 기다렸다 재시도, 다른 호스팅·파라미터로 우회 — 모두 사용자 지시 없이는 하지 않는다. (반복 호출은 계정 제한을 부르고, 게시 호출은 오류가 나도 실제로 올라갔을 수 있어 재시도하면 중복 게시된다.)
- 다시 하기 전에 **인스타 프로필에 이미 올라갔는지** 먼저 확인한다. 사용자가 "다시 해봐"라고 하면 한 번.
- 스크립트도 이 규칙대로 동작한다: 모든 오류에서 한 번만 시도하고 멈추며, 상태 확인도 반복하지 않는다(120초 대기 후 딱 1번).

## 0단계 — 계정 확인

```bash
python scripts/upload_instagram.py --whoami
```
`@don5060_official`이 나오고 `.env`의 `INSTAGRAM_ACCOUNT_ID`가 실제 값과 같은지, `INSTAGRAM_LOCATION_ID`가 있는지 확인한다. 계정 ID는 앱을 새로 만들 때마다 바뀌므로 문서에 적지 않고 항상 `--whoami` 값을 쓴다.

## 1단계 — 릴스 규격으로 변환

```bash
ffmpeg -y -i "output/<원본>.mp4" -vf "scale=1080:1920" -r 30 \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart "output/_ig_reel.mp4"
```

## 2단계 — 캡션 (`metadata/<이름>_ig.txt`)

- **첫 두 줄이 승부**(나머지는 "더 보기"로 접힌다). 첫 줄에 훅, 질문형이 잘 먹는다.
- 문단 사이 빈 줄. 해시태그 10~15개(대중·좁은 태그 섞기, 무관한 인기 태그 금지).
- GEO: 결론 한 문장 먼저, 숫자·구체 표현, 번호 목록.
- 채널 정체성 한 줄("돈5060은 50대 이후 사람 때문에 돈 잃지 않는 법을 다룹니다") — 매번 도배하지는 않는다.
- **1인칭으로 쓰지 않는다**(사연은 3인칭, 독자에겐 2인칭).
- 추천 도서는 제목을 밝힌다: `📖 『쇼펜하우어 인생수업』 — 프로필 링크에서 보실 수 있습니다.`
- **쿠팡 파트너스 고지**: 캡션에서 책을 소개하며 프로필 링크로 유도하는 게시물에만, **캡션 맨 앞에** `이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.` 책 얘기가 없거나 쿠팡 링크를 안 쓰면 넣지 않는다. 고지가 훅을 약하게 하므로 책을 미는 게시물과 콘텐츠 게시물을 나누는 편이 낫다.
- 쓰레드 문안(`metadata/<이름>_threads.txt`, 500자): 훅 + 핵심 + 질문형 마무리, 해시태그 최소, 책 얘기는 되도록 뺀다.

## 3단계 — 커버 (반드시 넣는다)

빠뜨리면 영상 첫 프레임이 커버가 된다. **사진·디자인은 유튜브 썸네일과 같게, 문구만 짧게**:

| | 유튜브 썸네일 | 인스타 커버 |
|---|---|---|
| 사진 | 썸네일에 쓴 씬 이미지 | **같은 사진** |
| 디자인 | 어두운 오버레이 + 굵은 글씨 + 검은 테두리 | **똑같이** |
| 문구 | 3~5줄 완결 문장 | **2~3줄, 한 줄 8자 안팎** |

```bash
python scripts/make_thumbnail.py --image <유튜브 썸네일에 쓴 씬 이미지> --out output/<이름>_ig_cover.jpg \
  --lines "짧은 훅:yellow" "둘째 줄:white" --position center
```
결말·피해 액수는 감춘다. 만든 뒤 열어서 글자가 가운데 안쪽에 들어왔는지 확인한다. 사용자가 커버를 주면 그걸 쓴다.

## 4단계 — 확인 후 게시

```bash
python scripts/upload_instagram.py --video output/_ig_reel.mp4 --caption-file metadata/<이름>_ig.txt \
  --cover output/<이름>_ig_cover.jpg --dry-run      # 아무것도 보내지 않고 전송될 내용만 확인
```
사용자 확인 후 `--dry-run` 대신 `--publish`. 게시 후 `permalink`를 알려 준다.

- **위치는 서울**(`INSTAGRAM_LOCATION_ID` = `121961044613621`, 검증 완료)이 자동 적용된다. 값이 없으면 스크립트가 멈춘다(`--no-location`을 명시해야 위치 없이 올라간다). 새 위치 ID는 `scripts/check_ig_location.py <ID>`로 게시 없이 먼저 검증하고, ID를 모르면 사용자에게 묻는다(지어내지 않는다).
- `--cover`가 없어도 스크립트가 멈춘다(`--no-cover`를 명시해야 첫 프레임 커버).
- 컨테이너 상태: 120초 기다린 뒤 1번 확인 → `FINISHED`면 게시, `ERROR`/`EXPIRED`면 멈춤, 아직 처리 중이면 멈추고(Cloudinary 파일은 지우지 않는다) 사용자에게 묻는다.

**게시 후 사용자에게 안내**(API로 안 되는 것):
- 앱에서 **AI 라벨** 켜기(게시물 편집 > AI 정보). 계정 단위 "AI-generated profile" 라벨을 켜 두면 게시물마다 안 해도 된다 — 아직 안 켰다면 권한다.
- 위치가 안 들어갔으면 앱에서 서울 추가.

## 5단계 — 정리

- **Cloudinary 파일은 지우지 않고 남겨 둔다.** 용량이 차면 사용자가 한꺼번에 지운다(콘솔 > Media Library > `don5060` 폴더). 사용량 확인(읽기 전용): `python scripts/upload_instagram.py --cloudinary-status`. 무료 플랜 월 25크레딧, 한도를 넘기면 청구 없이 계정이 비활성화돼 업로드가 막힌다(`research/reminders.md`에 정기 확인 항목).
- 게시마다 지우고 싶다면 `--delete-cloudinary`.
- 로컬 산출물(`output/_ig_reel.mp4`, `output/*_ig_cover.jpg`)은 지워도 된다.
- 끝나면 `distribution_queue.md`의 인스타 칸을 `[x]`로.

## 전략 갱신

성과가 꺾이거나 3개월쯤 지났으면 `naver-blog-post` 스킬의 `references/growth-loop.md`를 읽고 캡션 기준을 갱신한다. 인스타 인사이트의 우리 숫자(저장·공유 비중, "더 보기" 클릭, 해시태그 수와 도달)를 웹 통설보다 우선한다.

## 기억해둘 것

- 계정 `@don5060_official`. ID·토큰은 `.env`, 값은 `--whoami`로 확인
- 호스트: 인스타 `graph.instagram.com` / 쓰레드 `graph.threads.net` — 상태 필드: 인스타 `status_code` / 쓰레드 `status`
- 옵션: `--video --caption-file --cover --location-id/--no-location --publish --dry-run --delete-cloudinary --cloudinary-status --whoami`
