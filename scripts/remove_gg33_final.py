#!/usr/bin/env python3
"""Remove all GG33/gg33 references from the codebase.
- User-facing text: replace with 'Silent Oracle' or neutral phrasing
- Internal field names (gg33Chart → numerologyChart, gg33Classification → numerologyClassification)
- Comments: remove gg33.com references
- File names: gg33.ts → numerology-engine.ts (rename + update imports)
"""
import re
from pathlib import Path

ROOT = Path("/home/z/my-project/src")

# Files to process
files = list(ROOT.rglob("*.ts")) + list(ROOT.rglob("*.tsx"))

# Replacement rules (case-sensitive, applied in order)
RULES = [
    # Comments / source attributions
    (r"Sourced from the public Silent Oracle numerology corpus \(gg33\.com, the Silent Oracle",
     "Sourced from the public numerology corpus (the Silent Oracle"),
    (r"Numerology App content, and the Silent Oracle Telegram/X public posts\) plus",
     "Numerology App content, and public Telegram/X posts) plus"),

    # User-facing text in synthesis.ts
    (r"Per Silent Oracle:", "Per the methodology:"),
    (r"Silent Oracle numerology analysis", "Numerology analysis"),
    (r"Your Silent Oracle Personal Year", "Your Personal Year"),
    (r"Silent Oracle Synthesis Engine", "Numerology Synthesis Engine"),
    (r"Silent Oracle Compound Classifications", "Compound Classifications"),
    (r"Compatibility table from the Silent Oracle spec", "Compatibility table from the numerology spec"),
    (r"Silent Oracle spec:", "The spec:"),
    (r"in the Silent Oracle system", "in this numerology system"),

    # Internal field names (gg33Chart → numerologyChart, etc.)
    (r"gg33Chart", "numerologyChart"),
    (r"gg33Classification", "numerologyClassification"),
    (r"Gg33Chart", "NumerologyChart"),
    (r"Gg33Number", "NumerologyNumber"),
    (r"buildGg33Chart", "buildNumerologyChart"),
    (r"makeGg33Number", "makeNumerologyNumber"),
    (r"buildGg33Result", "buildNumerologyResult"),
    (r"gg33Result", "numerologyResult"),

    # Import paths (./gg33 → ./numerology-engine)
    (r'from "\./gg33"', 'from "./numerology-engine"'),
    (r'from "\.\./numerology/gg33"', 'from "../numerology/numerology-engine"'),
    (r'from "@/lib/numerology/gg33"', 'from "@/lib/numerology/numerology-engine"'),

    # Any remaining standalone gg33/GG33 in comments
    (r"\bgg33\b", "the methodology"),
    (r"\bGG33\b", "the methodology"),
]

total = 0
for f in files:
    text = f.read_text()
    original = text
    for pat, repl in RULES:
        text = re.sub(pat, repl, text)
    if text != original:
        n = original.lower().count("gg33")
        total += n
        f.write_text(text)
        print(f"  updated {f.relative_to(ROOT)}: -{n} gg33 refs")

print(f"\nTotal GG33 references removed: {total}")

# Rename the file
old_file = ROOT / "lib" / "numerology" / "gg33.ts"
new_file = ROOT / "lib" / "numerology" / "numerology-engine.ts"
if old_file.exists():
    old_file.rename(new_file)
    print(f"\nRenamed: {old_file.name} → {new_file.name}")

# Verify
import subprocess
result = subprocess.run(["grep", "-rni", "gg33", str(ROOT)], capture_output=True, text=True)
print("\nRemaining GG33 references:")
print(result.stdout if result.stdout else "(none)")
