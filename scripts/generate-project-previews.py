"""Regenerate posters and lightweight previews from data/projects.database.json."""
import json, subprocess
from pathlib import Path
from urllib.parse import unquote
root = Path(__file__).resolve().parents[1]
database = json.loads((root / 'data/projects.database.json').read_text())
for project in database['projects']:
    for video in project.get('videos', []):
        if not video.get('previewSrc', '').startswith('/media/previews/'):
            continue
        source = root / 'public' / unquote(video['src']).lstrip('/')
        poster = root / 'public' / video['poster'].lstrip('/')
        preview = root / 'public' / video['previewSrc'].lstrip('/')
        poster.parent.mkdir(parents=True, exist_ok=True)
        if video['poster'].startswith('/media/previews/') and not poster.exists():
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '1', '-i', str(source), '-frames:v', '1', '-vf', 'scale=1280:1280:force_original_aspect_ratio=decrease', str(poster)], check=True)
        if not preview.exists():
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(source), '-t', '8', '-an', '-vf', 'scale=960:960:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=24', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(preview)], check=True)
        print(project['id'], flush=True)
