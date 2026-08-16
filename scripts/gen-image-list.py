#!/usr/bin/env python3
"""public/images/ 안의 파일 목록을 src/data/allImages.generated.ts 로 내보낸다."""
import os, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "public/images")
OUT = os.path.join(ROOT, "src/data/allImages.generated.ts")

files = sorted(os.listdir(IMG_DIR))
files = [f for f in files if f.lower().endswith((".png", ".jpg", ".jpeg"))]

with open(OUT, "w", encoding="utf-8") as f:
    f.write("// AUTO-GENERATED — do not hand-edit. Run: python3 scripts/gen-image-list.py\n\n")
    f.write("export const allImages: string[] = ")
    f.write(json.dumps(files, ensure_ascii=False, indent=2))
    f.write(";\n")

print(len(files), "images listed")
