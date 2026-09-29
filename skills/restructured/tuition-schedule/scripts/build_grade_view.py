"""
classes.json -> 학년별 시간표 (학부모용). 요일 컬럼 + 카드 스택 방식(겹치는 시간대 병행반도
그냥 카드가 쌓일 뿐 겹치지 않음). 상단에 과목 필터 버튼(전체/국어/영어/수학/과학/...).
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from merge_utils import combine_class_sessions

HERE = os.path.dirname(__file__)
DATA = json.load(open(os.path.join(HERE, "..", "data", "classes.json"), encoding="utf-8"))
TEACHERS = DATA["teachers"]
CLASSES = DATA["classes"]

DAYS = ["월", "화", "수", "목", "금", "토", "일"]

SUBJECT_COLOR = {
    "국어": ("#E8F5EE", "#1B7A43"),
    "영어": ("#FFF1E6", "#B5560A"),
    "수학": ("#E9EEFF", "#3949AB"),
    "과학": ("#F5EBFF", "#7B3FA0"),
    "수원외고": ("#E6F7F5", "#0D8C7D"),
    "외대부고": ("#FDEAF2", "#B03368"),
    "약술논술": ("#F0F0F0", "#555555"),
}

def to_min(t):
    h, m = t.split(":")
    return int(h) * 60 + int(m)

def build(grade, title):
    classes = [c for c in CLASSES if c["grade"] == grade]
    subjects_present = sorted(set(c["subject"] for c in classes),
                               key=lambda s: list(SUBJECT_COLOR.keys()).index(s) if s in SUBJECT_COLOR else 99)

    by_day = {d: [] for d in DAYS}
    for c in classes:
        teacher = TEACHERS.get(c["teacher_id"], c["teacher_id"])
        bg, fg = SUBJECT_COLOR.get(c["subject"], ("#EEE", "#333"))
        segs_by_day = {}
        for seg in combine_class_sessions(c["sessions"]):
            segs_by_day.setdefault(seg["day"], []).append(seg)
        for day, segs in segs_by_day.items():
            # 같은 반의 세션들은 항상 붙어서 나오도록, 그룹 단위로 정렬 키를 매긴다
            # (class id를 tie-break에 넣어서 같은 시작시간의 다른 반과 안 섞이게 함)
            segs.sort(key=lambda s: to_min(s["start"]))
            group_start = to_min(segs[0]["start"])
            for order, seg in enumerate(segs):
                room_txt = f"A관 {seg['room']}"
                by_day[day].append({
                    "subject": c["subject"], "name": c["name"], "teacher": teacher,
                    "start": seg["start"], "end": seg["end"], "room": room_txt, "kind": seg["kind"],
                    "bg": bg, "fg": fg,
                    "sort": (group_start, c["id"], order),
                })
    for d in DAYS:
        by_day[d].sort(key=lambda x: x["sort"])

    filter_buttons = ['<button class="filter-btn active" data-subject="전체">전체</button>']
    for subj in subjects_present:
        filter_buttons.append(f'<button class="filter-btn" data-subject="{subj}">{subj}</button>')

    def render_card(item):
        return f'''<div class="class-card" data-subject="{item['subject']}" style="--bg:{item['bg']};--fg:{item['fg']}">
          <div class="card-top"><strong>{item['name']}</strong><span class="kind">{item['kind']}</span></div>
          <div class="card-meta">{item['teacher']}T · {item['start']}~{item['end']}</div>
          <div class="card-room">{item['room']}</div>
        </div>'''

    day_cols = []
    for d in DAYS:
        cards = "".join(render_card(it) for it in by_day[d]) or '<div class="empty">수업 없음</div>'
        day_cols.append(f'<div class="day-col"><div class="day-head">{d}</div><div class="day-body">{cards}</div></div>')

    html = f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>
  :root {{ --line:#e3e6ea; --text:#222; --muted:#888; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; font-family:"Apple SD Gothic Neo","Malgun Gothic",sans-serif; background:#fafbfc; color:var(--text); }}
  header {{ position:sticky; top:0; z-index:10; background:#fff; border-bottom:1px solid var(--line); padding:14px 14px 10px; }}
  h1 {{ margin:0 0 10px; font-size:19px; }}
  .filters {{ display:flex; gap:6px; overflow-x:auto; padding-bottom:2px; }}
  .filter-btn {{ flex:none; border:1px solid var(--line); background:#f5f6f8; color:#555; border-radius:999px;
    padding:9px 15px; font-size:14px; font-weight:600; white-space:nowrap; }}
  .filter-btn.active {{ background:#222; color:#fff; border-color:#222; }}
  .board {{ padding:12px; display:flex; flex-direction:column; gap:10px; }}
  .day-col {{ background:#fff; border:1px solid var(--line); border-radius:10px; overflow:hidden; }}
  .day-head {{ background:#f5f6f8; font-weight:800; padding:9px 12px; font-size:14px; border-bottom:1px solid var(--line); }}
  .day-body {{ padding:8px; display:flex; flex-direction:column; gap:8px; }}
  .class-card {{ border:1px solid var(--fg); background:var(--bg); color:var(--fg); border-radius:8px; padding:10px 12px; }}
  .card-top {{ display:flex; justify-content:space-between; align-items:baseline; gap:8px; }}
  .card-top strong {{ font-size:15px; line-height:1.35; word-break:keep-all; }}
  .kind {{ font-size:11px; font-weight:700; background:rgba(255,255,255,.65); padding:2px 7px; border-radius:999px; white-space:nowrap; }}
  .card-meta {{ margin-top:4px; font-size:13px; opacity:.9; }}
  .card-room {{ margin-top:2px; font-size:12px; opacity:.8; }}
  .empty {{ color:var(--muted); font-size:13px; padding:10px 4px; }}
  @media (min-width:760px) {{
    .board {{ display:grid; grid-template-columns:repeat(7,1fr); align-items:start; }}
  }}
</style>
</head>
<body>
<header>
  <h1>{title}</h1>
  <div class="filters">{"".join(filter_buttons)}</div>
</header>
<main class="board">{"".join(day_cols)}</main>
<script>
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.class-card');
  buttons.forEach(b => b.addEventListener('click', () => {{
    buttons.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const subj = b.dataset.subject;
    cards.forEach(c => {{
      c.style.display = (subj === '전체' || c.dataset.subject === subj) ? '' : 'none';
    }});
  }}));
</script>
</body>
</html>'''
    return html

if __name__ == "__main__":
    grade = sys.argv[1] if len(sys.argv) > 1 else "고1"
    title = f"{grade} 시간표"
    out_path = os.path.join(HERE, "..", "output", f"{grade}_시간표.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(build(grade, title))
    print("done:", out_path)
