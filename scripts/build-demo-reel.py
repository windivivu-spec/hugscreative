"""Render a silent, clearly labeled concept reel from the existing demo stills."""
from pathlib import Path
import subprocess, tempfile
root=Path(__file__).resolve().parent.parent
scenes=[('dunes','VIDEO & MOTION'),('fashion','GRAPHIC DESIGN'),('architecture','WEB EXPERIENCES'),('coffee','SOCIAL & DIGITAL'),('ocean','HUGs Creative')]
with tempfile.TemporaryDirectory(prefix='hugs-reel-') as temp:
 paths=[]
 for i,(name,label) in enumerate(scenes):
  dest=Path(temp)/f'{i}.mp4';paths.append(dest)
  font=str(root/'font/OVSoge-Medium.otf')
  filters=f"scale=1400:900:force_original_aspect_ratio=increase,crop=1400:900,zoompan=z='min(zoom+0.0006,1.08)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=75:s=1280x720:fps=25,fade=t=in:st=0:d=0.25,fade=t=out:st=2.75:d=0.25"
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(root/'public/media'/f'{name}.jpg'),'-vf',filters,'-t','3','-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p',str(dest)],check=True)
 listing=Path(temp)/'clips.txt';listing.write_text(''.join(f"file '{p}'\n" for p in paths))
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-c','copy','-movflags','+faststart',str(root/'public/media/hugs-direction-reel.mp4')],check=True)
print('Created 15-second silent concept reel.')
