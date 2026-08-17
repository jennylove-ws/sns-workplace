#!/usr/bin/env python3
"""
docs/tts-script.md (파트별 실제 TTS 원문)과 public/audio/timeline.json
(각 wav의 실측 길이)을 합쳐서, 문장 단위로 자막 청크 타임라인을 생성한다.
글자수로 강제로 자르지 않고 마침표/물음표/느낌표 경계에서만 끊는다
(소수점 "0.98" 같은 숫자는 뒤에 공백이 없으므로 문장 경계로 오인하지 않음).
결과는 src/data/subtitles.generated.ts, src/data/audioParts.generated.ts 로 저장.
"""
import json
import re
import os

FPS = 30
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT_MD = os.path.join(ROOT, "docs/tts-script.md")
TIMELINE_JSON = os.path.join(ROOT, "public/audio/timeline.json")
OUT_SUBS = os.path.join(ROOT, "src/data/subtitles.generated.ts")
OUT_AUDIO = os.path.join(ROOT, "src/data/audioParts.generated.ts")

# 문장 종결 부호(.!?…) 바로 뒤에 공백/줄끝이 오는 지점에서만 자른다.
# "0.98달러"처럼 숫자 뒤에 곧바로 글자가 이어지는 경우는 공백이 없어 분리되지 않는다.
SENTENCE_SPLIT = re.compile(r"(?<=[.!?…])\s+")

# 문장이 이 길이를 넘으면 화면에서 줄바꿈되다 못해 마지막 한두 글자만
# 외로이 남는("widow") 모양이 되기 쉽다. 그럴 때만 쉼표 경계에서 나눈다.
LONG_SENTENCE_LEN = 34

def parse_parts(md: str):
    # split on "## 파트 NN" headers
    blocks = re.split(r"\n## 파트 (\d+)\s.*\n", md)
    # blocks[0] is preamble; then alternating (partNum, body)
    parts = {}
    it = iter(blocks[1:])
    for num, body in zip(it, it):
        # drop the "*원고 구간: ...*" line
        body = re.sub(r"^\*원고 구간:.*\*\n", "", body.strip(), flags=re.MULTILINE)
        body = body.strip()
        # stop at the next "---" separator
        body = body.split("\n---")[0].strip()
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
        parts[int(num)] = paragraphs
    return parts

def split_long_sentence(sentence: str):
    """긴 문장을 쉼표 경계에서 자연스러운 절 단위로 나눈다.
    (예: "...굴리는데, 앵커는 코드가 굴린다는 것 정도." -> 2개 화면)"""
    if len(sentence) <= LONG_SENTENCE_LEN or "," not in sentence:
        return [sentence]

    clauses = [c.strip() for c in re.split(r"(?<=,)\s+", sentence) if c.strip()]
    if len(clauses) < 2:
        return [sentence]

    # 절을 앞에서부터 그리디하게 묶되, LONG_SENTENCE_LEN을 넘기기 직전에
    # 끊는다. 단, 지금까지 모은 조각이 너무 짧으면(<10자) 외로운 한 줄이
    # 되지 않도록 한 절 더 붙인다.
    chunks = []
    cur = clauses[0]
    for clause in clauses[1:]:
        candidate = f"{cur} {clause}"
        if len(candidate) <= LONG_SENTENCE_LEN or len(cur) < 10:
            cur = candidate
        else:
            chunks.append(cur)
            cur = clause
    chunks.append(cur)
    return chunks if len(chunks) > 1 else [sentence]

def chunk_paragraph(text: str):
    sentences = [s.strip() for s in SENTENCE_SPLIT.split(text) if s.strip()]
    if not sentences:
        return [text]
    chunks = []
    for s in sentences:
        chunks.extend(split_long_sentence(s))
    return chunks

def main():
    with open(SCRIPT_MD, encoding="utf-8") as f:
        md = f.read()
    with open(TIMELINE_JSON, encoding="utf-8") as f:
        timeline = json.load(f)

    parts_text = parse_parts(md)
    seg_by_num = {}
    extra_segments = []
    for seg in timeline["segments"]:
        # 6-1.wav is an inserted clip with no matching TTS-script text (no
        # transcript to build subtitles from) -- still play its audio, just
        # without subtitle coverage, instead of silently dropping 3.5s of narration.
        name = seg["file"]
        if name == "6-1.wav":
            extra_segments.append(seg)
            continue
        num = int(name.replace(".wav", ""))
        seg_by_num[num] = seg

    assert set(parts_text.keys()) == set(seg_by_num.keys()), (
        set(parts_text.keys()) ^ set(seg_by_num.keys())
    )

    subtitle_lines = []
    audio_parts = []

    for num in sorted(parts_text.keys()):
        paragraphs = parts_text[num]
        seg = seg_by_num[num]
        part_start = seg["startSec"]
        part_dur = seg["durationSec"]

        audio_parts.append({
            "part": num,
            "file": seg["file"],
            "startSec": part_start,
            "durationSec": part_dur,
        })

        total_chars = sum(len(p) for p in paragraphs)
        cursor = part_start
        for p in paragraphs:
            p_dur = part_dur * (len(p) / total_chars) if total_chars else 0
            p_start = cursor
            chunks = chunk_paragraph(p)
            chunk_total_chars = sum(len(c) for c in chunks)
            sub_cursor = p_start
            for c in chunks:
                c_dur = p_dur * (len(c) / chunk_total_chars) if chunk_total_chars else 0
                start = sub_cursor
                end = sub_cursor + c_dur
                subtitle_lines.append({
                    "text": c,
                    "startFrame": round(start * FPS),
                    "endFrame": round(end * FPS),
                    "part": num,
                })
                sub_cursor = end
            cursor = p_start + p_dur

    for seg in extra_segments:
        audio_parts.append({
            "part": 6.1,
            "file": seg["file"],
            "startSec": seg["startSec"],
            "durationSec": seg["durationSec"],
        })
    audio_parts.sort(key=lambda p: p["startSec"])

    # ensure no zero-length / overlapping frames from rounding
    for i in range(1, len(subtitle_lines)):
        if subtitle_lines[i]["startFrame"] < subtitle_lines[i - 1]["endFrame"]:
            subtitle_lines[i]["startFrame"] = subtitle_lines[i - 1]["endFrame"]
        if subtitle_lines[i]["endFrame"] <= subtitle_lines[i]["startFrame"]:
            subtitle_lines[i]["endFrame"] = subtitle_lines[i]["startFrame"] + 1

    os.makedirs(os.path.dirname(OUT_SUBS), exist_ok=True)

    with open(OUT_SUBS, "w", encoding="utf-8") as f:
        f.write("// AUTO-GENERATED by scripts/gen-subtitles.py — do not hand-edit.\n")
        f.write("import {SubtitleLine} from '../components/Subtitle';\n\n")
        f.write("export const fullSubtitles: (SubtitleLine & {part: number})[] = ")
        f.write(json.dumps(subtitle_lines, ensure_ascii=False, indent=2))
        f.write(";\n")

    with open(OUT_AUDIO, "w", encoding="utf-8") as f:
        f.write("// AUTO-GENERATED by scripts/gen-subtitles.py — do not hand-edit.\n\n")
        f.write("export type AudioPart = {part: number; file: string; startSec: number; durationSec: number};\n\n")
        f.write("export const audioParts: AudioPart[] = ")
        f.write(json.dumps(audio_parts, ensure_ascii=False, indent=2))
        f.write(";\n\n")
        total = timeline["totalDurationSec"]
        f.write(f"export const TOTAL_DURATION_SEC = {total};\n")

    print(f"parts: {len(parts_text)}, subtitle chunks: {len(subtitle_lines)}")
    print(f"total duration: {timeline['totalDurationSec']:.1f}s = {timeline['totalDurationSec']/60:.2f} min")

if __name__ == "__main__":
    main()
