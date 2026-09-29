"""
classes.json -> 강의실 시간표 (요일 탭 + 강의실 컬럼, 시간 비례 배치)
예시 템플릿(jenny-dr.github.io/my-workplace index.html) 디자인을 그대로 따른다.
"""
import json, os
import sys
sys.path.insert(0, os.path.dirname(__file__))
from merge_utils import merge_sessions, to_min

HERE = os.path.dirname(__file__)
DATA = json.load(open(os.path.join(HERE, "..", "data", "classes.json"), encoding="utf-8"))
TEACHERS = DATA["teachers"]
CLASSES = DATA["classes"]

DAYS = ["월", "화", "수", "목", "금", "토", "일"]
ROOMS = [f"A관 {n}강의실" for n in [1,3,4,5,6,7,8,9,10,11]]
CAPACITY = {"A관 1강의실":46,"A관 3강의실":18,"A관 4강의실":18,"A관 5강의실":9,
            "A관 6강의실":20,"A관 7강의실":15,"A관 8강의실":24,"A관 9강의실":20,"A관 10강의실":20,
            "A관 11강의실":None}
EQUIPMENT = {"A관 1강의실":"(B)(M)","A관 3강의실":"(B)","A관 4강의실":None,"A관 5강의실":None,
            "A관 6강의실":"(B)","A관 7강의실":"(B)","A관 8강의실":"(B)","A관 9강의실":"(B)","A관 10강의실":"(B)",
            "A관 11강의실":None}

PALETTE = [("#F2F0E8","#6A6044"), ("#E8F3FF","#2166A5"), ("#F5EAFF","#6A3FA0"),
           ("#FFF3D8","#8A5A00"), ("#EAF7EF","#257044"), ("#FFECEA","#A54234"),
           ("#E9F7F7","#287174"), ("#FFF0F6","#9B3D6B"), ("#EEF1FF","#4D5EA8")]

def to_min(t):
    h, m = t.split(":"); return int(h) * 60 + int(m)

def build_events():
    merged = merge_sessions(CLASSES, TEACHERS)
    events = []
    idx_counter = 0
    for m in merged:
        room = f"A관 {m['room']}"
        if room not in CAPACITY:
            continue
        bg, fg = PALETTE[idx_counter % len(PALETTE)]
        idx_counter += 1
        if m["is_merged"]:
            kind = f"{m['kind']} 합반" if m["kind"] != "정규" else "합반"
        else:
            kind = m["kind"]
        events.append({
            "name": " / ".join(m["names"]),
            "room": room, "day": m["day"], "kind": kind,
            "start": m["start"], "end": m["end"],
            "startMin": m["startMin"], "endMin": m["endMin"],
            "bg": bg, "fg": fg,
        })
    return events

def build():
    events = build_events()
    colors_js = {}
    for e in events:
        colors_js[e["name"]] = [e["bg"], e["fg"]]
    events_slim = [{k: e[k] for k in ("name","room","day","kind","start","end","startMin","endMin")} for e in events]

    events_json = json.dumps(events_slim, ensure_ascii=False)
    rooms_json = json.dumps(ROOMS, ensure_ascii=False)
    days_json = json.dumps(DAYS, ensure_ascii=False)
    cap_json = json.dumps(CAPACITY, ensure_ascii=False)
    equip_json = json.dumps(EQUIPMENT, ensure_ascii=False)
    colors_json = json.dumps(colors_js, ensure_ascii=False)

    html = f'''<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>강의실 시간표</title>
  <style>
    :root {{ --line: #d7dde7; --text: #1f2937; --muted: #667085; --header: #f6f8fb; --accent: #1f5f8b; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; font-family: "Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif; color: var(--text); background: #ffffff; }}
    .topbar {{ position: sticky; top: 0; z-index: 20; padding: 14px 18px 12px; background: rgba(255,255,255,.96); border-bottom: 1px solid var(--line); backdrop-filter: blur(8px); }}
    h1 {{ margin: 0 0 10px; font-size: 20px; }}
    .tabs {{ display: flex; gap: 6px; flex-wrap: wrap; }}
    button {{ border: 1px solid var(--line); background: #fff; color: var(--text); border-radius: 6px; padding: 8px 12px; font-size: 14px; cursor: pointer; }}
    button.active {{ background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 700; }}
    .wrap {{ padding: 16px 18px 24px; overflow-x: auto; }}
    .print-day {{ display: none; margin: 0 0 10px; font-size: 22px; font-weight: 900; text-align: center; }}
    .board {{ min-width: max(980px, calc(132px + 9 * 174px)); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: #fff; }}
    .room-head {{ display: grid; grid-template-columns: 132px repeat(9, minmax(160px, 1fr)); background: var(--header); border-bottom: 1px solid var(--line); font-weight: 800; }}
    .room-head div {{ min-height: 48px; display: flex; flex-direction: column; gap: 2px; align-items: center; justify-content: center; border-left: 1px solid var(--line); padding: 8px; text-align: center; }}
    .room-head div:first-child {{ border-left: 0; color: var(--muted); }}
    .capacity {{ display: block; color: var(--muted); font-size: 12px; font-weight: 700; }}
    .equipment {{ display: block; color: #8a5a00; font-size: 11px; font-weight: 700; margin-top: 2px; }}
    .grid {{ position: relative; display: grid; grid-template-columns: 132px repeat(9, minmax(160px, 1fr)); background: repeating-linear-gradient(to bottom, #fff 0, #fff 67px, var(--line) 68px); }}
    .time-col {{ position: relative; border-right: 1px solid var(--line); background: #fbfcfe; }}
    .time {{ position: absolute; left: 0; width: 100%; height: 68px; padding-top: 8px; text-align: center; color: var(--muted); font-size: 13px; border-bottom: 1px solid var(--line); }}
    .room-col {{ position: relative; border-right: 1px solid var(--line); }}
    .event {{ position: absolute; left: 8px; right: 8px; border-radius: 7px; border: 1px solid currentColor; padding: 11px 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(31,41,55,.06); }}
    .event strong {{ display: block; font-size: clamp(13px, 1.0vw, 17px); line-height: 1.35; word-break: keep-all; }}
    .meta {{ display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-top: 8px; font-size: clamp(11px, .78vw, 13px); line-height: 1.3; color: inherit; opacity: .88; }}
    .badge {{ padding: 2px 6px; border-radius: 999px; background: rgba(255,255,255,.7); font-weight: 700; }}
    .event.compact {{ padding: 7px 9px; }}
    .event.compact strong {{ font-size: clamp(12px, .85vw, 14px); line-height: 1.25; }}
    .event.compact .meta {{ margin-top: 4px; font-size: clamp(10px, .68vw, 12px); }}
    .empty {{ padding: 60px 18px; text-align: center; color: var(--muted); }}
    @media print {{
      .topbar {{ position: static; }} .tabs {{ display: none; }} .wrap {{ padding: 0; overflow: visible; }}
      .print-day {{ display: block; }} .board {{ border-radius: 0; min-width: 0; }} button {{ display: none; }}
      body {{ print-color-adjust: exact; -webkit-print-color-adjust: exact; }}
    }}
  </style>
</head>
<body>
  <div class="topbar"><h1>강의실 시간표</h1><div id="tabs" class="tabs"></div></div>
  <div class="wrap">
    <div id="printDay" class="print-day"></div>
    <div class="board">
      <div id="roomHead" class="room-head"></div>
      <div id="grid" class="grid"></div>
    </div>
  </div>
  <script>
    const events = {events_json};
    const rooms = {rooms_json};
    const days = {days_json};
    const capacities = {cap_json};
    const equipment = {equip_json};
    const startMin = 540, endMin = 1320, slotHeight = 68;
    let activeDay = days.find(d => events.some(e => e.day === d)) || "월";

    function fmt(min) {{ const h=String(Math.floor(min/60)).padStart(2,"0"), m=String(min%60).padStart(2,"0"); return `${{h}}:${{m}}`; }}

    function renderTabs() {{
      const tabs = document.getElementById("tabs"); tabs.innerHTML = "";
      days.forEach(day => {{
        const count = events.filter(e => e.day === day).length;
        const b = document.createElement("button");
        b.textContent = `${{day}} ${{count ? "("+count+")" : ""}}`;
        b.className = day === activeDay ? "active" : "";
        b.onclick = () => {{ activeDay = day; render(); }};
        tabs.appendChild(b);
      }});
    }}
    function renderHeader() {{
      document.getElementById("printDay").textContent = `${{activeDay}} 강의실 시간표`;
      const head = document.getElementById("roomHead");
      head.innerHTML = "<div>시간</div>" + rooms.map(r => {{
        const cap = capacities[r];
        const eq = equipment[r];
        return `<div><span>${{r}}</span>${{cap ? `<span class="capacity">정원 ${{cap}}명</span>` : ""}}${{eq ? `<span class="equipment">${{eq}}</span>` : ""}}</div>`;
      }}).join("");
    }}
    function renderGrid() {{
      const grid = document.getElementById("grid");
      grid.style.height = `${{((endMin-startMin)/60)*slotHeight}}px`;
      grid.innerHTML = "";
      const timeCol = document.createElement("div"); timeCol.className = "time-col";
      for (let m = startMin; m < endMin; m += 60) {{
        const label = document.createElement("div"); label.className = "time";
        label.style.top = `${{((m-startMin)/60)*slotHeight}}px`; label.textContent = fmt(m);
        timeCol.appendChild(label);
      }}
      grid.appendChild(timeCol);
      rooms.forEach(room => {{
        const col = document.createElement("div"); col.className = "room-col";
        const roomEvents = events.filter(e => e.day === activeDay && e.room === room)
          .sort((a,b) => a.startMin - b.startMin || a.endMin - b.endMin);
        roomEvents.forEach(ev => {{
          const block = document.createElement("div");
          const [bg, fg] = colors[ev.name] || ["#eef2f7", "#344054"];
          block.className = "event";
          if (ev.endMin - ev.startMin < 150) block.classList.add("compact");
          block.style.top = `${{((ev.startMin-startMin)/60)*slotHeight+5}}px`;
          block.style.height = `${{((ev.endMin-ev.startMin)/60)*slotHeight-10}}px`;
          block.style.background = bg; block.style.color = fg;
          block.innerHTML = `<strong>${{ev.name}}</strong><div class="meta"><span>${{ev.start}}~${{ev.end}}</span><span class="badge">${{ev.kind}}</span></div>`;
          col.appendChild(block);
        }});
        grid.appendChild(col);
      }});
      if (!events.some(e => e.day === activeDay)) {{
        const empty = document.createElement("div"); empty.className = "empty";
        empty.style.gridColumn = `2 / span ${{Math.max(rooms.length,1)}}`;
        empty.textContent = "이 요일에는 등록된 수업이 없습니다.";
        grid.appendChild(empty);
      }}
    }}
    const colors = {colors_json};
    function render() {{ renderTabs(); renderHeader(); renderGrid(); }}
    render();
  </script>
</body>
</html>'''
    return html

if __name__ == "__main__":
    out_path = os.path.join(HERE, "..", "output", "index.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(build())
    print("done: index.html")
