---
name: longform-video-design
description: Mandatory design checklist for every 돈5060 롱폼 (long-form) video build. Use BEFORE writing any composition code to draft and self-check a full beat-by-beat plan for any new long-form video, and again as a self-audit before rendering. Enforces short per-beat subtitles and a hard cap on bare-text slides so videos don't come out boring, repetitive, or plain — and catches violations at the planning stage, before a costly render/re-render cycle. Originally written for the HyperFrames-based build; the bucket classification and beat-planning principles carry over unchanged to the Remotion-based `don5060-longform` skill.
---

# 돈5060 롱폼 영상 제작 체크리스트

> **기술 스택 참고**: 이 체크리스트는 원래 HyperFrames(HTML/CSS/GSAP) 빌드용으로 쓰였다.
> 2026-09-28부터 돈5060 롱폼은 Remotion으로 전환됐지만(`don5060-longform` 스킬 참고),
> 여기 적힌 **비트 분할·버킷 분류·렌더 전 자체 감사 원칙은 기술 스택과 무관하게 그대로
> 유효**하다. `index.html`/`hyperframes render`라고 적힌 부분은 Remotion 빌드에서는 각각
> 씬 코드(`<Sequence>`)/`npx remotion render`로 치환해서 읽는다.

This exists because the same failure has recurred across multiple videos in this project
despite being asked to fix it each time: too many slides that are just narration text in
big bold letters with nothing else happening, and subtitle bars crammed with 2+ sentences
at once. Follow this checklist literally, not by vibe — count things.

**Re-rendering a full long-form video costs real time (~20-50 min) and real tokens. The
whole point of this skill is to catch violations at the PLANNING stage, before any HTML or
GSAP code is written — not to catch them after a render, when fixing means editing, re-linting,
re-snapshotting, and re-rendering the whole thing again. Section 0 below is not optional.**

## 0. Before writing any HTML: draft a full beat-by-beat plan and self-check it

Do this as an explicit planning pass, in your response to the user or in a scratch note —
never skip straight from "read the script" to "write index.html".

1. Break the full transcript/script into beats the same way you will split subtitle cues:
   one beat per clause/semantic unit (see Section 1's ~25-30 character guideline). This beat
   list is also your `subtitleCues` draft — build it now, not after the HTML exists.
2. For every beat, assign a bucket (A/B/C, see Section 2) and, for Bucket A, name the specific
   graphic (e.g. "numeral spotlight: 404만원", "don't-say/do-say card: 너희는 부모도 없냐 vs
   내가 가까이 있어서..."). If you can't name a concrete graphic for a beat in under 10 seconds
   of thought, that is a signal it's actually Bucket C (ambient), not a license to fall back to
   Bucket B.
3. Tally the plan: N total beats, N Bucket A, N Bucket B, N Bucket C. Verify Bucket B is ≤4
   (hook/outro exempt) and no two Bucket C beats in a row use the same ambient style (equalizer/
   rising-lines/split-screen/waveform — rotate).
4. Verify every beat's planned subtitle text is verbatim narration, a single clause, and fits on
   one line in the bottom bar. If a beat's planned subtitle has a period or semicolon joining two
   independent clauses, or is simply long enough that it would wrap to a second line, split it
   into two beats now, at plan time — never paraphrase it shorter, never let it wrap, and never
   discover this after it looks cramped in a snapshot.
5. State this tally explicitly before writing any code: "N beats total — N Bucket A, N Bucket B
   (cap 4), N Bucket C, rotation: [eq→rise→split→...]". Only after this checks out clean should
   `index.html` construction begin, built directly from this plan (the plan's beat list becomes
   `slides` + `subtitleCues`, not something reconciled with the HTML after the fact).

If the script changes or a beat's content turns out hard to visualize once you're actually
writing HTML, redo steps 2-4 for just that beat before continuing — don't let the implementation
silently drift from the checked plan (that drift is exactly how bare-text slides crept back in
last time, despite the plan-free version of this checklist existing).

## 1. One subtitle beat = one semantic unit, verbatim, one line, never a wall of text

- **Verbatim, not paraphrased.** The subtitle must be the actual narration text as spoken —
  never a summary, shortened rewrite, or paraphrase of what's being said. If you're tempted to
  compress a long sentence into a shorter subtitle string, that's a signal to *split* it into
  multiple beats (each one verbatim) instead of rewording it.
- **Never merge two sentences (or two independent clauses joined by a period) into one subtitle
  string.** If the transcript has "A입니다. B입니다.", that is **two beats**, each with its own
  slide and its own short subtitle — never one beat with both sentences stacked in the bottom
  bar.
- **One line only, not just "not too many lines."** A subtitle should read as a single breath,
  roughly one clause, and must fit on **one line** in the bottom bar — not wrap to 2+ lines at
  all. Treat "fits on one line" as the hard constraint, not "under ~25-30 characters" as a soft
  guideline — if it wraps even to a second line, it's too long.
- **If a single clause is still too long to fit one line, split it further at the next natural
  break** (a comma, a conjunction, a subject/predicate boundary) rather than letting it wrap or
  shrinking the font to force-fit it. The overflow portion becomes the next beat's subtitle
  (with its own cue timing carved out of the same slide's window if the visual doesn't need its
  own new slide — see the `subtitleCues` decoupled-array pattern below), not extra lines in the
  same cue. Prioritize readability over cramming — a viewer should be able to read the whole
  line at a glance without their eyes having to jump.

**Concrete anti-pattern that shipped and was flagged by the user**: a single beat with subtitle
"나중에 재산 나눌 때 공평하게 하겠지, 라는 막연한 불안. 이런 감정들이 쌓이면, 부모님이 살아
계신 동안에도, 돌아가신 후에도, 형제 관계가 완전히 끝나버리는 경우가 많습니다." — two full
sentences crammed into one subtitle, wrapping to 2+ lines, on top of a slide that was *also*
just bare bold text. Don't do this. That should have been at minimum 2 separate beats.

## 2. Every slide gets classified into exactly one bucket before it's built

Do this classification pass explicitly, per beat, before writing any HTML — don't default to
"big text" because it's the easiest thing to write.

- **Bucket A — Info-graphic (this is the DEFAULT, target ~70-80% of all slides).** Numeral
  spotlight, bullet list, table, checklist, comparison/contrast card (e.g. don't-say/do-say),
  site-card, icon + short label. If the narration contains *any* concrete noun, number, named
  thing, or contrastable idea, it belongs here — find the graphic, don't just caption it.
- **Bucket B — Emphasis / signature statement (RESERVED, hard cap: 2-4 slides for the ENTIRE
  video, no matter how long the video is).** Large bold text matching the narration almost
  verbatim, reserved *only* for the single most important thesis/turning-point lines in the
  whole script — the ones the video is actually building toward. Always pair with a glow pulse
  or other motion, never fully static. The channel outro wordmark and the opening hook are
  exempt from this cap (they're structurally a different kind of moment, not mid-content
  filler) — but nothing else gets a free pass into Bucket B just because it was hard to find a
  graphic for.
- **Bucket C — Ambient animation (for connectors/rhetorical questions/transitions with no
  concrete fact to show).** Equalizer bars, rising lines, split-screen reveal, waveform sweep —
  rotate between them, never the same style twice in a row. This is what a "nothing to show"
  beat becomes — never a Bucket B bare-text slide by default.

## 3. Mandatory pre-render self-audit (second checkpoint, do this, don't skip it)

This is the second of two checkpoints — Section 0's plan is the first, done before any HTML
exists. This one re-verifies the actual built `slides`/`subtitleCues` arrays still match that
plan, since implementation details sometimes force small changes. Before running `hyperframes
render`, count your own slides array by bucket. If Bucket B exceeds 4 total (or the hook/outro-
exempted count exceeds ~10% of all slides), go back and convert the excess into Bucket A or C.
State the count explicitly to yourself/in your response before rendering — "N info-graphic, N
emphasis (cap 4), N ambient" — not just "looks fine." If this count no longer matches Section 0's
plan, that mismatch is itself worth noting — it means the build drifted from the checked plan.

## 4. Reference examples already validated in this project

- Ambient equalizer bars: `.amb-eq .bar` + `keyframes` scaleY sequences (never `Math.random()`
  or GSAP `random()` strings — see the non-determinism rule in project memory).
- Rising lines: `.amb-rise .line`, `fromTo(scaleY:0→1, stagger)`.
- Split-screen: `.amb-split .half.l/.r` sliding in from `x:-100%/100%` to `0`.
- Don't-say/do-say contrast card: red ✕ badge + muted-red text vs. gold ✓ badge + full-bright
  text, introduced in `05_형제재산문제` — reach for this whenever a script has an explicit
  "say this, not that" structure.
- Numeral spotlight, bullet list, checklist, table, quote-card, CTA badges, outro wordmark —
  all established across `03_퇴직후_건강보험료`, `04_숨은돈찾기`, `05_형제재산문제`.

Persistent bottom subtitle bar stays on every slide regardless of bucket (project-wide rule,
see memory) — this checklist is about what's *above* the subtitle bar, not about removing it.
