#!/usr/bin/env python3
"""
gen_dates.py - Deterministic weekday-based date generator for 학원 회차/수강료 계산.

Never compute these dates by hand / in your head — always call this script.
Date and day-of-week arithmetic is exactly the kind of thing that silently goes
wrong when eyeballed, and a single off-by-one produces a wrong tuition total.

USAGE
-----
Single pattern, per-session (회당) class:
    python gen_dates.py --start 2026-08-17 --end 2026-09-30 --weekdays tue,thu,sat

Single pattern, default to one calendar month (give either --month or --start/--end):
    python gen_dates.py --month 2026-09 --weekdays wed

Multiple independent weekday patterns in ONE call (e.g. "화(목)" style classes
where a class meets on Tue AND Sat each week — just list both codes):
    python gen_dates.py --start 2026-08-17 --end 2026-09-30 --weekdays tue,sat

Compute per-session tuition directly (adds count × fee to the output):
    python gen_dates.py --start 2026-09-01 --end 2026-09-30 --weekdays mon,fri --fee 62500

Split one class into multiple sub-periods in one call (e.g. "8월 따로, 9월 따로"):
    python gen_dates.py --weekdays sat --split 2026-08-15:2026-08-31 --split 2026-09-01:2026-09-30 --fee 80000

Weekday codes (Korean class notation -> code): 월=mon 화=tue 수=wed 목=thu 금=fri 토=sat 일=sun
Comma-separate multiple codes for classes that meet more than once a week.

OUTPUT
------
Prints, for each period:
  - the matched dates formatted the way these documents conventionally show them
    ("7/21, 25, 28, 8/1, ..." — month prefix repeated only when the month changes)
  - the count (총 N강)
  - if --fee given: count × fee (회당 계산) — this is ONLY correct for 회당(per-session)
    classes. For 1개월 정액(flat monthly) classes, do NOT multiply — the dates are for
    display/attendance only, and the fee is whatever flat amount was already agreed;
    just report the count alongside the fixed fee text yourself.
"""
import argparse
import datetime
import sys

WD = {"mon": 0, "화": 1, "tue": 1, "수": 2, "wed": 2, "목": 3, "thu": 3,
      "금": 4, "fri": 4, "토": 5, "sat": 5, "일": 6, "sun": 6, "월": 0}


def parse_weekdays(s):
    codes = [c.strip().lower() for c in s.split(",") if c.strip()]
    out = []
    for c in codes:
        if c not in WD:
            sys.exit(f"Unknown weekday code: {c!r}. Use mon/tue/wed/thu/fri/sat/sun "
                      f"(or 월/화/수/목/금/토/일).")
        out.append(WD[c])
    if not out:
        sys.exit("No weekdays given.")
    return sorted(set(out))


def gen(weekdays, start, end):
    dates = []
    cur = start
    one_day = datetime.timedelta(days=1)
    while cur <= end:
        if cur.weekday() in weekdays:
            dates.append(cur)
        cur += one_day
    return dates


def fmt(dates):
    out = []
    last_month = None
    for d in dates:
        if d.month != last_month:
            out.append(f"{d.month}/{d.day}")
            last_month = d.month
        else:
            out.append(str(d.day))
    return ", ".join(out)


def month_bounds(ym):
    year, month = (int(x) for x in ym.split("-"))
    start = datetime.date(year, month, 1)
    if month == 12:
        end = datetime.date(year, 12, 31)
    else:
        end = datetime.date(year, month + 1, 1) - datetime.timedelta(days=1)
    return start, end


def parse_date(s):
    return datetime.date.fromisoformat(s)


def run_period(weekdays, start, end, fee, label=None):
    dates = gen(weekdays, start, end)
    count = len(dates)
    line = f"{fmt(dates)} (총 {count}강"
    if fee is not None:
        total = count * fee
        line += f", {total:,}원)"
    else:
        line += ")"
    prefix = f"{label}: " if label else ""
    print(prefix + line)
    return dates, count


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                  formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--weekdays", required=True,
                     help="Comma-separated weekday codes, e.g. tue,thu,sat or 화,목,토")
    ap.add_argument("--start", help="Period start date, YYYY-MM-DD")
    ap.add_argument("--end", help="Period end date, YYYY-MM-DD")
    ap.add_argument("--month", help="Shortcut for a full calendar month, YYYY-MM "
                                     "(use instead of --start/--end)")
    ap.add_argument("--fee", type=int, help="회당 단가 (per-session fee, KRW). "
                                             "Omit for 1개월 정액 classes.")
    ap.add_argument("--split", action="append", default=[],
                     help="Sub-period as START:END (YYYY-MM-DD:YYYY-MM-DD). "
                          "Repeat --split to compute several sub-periods "
                          "(e.g. 8월 따로 / 9월 따로) in one call.")
    args = ap.parse_args()

    weekdays = parse_weekdays(args.weekdays)

    periods = []
    if args.split:
        for s in args.split:
            try:
                a, b = s.split(":")
            except ValueError:
                sys.exit(f"--split must be START:END, got {s!r}")
            periods.append((parse_date(a), parse_date(b)))
    elif args.month:
        periods.append(month_bounds(args.month))
    elif args.start and args.end:
        periods.append((parse_date(args.start), parse_date(args.end)))
    else:
        sys.exit("Provide --month, or --start/--end, or one or more --split ranges.")

    grand_dates = []
    for start, end in periods:
        label = None
        if len(periods) > 1:
            label = f"{start.month}월" if start.month == end.month else f"{start}~{end}"
        dates, count = run_period(weekdays, start, end, args.fee, label)
        grand_dates.extend(dates)

    if len(periods) > 1:
        total_count = len(grand_dates)
        line = f"합계: 총 {total_count}강"
        if args.fee is not None:
            line += f", {total_count * args.fee:,}원"
        print(line)


if __name__ == "__main__":
    main()
