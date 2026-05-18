#!/usr/bin/env python3
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE = os.path.join(ROOT, "voice")
SCENES_PATH = os.path.join(ROOT, "scenes.json")
PAD = 0.6
VOICE_NAME = "en-US-AndrewMultilingualNeural"
RATE = "-3%"

os.makedirs(VOICE, exist_ok=True)
scenes = json.load(open(SCENES_PATH))

durations = []
cumulative = []
t = 0.0

for s in scenes:
    out = os.path.join(VOICE, f"{s['id']}.mp3")
    print(f"[gen] {s['id']:>14} ...", end=" ", flush=True)
    subprocess.run(
        ["edge-tts", "--voice", VOICE_NAME, f"--rate={RATE}",
         "--text", s["text"], "--write-media", out],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    p = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", out],
        capture_output=True, text=True, check=True,
    )
    dur = float(p.stdout.strip())
    durations.append({"id": s["id"], "path": out, "dur": dur})
    cumulative.append({
        "id": s["id"],
        "start": round(t, 3),
        "end": round(t + dur, 3),
        "dur": round(dur, 3),
    })
    print(f"{dur:6.2f}s")
    t += dur + PAD

# Silence pad clip
silence = os.path.join(VOICE, "silence.mp3")
subprocess.run(
    ["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
     "-t", str(PAD), "-q:a", "9", "-acodec", "libmp3lame", silence],
    check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)

# Concat list
list_path = os.path.join(VOICE, "concat_list.txt")
with open(list_path, "w") as f:
    for d in durations:
        f.write(f"file '{d['path']}'\n")
        f.write(f"file '{silence}'\n")

concat_out = os.path.join(VOICE, "concat.mp3")
subprocess.run(
    ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", list_path,
     "-c:a", "libmp3lame", "-q:a", "2", concat_out],
    check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)

json.dump(durations, open(os.path.join(VOICE, "durations.json"), "w"), indent=2)
json.dump(cumulative, open(os.path.join(VOICE, "cumulative.json"), "w"), indent=2)

# Probe master concat
p = subprocess.run(
    ["ffprobe", "-v", "error", "-show_entries", "format=duration",
     "-of", "default=nw=1:nk=1", concat_out],
    capture_output=True, text=True, check=True,
)
total = float(p.stdout.strip())
print()
print(f"[gen] {len(scenes)} scenes, master concat = {total:6.2f}s")
print(f"[gen] voice/concat.mp3 + voice/durations.json + voice/cumulative.json written")
