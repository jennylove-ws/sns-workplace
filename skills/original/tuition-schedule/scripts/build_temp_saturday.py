"""
이번 주 토요일만 임시로 강의실이 바뀐 경우를 위한 1회성 HTML.
classes.json은 건드리지 않고, 메모리에서만 강의실을 바꿔서 토요일 하루만 렌더링한다.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from merge_utils import merge_sessions

HERE = os.path.dirname(__file__)
DATA = json.load(open(os.path.join(HERE, "..", "data", "classes.json"), encoding="utf-8"))
TEACHERS = DATA["teachers"]

import copy
CLASSES = copy.deepcopy(DATA["classes"])

# ---- 이번 주만 적용되는 임시 강의실 변경 ----
OVERRIDES = [
    ("E017", "토", "09:00", "3강의실"),   # 녹지원 마스터반
    ("G001", "토", "13:00", "4강의실"),   # 박선애 중1 정규
    ("G002", "토", "14:30", "4강의실"),   # 박선애 중2 정규
]
by_id = {c["id"]: c for c in CLASSES}
for cid, day, start, new_room in OVERRIDES:
    for s in by_id[cid]["sessions"]:
        if s["day"] == day and s["start"] == start:
            s["room"] = new_room

CAPACITY = {"A관 1강의실":46,"A관 3강의실":18,"A관 4강의실":18,"A관 5강의실":9,
            "A관 6강의실":20,"A관 7강의실":15,"A관 8강의실":24,"A관 9강의실":20,"A관 10강의실":20,
            "A관 11강의실":None}
EQUIPMENT = {"A관 1강의실":"(B)(M)","A관 3강의실":"(B)","A관 4강의실":None,"A관 5강의실":None,
            "A관 6강의실":"(B)","A관 7강의실":"(B)","A관 8강의실":"(B)","A관 9강의실":"(B)","A관 10강의실":"(B)",
            "A관 11강의실":None}
ROOMS = [f"A관 {n}강의실" for n in [1,3,4,5,6,7,8,9,10,11]]

def to_min(t):
    h, m = t.split(":")
    return int(h) * 60 + int(m)

merged = merge_sessions(CLASSES, TEACHERS)
merged = [m for m in merged if "현민" not in " / ".join(m["names"])]
events = []
for m in merged:
    if m["day"] != "토" or m["room"] == "미정":
        continue
    room = f"A관 {m['room']}"
    if room not in CAPACITY:
        continue
    kind = f"{m['kind']} 합반" if (m["is_merged"] and m["kind"] != "정규") else ("합반" if m["is_merged"] else m["kind"])
    events.append({
        "name": " / ".join(m["names"]), "room": room, "kind": kind,
        "start": m["start"], "end": m["end"],
        "startMin": m["startMin"], "endMin": m["endMin"],
    })

# 이번 주만 임시로 추가되는 별도 일정 (기존 반과 무관한 신규 블록)
events.append({
    "name": "더프 전과목 모의고사", "room": "A관 8강의실", "kind": "모의고사",
    "start": "08:30", "end": "17:00",
    "startMin": to_min("08:30"), "endMin": to_min("17:00"),
})

start_min, end_min = 480, 1320
slot_h = 68

def fmt(mi):
    return f"{mi//60:02d}:{mi%60:02d}"

CHANGED_IDS = {"E017", "G001", "G002"}
changed_keys = set()  # (label, start_time) pairs — only the specific overridden session
for cid, day, start, new_room in OVERRIDES:
    c = by_id[cid]
    t = TEACHERS.get(c["teacher_id"], c["teacher_id"])
    changed_keys.add((f"{c['name']} ({t}T)", start))
changed_keys.add(("더프 전과목 모의고사", "08:30"))

room_head_html = "".join(
    f'<div><span>{r}</span>{f"<span class=\'capacity\'>정원 {CAPACITY[r]}명</span>" if CAPACITY.get(r) else ""}'
    f'{f"<span class=\'equipment\'>{EQUIPMENT[r]}</span>" if EQUIPMENT.get(r) else ""}</div>'
    for r in ROOMS
)

blocks_by_room = {r: [] for r in ROOMS}
for e in events:
    room = e["room"]
    top = (e["startMin"] - start_min) / 60 * slot_h
    height = (e["endMin"] - e["startMin"]) / 60 * slot_h
    is_changed = any(lbl in e["name"] and e["start"] == st for lbl, st in changed_keys)
    highlight = " changed" if is_changed else ""
    blocks_by_room[room].append(
        f'<div class="event{highlight}" style="top:{top:.0f}px;height:{max(height,18):.0f}px">'
        f'<strong>{e["name"]}</strong>'
        f'<div class="meta"><span>{e["start"]}~{e["end"]}</span><span class="badge">{e["kind"]}</span></div>'
        f'</div>'
    )

room_cols_html = "".join(
    f'<div class="room-col">{"".join(blocks_by_room[r])}</div>' for r in ROOMS
)
time_col_html = "".join(
    f'<div class="time" style="top:{(m - start_min)/60*slot_h:.0f}px">{fmt(m)}</div>'
    for m in range(start_min, end_min, 60)
)

html = f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>이번 주 토요일 임시 강의실</title>
<style>
  :root {{ --line:#d7dde7; --text:#1f2937; --muted:#667085; --header:#f6f8fb; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; font-family:"Malgun Gothic","Apple SD Gothic Neo",Arial,sans-serif; color:var(--text); }}
  header {{ padding:14px 18px; border-bottom:1px solid var(--line); background:#fffbe6; }}
  h1 {{ margin:0 0 4px; font-size:20px; }}
  .warn {{ font-size:13px; color:#8a5a00; font-weight:700; }}
  .wrap {{ padding:16px 18px; overflow-x:auto; }}
  .board {{ min-width:max(980px, calc(132px + 10*160px)); border:1px solid var(--line); border-radius:8px; overflow:hidden; }}
  .room-head {{ display:grid; grid-template-columns:132px repeat(10,minmax(150px,1fr)); background:var(--header); border-bottom:1px solid var(--line); font-weight:800; }}
  .room-head div {{ min-height:48px; display:flex; flex-direction:column; gap:2px; align-items:center; justify-content:center; border-left:1px solid var(--line); padding:8px; text-align:center; }}
  .capacity {{ display:block; color:var(--muted); font-size:12px; font-weight:700; }}
  .equipment {{ display:block; color:#8a5a00; font-size:11px; font-weight:700; }}
  .grid {{ position:relative; display:grid; grid-template-columns:132px repeat(10,minmax(150px,1fr));
    background:repeating-linear-gradient(to bottom, #fff 0, #fff 67px, var(--line) 68px); height:{(end_min-start_min)/60*slot_h:.0f}px; }}
  .time-col {{ position:relative; border-right:1px solid var(--line); background:#fbfcfe; }}
  .time {{ position:absolute; left:0; width:100%; height:68px; padding-top:8px; text-align:center; color:var(--muted); font-size:13px; border-bottom:1px solid var(--line); }}
  .room-col {{ position:relative; border-right:1px solid var(--line); }}
  .event {{ position:absolute; left:8px; right:8px; border-radius:7px; border:1px solid #4D5EA8; background:#EEF1FF; color:#4D5EA8; padding:8px 10px; overflow:hidden; }}
  .event.changed {{ border:2px solid #C0392B; background:#FFECEA; color:#A54234; }}
  .event strong {{ display:block; font-size:13px; line-height:1.3; }}
  .meta {{ display:flex; gap:6px; margin-top:6px; font-size:11px; }}
  .badge {{ padding:2px 6px; border-radius:999px; background:rgba(255,255,255,.7); font-weight:700; }}
  .legend {{ margin-top:8px; font-size:12px; color:#A54234; }}
</style>
</head>
<body>
<header>
  <h1>이번 주 토요일 임시 강의실</h1>
  <div class="warn">⚠ 이번 주 토요일만 적용되는 임시 배정입니다 — 원래 강의실 데이터는 바뀌지 않았습니다.</div>
  <div class="legend">■ 빨간 테두리 = 이번 주만 바뀐 것 (녹지원 마스터반, 박선애 정규반, 더프 전과목 모의고사 신규)</div>
</header>
<div class="wrap">
  <div class="board">
    <div class="room-head"><div>시간</div>{room_head_html}</div>
    <div class="grid">
      <div class="time-col">{time_col_html}</div>
      {room_cols_html}
    </div>
  </div>
</div>
</body>
</html>'''

out_path = os.path.join(HERE, "..", "output", "temp_saturday.html")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)
print("done:", out_path)
