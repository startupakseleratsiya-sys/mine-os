"""
Dars yozuvlarining davomiyligini audio.json ga yozadi (pleyer vaqt chizig'i sahifa ochilishi bilan aniq bo'lsin).
TTS chaqirilmaydi — faqat mavjud .audio-cache/<id>/*.mp3 fayllari o'lchanadi (imageio-ffmpeg).
Ishga tushirish:  python scripts/lesson_audio_durations.py
"""
import json, os, re, subprocess
import imageio_ffmpeg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, ".audio-cache")
MANIFEST = os.path.join(ROOT, "src", "content", "cp3p", "audio.json")
FF = imageio_ffmpeg.get_ffmpeg_exe()


def duration(path):
    err = subprocess.run([FF, "-hide_banner", "-i", path], capture_output=True, text=True).stderr
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    if not m:
        raise RuntimeError(f"davomiylik topilmadi: {path}")
    h, mi, s = m.groups()
    return round(int(h) * 3600 + int(mi) * 60 + float(s), 2)


manifest = json.load(open(MANIFEST, encoding="utf-8"))
done = 0
for lesson_id, m in manifest.items():
    folder = os.path.join(CACHE, lesson_id)
    try:
        slides = [duration(os.path.join(folder, f"{i}.mp3")) for i in range(1, m["slides"] + 1)]
        parts = [duration(os.path.join(folder, f"p{i}.mp3")) for i in range(1, m["parts"] + 1)]
    except (RuntimeError, FileNotFoundError) as e:
        print("o'tkazib yuborildi:", lesson_id, e)
        continue
    m["slideDurations"] = slides
    m["partDurations"] = parts
    done += 1

json.dump(manifest, open(MANIFEST, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
open(MANIFEST, "a", encoding="utf-8").write("\n")
print(f"{done}/{len(manifest)} dars yangilandi")
