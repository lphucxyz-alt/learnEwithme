import argparse
import io
import json
from pathlib import Path
import subprocess

import onnxruntime
import soundfile
from kokoro_onnx import Kokoro

parser = argparse.ArgumentParser()
parser.add_argument("model")
parser.add_argument("voices")
parser.add_argument("--force", action="store_true")
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
data = subprocess.check_output(["node", "--input-type=module", "-e", """
import { ipaExamples } from './src/data/ipa-words.ts';
import { shadowLessons } from './src/data/shadowing.ts';
import { pairs } from './src/data/ipa.ts';
console.log(JSON.stringify({
  words: [...new Set([...Object.values(ipaExamples).flat().map(([word]) => word), ...pairs.flatMap(item => item.words)])].sort(),
  shadow: shadowLessons.flatMap(lesson => lesson.lines.map((line, index) => [lesson.id + '-' + (index + 1), line.en]))
}));"""], cwd=root, text=True)
entries = json.loads(data)

options = onnxruntime.SessionOptions()
options.intra_op_num_threads = 2
options.inter_op_num_threads = 1
session = onnxruntime.InferenceSession(args.model, sess_options=options, providers=["CPUExecutionProvider"])
engine = Kokoro.from_session(session, args.voices)

for accent, voice in [("en-GB", "bf_emma"), ("en-US", "af_heart")]:
    jobs = [("ipa-voice", f"word-{word}", word) for word in entries["words"]]
    jobs += [("shadow-voice", name, text) for name, text in entries["shadow"]]
    for category, name, text in jobs:
        path = root / "public" / category / accent / f"{name}.mp3"
        path.parent.mkdir(parents=True, exist_ok=True)
        if not args.force and path.exists() and path.stat().st_size > 500:
            continue
        samples, rate = engine.create(text, voice, speed=1.0, lang=accent.lower())
        data = io.BytesIO()
        if len(samples) / rate < .15:
            raise ValueError(f"Missing or too short: {accent} {name}")
        soundfile.write(data, samples, rate, format="WAV", subtype="PCM_16")
        subprocess.run(["ffmpeg", "-hide_banner", "-v", "error", "-y", "-i", "pipe:0", "-ac",
                        "1", "-codec:a", "libmp3lame", "-b:a", "40k", str(path)],
                       input=data.getvalue(), check=True)
    print(f"{accent}: {len(jobs)} clips", flush=True)

manifest = {"words": entries["words"]}
(root / "src" / "data" / "ipa-audio.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
