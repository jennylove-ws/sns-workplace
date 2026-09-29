"""classes.json 안에서 물리적으로 불가능한 강의실 이중배정만 걸러서 보고한다.
(클리닉연합처럼 의도된 동시배정은 clinic_union 플래그로 제외)"""
import json, os
from collections import defaultdict

HERE = os.path.dirname(__file__)
DATA = json.load(open(os.path.join(HERE, "..", "data", "classes.json"), encoding="utf-8"))
TEACHERS = DATA["teachers"]

def to_min(t):
    h, m = t.split(":"); return int(h)*60+int(m)

room_day = defaultdict(list)
for c in DATA["classes"]:
    tname = TEACHERS.get(c["teacher_id"], c["teacher_id"])
    for s in c["sessions"]:
        if s.get("clinic_union"):
            continue  # 의도된 합반
        if s["room"] == "미정":
            continue  # 강의실 미정 - 실제 겹침 여부 판단 불가
        s = dict(s)  # keep group info for pairwise check
        room_day[(s["room"], s["day"])].append(
            (to_min(s["start"]), to_min(s["end"]), c["name"], tname, s["start"], s["end"], s.get("group"),
             bool(s.get("clinic")))
        )

print("=== 강의실 이중배정 (물리적으로 불가능) ===")
found = False
seen = set()
for (room, day), items in room_day.items():
    items.sort()
    for i in range(len(items)-1):
        for j in range(i+1, len(items)):
            s1,e1,n1,t1,ss1,ee1,g1,c1 = items[i]
            s2,e2,n2,t2,ss2,ee2,g2,c2 = items[j]
            if g1 and g1 == g2:
                continue  # 의도적으로 같은 방을 공유하는 그룹
            if c1 and c2:
                continue  # 둘 다 클리닉이면 merge_utils가 자동으로 합쳐줌 (실제 충돌 아님)
            if s1 < e2 and s2 < e1:
                key = tuple(sorted([n1,n2])) + (room, day)
                if key in seen:
                    continue
                seen.add(key)
                found = True
                print(f"[{room} {day}요일] {n1}({t1}T) {ss1}-{ee1}  ⟷  {n2}({t2}T) {ss2}-{ee2}")
if not found:
    print("없음")

# ---------------------------------------------------------------------------
# 불필요한 group 태그 검사: group으로 묶여있지만 실제로는 시간이 하나도 안 겹치는
# 세션들 - 강제로 합칠 필요가 없는데 태그가 남아있는 경우 (맥심T 브릿지/이의고 건
# 같은 실수를 다시 만들지 않기 위한 체크)
print()
print("=== 불필요할 수 있는 group 태그 (실제로는 시간이 안 겹침) ===")
by_group = defaultdict(list)
for c in DATA["classes"]:
    for s in c["sessions"]:
        g = s.get("group")
        if g:
            by_group[g].append((c["name"], s["day"], s["start"], s["end"]))

found2 = False
for g, items in by_group.items():
    any_overlap = False
    for i in range(len(items)):
        for j in range(i+1, len(items)):
            n1, d1, s1, e1 = items[i]
            n2, d2, s2, e2 = items[j]
            if d1 == d2 and to_min(s1) < to_min(e2) and to_min(s2) < to_min(e1):
                any_overlap = True
    if not any_overlap:
        found2 = True
        print(f"group '{g}': 아래 세션들이 서로 시간이 안 겹치는데 group으로 묶여 있음 — 태그 제거 검토")
        for n, d, s, e in items:
            print(f"   {n} - {d} {s}-{e}")
if not found2:
    print("없음")

# ---------------------------------------------------------------------------
# 합쳐진(합반/클리닉) 박스 전체 미리보기: 파일을 전달하기 전에 정규/클리닉 라벨이
# 맞는지 한눈에 확인하기 위한 목록. "요일에 괄호가 있는 반(클리닉)"과 "괄호 없는
# 반(정규)"이 뒤섞여 잘못 합쳐지지 않았는지 여기서 확인한다.
print()
print("=== 합쳐진 박스 전체 미리보기 (정규/클리닉 라벨 확인용) ===")
import sys
sys.path.insert(0, HERE)
from merge_utils import merge_sessions
merged = merge_sessions(DATA["classes"], TEACHERS)
any_merged = False
for m in merged:
    if len(m["names"]) > 1:
        any_merged = True
        label = f"{m['kind']} 합반" if m["kind"] != "정규" else "합반"
        print(f"[{m['room']} {m['day']}요일 {m['start']}-{m['end']}] {label}")
        for n in m["names"]:
            print(f"   - {n}")
if not any_merged:
    print("없음")
