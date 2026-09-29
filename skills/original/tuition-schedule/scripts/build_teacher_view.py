"""
classes.json -> 선생님별 주간 시간표 (선생님 행 + 요일 컬럼, 카드 스택)
예시 템플릿(jenny-dr.github.io/my-workplace teacher_timetable.html) 디자인을 그대로 따른다.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from merge_utils import combine_class_sessions

HERE = os.path.dirname(__file__)
DATA = json.load(open(os.path.join(HERE, "..", "data", "classes.json"), encoding="utf-8"))
TEACHERS = DATA["teachers"]
CLASSES = DATA["classes"]

DAYS = ["월", "화", "수", "목", "금", "토", "일"]

PALETTE = [("#F2F0E8","#6A6044"), ("#E8F3FF","#2166A5"), ("#F5EAFF","#6A3FA0"),
           ("#FFF3D8","#8A5A00"), ("#EAF7EF","#257044"), ("#FFECEA","#A54234"),
           ("#E9F7F7","#287174"), ("#FFF0F6","#9B3D6B"), ("#EEF1FF","#4D5EA8")]

ROOM_CODE = {str(n): f"A{n}" for n in list(range(1,12))}

def to_min(t):
    h, m = t.split(":"); return int(h) * 60 + int(m)

def room_query(room):
    if room == "미정" or "·" in room:
        return None
    digits = "".join(ch for ch in room if ch.isdigit())
    return f"A{digits}" if digits else None

def build_teacher_rows():
    rows = []
    for tid, tname in TEACHERS.items():
        classes_for_teacher = [(idx, c) for idx, c in enumerate(CLASSES) if c["teacher_id"] == tid]
        if not classes_for_teacher:
            continue
        # weekly hours
        total_min = 0
        by_day = {d: [] for d in DAYS}
        for idx, c in classes_for_teacher:
            bg, fg = PALETTE[idx % len(PALETTE)]
            segs_by_day = {}
            for seg in combine_class_sessions(c["sessions"]):
                dur = to_min(seg["end"]) - to_min(seg["start"])
                total_min += dur
                segs_by_day.setdefault(seg["day"], []).append(seg)
            for day, segs in segs_by_day.items():
                segs.sort(key=lambda s: to_min(s["start"]))
                group_start = to_min(segs[0]["start"])
                for order, seg in enumerate(segs):
                    by_day[day].append(({**seg, "_sort": (group_start, c["id"], order)}, c, bg, fg))
        for d in DAYS:
            by_day[d].sort(key=lambda x: x[0]["_sort"])
        rows.append({
            "teacher": f"{tname}T",
            "hours": total_min // 60,
            "by_day": by_day,
        })
    rows.sort(key=lambda r: r["teacher"])
    return rows

def render_card(seg, c, bg, fg):
    kind = seg["kind"]
    kind_class = "clinic" if kind != "정규" else "regular"
    room = seg["room"]
    rq = room_query(room)
    room_html = f'<a href="index.html">A관 {room}</a>' if rq else f'{room}'
    return f'''<div class="class-card {kind_class}" style="--card-bg:{bg};--card-fg:{fg}">
        <div class="time-line">
          <strong>{seg['start']}~{seg['end']}</strong>
          <span>{kind}</span>
        </div>
        <div class="class-name">{c['name']} ({TEACHERS.get(c['teacher_id'], c['teacher_id'])}T)</div>
        <div class="room">{room_html}</div>
      </div>'''

def build():
    rows = build_teacher_rows()
    row_html = []
    for r in rows:
        day_cells = []
        for d in DAYS:
            cards = "".join(render_card(s, c, bg, fg) for s, c, bg, fg in r["by_day"][d])
            day_cells.append(f'<div class="day-cell">{cards}</div>')
        row_html.append(
            f'<section class="teacher-row"><div class="teacher-cell"><strong>{r["teacher"]}</strong>'
            f'<span>주 {r["hours"]}시간</span></div>{"".join(day_cells)}</section>'
        )

    html = f'''<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>선생님별 주간 시간표</title>
  <style>
    :root {{ --line:#d6dde8; --head:#f3f6fa; --text:#1f2937; --muted:#667085; }}
    * {{ box-sizing:border-box; }}
    body {{ margin:0; color:var(--text); background:#fff; font-family:"Malgun Gothic","Apple SD Gothic Neo",Arial,sans-serif; }}
    header {{ padding:16px 18px 12px; border-bottom:1px solid var(--line); }}
    h1 {{ margin:0; font-size:22px; letter-spacing:0; }}
    .wrap {{ padding:14px 16px 24px; overflow:auto; }}
    .board {{ min-width:1480px; border:1px solid var(--line); border-radius:8px; overflow:hidden; }}
    .week-head, .teacher-row {{ display:grid; grid-template-columns:140px repeat(7,minmax(185px,1fr)); }}
    .week-head {{ position:sticky; top:0; z-index:5; background:var(--head); font-weight:800; text-align:center; }}
    .week-head > div {{ padding:12px 8px; border-left:1px solid var(--line); }}
    .week-head > div:first-child {{ border-left:0; }}
    .teacher-row {{ border-top:1px solid var(--line); align-items:stretch; }}
    .teacher-cell {{ position:sticky; left:0; z-index:3; min-height:120px; padding:16px 10px; background:#fafbfd; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; border-right:1px solid var(--line); }}
    .teacher-cell strong {{ font-size:19px; }}
    .teacher-cell span {{ margin-top:5px; color:var(--muted); font-size:12px; }}
    .day-cell {{ min-height:120px; padding:6px; border-right:1px solid var(--line); background:#fff; }}
    .day-cell:last-child {{ border-right:0; }}
    .class-card {{ margin-bottom:6px; padding:9px 10px; border:1px solid var(--card-fg); border-radius:6px; background:var(--card-bg); color:var(--card-fg); overflow:hidden; }}
    .class-card:last-child {{ margin-bottom:0; }}
    .class-card.clinic {{ border-style:dashed; }}
    .time-line {{ display:flex; justify-content:space-between; gap:6px; align-items:center; font-size:13px; }}
    .time-line span {{ padding:2px 5px; border-radius:4px; background:rgba(255,255,255,.72); font-size:11px; font-weight:700; white-space:nowrap; }}
    .class-name {{ margin-top:6px; font-size:14px; font-weight:800; line-height:1.35; word-break:keep-all; }}
    .room {{ margin-top:5px; font-size:12px; font-weight:700; opacity:.88; }}
    .room a {{ color: inherit; text-decoration: underline; }}
    .room a:hover {{ opacity: 0.7; }}
    .note {{ margin-top:5px; font-size:11px; opacity:.8; }}
    .empty {{ padding:60px; text-align:center; color:var(--muted); }}
    @page {{ size:A3 landscape; margin:8mm; }}
    @media print {{
      header {{ padding:0 0 6mm; border:0; }}
      .wrap {{ padding:0; overflow:visible; }}
      .board {{ min-width:0; border-radius:0; }}
      .week-head, .teacher-row {{ grid-template-columns:85px repeat(7,1fr); }}
      .week-head {{ position:static; }}
      .teacher-cell {{ position:static; min-height:70px; padding:5px; }}
      .teacher-cell strong {{ font-size:11px; }}
      .day-cell {{ min-height:70px; padding:3px; }}
      .class-card {{ padding:4px; margin-bottom:3px; break-inside:avoid; }}
      .time-line, .class-name {{ font-size:8px; }}
      .time-line span, .room {{ font-size:7px; }}
      body {{ print-color-adjust:exact; -webkit-print-color-adjust:exact; }}
    }}
  </style>
</head>
<body>
  <header><h1>선생님별 주간 시간표</h1></header>
  <main class="wrap">
    <div class="board">
      <div class="week-head"><div>선생님</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div><div>일</div></div>
      {"".join(row_html)}
    </div>
  </main>
</body>
</html>'''
    return html

if __name__ == "__main__":
    out_path = os.path.join(HERE, "..", "output", "teacher_timetable.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(build())
    print("done: teacher_timetable.html")
