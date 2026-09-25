"""Dars audiolarini siqib (mono 40 kbps — nutq uchun yetarli) Supabase Storage'ga yuklaydi.

Ishga tushirish (generate-lesson-audio.mjs dan keyin):
    pip install imageio-ffmpeg
    python scripts/publish_lesson_audio.py [lessonId ...]

Kalitlar .env.local dan: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
Bucket `lesson-audio` (public) kerak bo'lsa yaratiladi. Yuklangan fayl .audio-cache/<id>/.published ro'yxatida belgilanadi.
Manifest (src/content/cp3p/audio.json) faqat hamma fayli yuklangan darslar uchun "published": true oladi.
"""
import json, os, subprocess, sys, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

import imageio_ffmpeg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, ".audio-cache")
MANIFEST = os.path.join(ROOT, "src", "content", "cp3p", "audio.json")
BUCKET = "lesson-audio"
FF = imageio_ffmpeg.get_ffmpeg_exe()

env = {}
for line in open(os.path.join(ROOT, ".env.local"), encoding="utf-8"):
    if "=" in line and not line.startswith("#"):
        k, v = line.strip().split("=", 1)
        env[k] = v.strip('"')
URL = env["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/")
KEY = env["SUPABASE_SERVICE_ROLE_KEY"]


def req(method, path, data=None, ctype="application/json", extra=None):
    headers = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": ctype}
    headers.update(extra or {})
    r = urllib.request.Request(URL + path, method=method, data=data, headers=headers)
    try:
        with urllib.request.urlopen(r, timeout=120) as res:
            return res.status, res.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def ensure_bucket():
    status, body = req("GET", f"/storage/v1/bucket/{BUCKET}")
    if status == 200:
        return
    status, body = req("POST", "/storage/v1/bucket", json.dumps({"id": BUCKET, "name": BUCKET, "public": True, "allowed_mime_types": ["audio/mpeg"], "file_size_limit": 20_000_000}).encode())
    if status not in (200, 201):
        sys.exit(f"bucket create failed: {status} {body[:300]}")
    print("bucket created")


def compress(src):
    out = subprocess.run([FF, "-v", "error", "-i", src, "-ac", "1", "-ar", "24000", "-b:a", "40k", "-f", "mp3", "pipe:1"], capture_output=True, check=True)
    return out.stdout


def upload(lesson_id, name):
    data = compress(os.path.join(CACHE, lesson_id, name))
    status, body = req("POST", f"/storage/v1/object/{BUCKET}/{lesson_id}/{name}", data, "audio/mpeg", {"x-upsert": "true", "Cache-Control": "max-age=31536000"})
    if status not in (200, 201):
        raise RuntimeError(f"{lesson_id}/{name}: {status} {body[:200]}")
    return len(data)


def main():
    ensure_bucket()
    manifest = json.load(open(MANIFEST, encoding="utf-8")) if os.path.exists(MANIFEST) else {}
    only = set(sys.argv[1:])
    total = 0
    for lesson_id, info in sorted(manifest.items()):
        if only and lesson_id not in only:
            continue
        if not isinstance(info, dict) or not info.get("slides") or not info.get("parts"):
            continue
        names = [f"{i}.mp3" for i in range(1, info["slides"] + 1)] + [f"p{i}.mp3" for i in range(1, info["parts"] + 1)]
        done_file = os.path.join(CACHE, lesson_id, ".published")
        done = set(open(done_file).read().split()) if os.path.exists(done_file) else set()
        todo = [n for n in names if n not in done]
        with ThreadPoolExecutor(6) as ex:
            for n, size in zip(todo, ex.map(lambda n: upload(lesson_id, n), todo)):
                total += size
                done.add(n)
                open(done_file, "w").write("\n".join(sorted(done)))
        info["published"] = all(n in done for n in names)
        print(f"{lesson_id}: {len(todo)} uploaded, published={info['published']}")
    json.dump(manifest, open(MANIFEST, "w", encoding="utf-8"), indent=2)
    open(MANIFEST, "a", encoding="utf-8").write("\n")
    print(f"uploaded {total / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
