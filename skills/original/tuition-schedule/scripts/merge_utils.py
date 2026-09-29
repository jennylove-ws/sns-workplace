"""
공통 유틸: 같은 강의실·같은 요일에서 시간이 겹치는 클리닉 세션들을 자동으로 묶어서
하나의 합쳐진 항목(모든 반 이름 포함)으로 만든다.

규칙:
- 클리닉(clinic 또는 clinic_union)끼리는 같은 방+같은 요일에서 시간이 조금이라도
  겹치면 자동으로 하나로 합친다 (수동으로 group 태그를 안 달아도 됨).
- 정규(clinic 아님) 세션은 절대 자동으로 합치지 않는다 — 정규끼리 겹치면 그건
  진짜 이중배정 오류일 수 있으므로 validate.py가 따로 잡아내야 한다. 정규를 합치고
  싶으면 반드시 session에 명시적으로 "group" 태그를 달아야 한다 (의도된 합반).
- group 태그가 같은 세션들은 클리닉 여부와 상관없이 항상 강제로 합쳐진다.
"""


def to_min(t):
    h, m = t.split(":")
    return int(h) * 60 + int(m)


def combine_class_sessions(sessions, merge_multiroom=True):
    """
    한 반(class) 안에서:
    - 강의실이 '미정'인 세션은 제외한다.
    - merge_multiroom=True일 때: 같은 요일·같은 시작/끝 시간에 강의실만 다른 세션들을
      하나로 합쳐서 room을 '8·9강의실'처럼 합친다 (클리닉 연합반이 방 2개 쓰는 경우).
    - 그 다음, 같은 요일·같은 강의실에서 끝시간=시작시간으로 바로 이어지는 세션들을
      하나로 합쳐서 시간 범위를 넓힌다 (정규 끝나고 바로 같은 방에서 클리닉하는 경우).
      합쳐진 카드는 정규+클리닉이 섞였으면 kind='정규+클리닉', 전부 클리닉이면 '클리닉',
      전부 정규면 '정규'로 표시한다.
    반환: [{"day","start","end","room","kind"}, ...]
    """
    by_day = {}
    for s in sessions:
        if s.get("room") == "미정":
            continue
        by_day.setdefault(s["day"], []).append(dict(s))

    result = []
    for day, sess_list in by_day.items():
        if merge_multiroom:
            groups = {}
            for s in sess_list:
                key = (s["start"], s["end"])
                groups.setdefault(key, []).append(s)
            stage1 = []
            for (start, end), items in groups.items():
                rooms = sorted(set(i["room"] for i in items))
                if len(rooms) > 1 and all(r.endswith("강의실") for r in rooms):
                    combined_room = "·".join(r.replace("강의실", "") for r in rooms) + "강의실"
                else:
                    combined_room = "·".join(rooms)
                is_clinic = any(i.get("clinic") or i.get("clinic_union") for i in items)
                grp_vals = set(i.get("group") for i in items)
                grp = grp_vals.pop() if len(grp_vals) == 1 else None
                stage1.append({"start": start, "end": end, "room": combined_room, "clinic": is_clinic, "group": grp})
        else:
            stage1 = [{"start": s["start"], "end": s["end"], "room": s["room"],
                       "clinic": bool(s.get("clinic") or s.get("clinic_union")),
                       "group": s.get("group")} for s in sess_list]

        stage1.sort(key=lambda x: to_min(x["start"]))
        final = []
        for seg in stage1:
            if (final and final[-1]["end"] == seg["start"] and final[-1]["room"] == seg["room"]
                    and final[-1].get("group") == seg.get("group")):
                final[-1]["end"] = seg["end"]
                final[-1]["_has_clinic"] = final[-1].get("_has_clinic", final[-1]["clinic"]) or seg["clinic"]
                final[-1]["_has_regular"] = final[-1].get("_has_regular", not final[-1]["clinic"]) or (not seg["clinic"])
            else:
                seg["_has_clinic"] = seg["clinic"]
                seg["_has_regular"] = not seg["clinic"]
                final.append(seg)

        for f in final:
            if f["_has_clinic"] and f["_has_regular"]:
                kind = "정규+클리닉"
            elif f["_has_clinic"]:
                kind = "클리닉"
            else:
                kind = "정규"
            result.append({"day": day, "start": f["start"], "end": f["end"], "room": f["room"],
                            "kind": kind, "group": f.get("group")})
    return result


def _overlaps(a_start, a_end, b_start, b_end):
    return a_start < b_end and b_start < a_end


def merge_sessions(classes, teachers):
    """
    classes: DATA["classes"]
    teachers: DATA["teachers"]
    반환: [{"names": [...], "day":..., "room":..., "start":..., "end":...,
            "is_clinic": bool, "is_merged": bool}, ...]
    """
    items = []  # (class, session)
    for c in classes:
        for own_seg in combine_class_sessions(c["sessions"], merge_multiroom=False):
            s = {"day": own_seg["day"], "start": own_seg["start"], "end": own_seg["end"],
                 "room": own_seg["room"], "kind": own_seg["kind"]}
            if own_seg.get("group"):
                s["group"] = own_seg["group"]
            items.append((c, s))

    n = len(items)
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(x, y):
        rx, ry = find(x), find(y)
        if rx != ry:
            parent[rx] = ry

    def is_clinic_like(s):
        return s["kind"] != "정규"

    for i in range(n):
        ci, si = items[i]
        for j in range(i + 1, n):
            cj, sj = items[j]
            if si["room"] != sj["room"] or si["day"] != sj["day"]:
                continue
            same_group = si.get("group") and si.get("group") == sj.get("group")
            both_clinic = is_clinic_like(si) and is_clinic_like(sj)
            if same_group or (both_clinic and _overlaps(
                    to_min(si["start"]), to_min(si["end"]),
                    to_min(sj["start"]), to_min(sj["end"]))):
                union(i, j)

    clusters = {}
    for i in range(n):
        clusters.setdefault(find(i), []).append(i)

    results = []
    for idxs in clusters.values():
        members = [items[i] for i in idxs]
        c0, s0 = members[0]
        room, day = s0["room"], s0["day"]
        starts = [to_min(s["start"]) for _, s in members]
        ends = [to_min(s["end"]) for _, s in members]

        def mfmt(m):
            return f"{m // 60:02d}:{m % 60:02d}"

        names = []
        seen = set()
        for c, s in members:
            teacher = teachers.get(c["teacher_id"], c["teacher_id"])
            label = f"{c['name']} ({teacher}T)"
            if label not in seen:
                seen.add(label)
                names.append(label)
        has_regular = any(s["kind"] in ("정규", "정규+클리닉") for _, s in members)
        has_clinic = any(s["kind"] in ("클리닉", "정규+클리닉") for _, s in members)
        if has_regular and has_clinic:
            kind = "정규+클리닉"
        elif has_clinic:
            kind = "클리닉"
        else:
            kind = "정규"
        results.append({
            "names": names,
            "day": day,
            "room": room,
            "start": mfmt(min(starts)),
            "end": mfmt(max(ends)),
            "startMin": min(starts),
            "endMin": max(ends),
            "kind": kind,
            "is_clinic": kind != "정규",
            "is_merged": len(members) > 1,
        })
    return results
