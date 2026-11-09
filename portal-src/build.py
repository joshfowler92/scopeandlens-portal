import pathlib
order=['lib.js','lib2.js','news7.js','core.js','demo.js','shell.js','art.js','game.js','amplify.js','guide.js','auth.js','walk.js','home.js','account.js','prospects.js','campaigns.js','compose.js','launch7.js','library.js','dotview.js','signals.js','insights.js','teamc.js','agency.js','touch.js','results.js','data.js','dot.js','pdf.js','pdf2.js','agents.js','outreach.js','publish.js','plan.js','intel.js','find.js','paywall.js','shell11.js','home11.js','launch11.js','coach.js','digest-core.js','base12.js','img12.js','bots12.js','nav12.js','agency12.js','library12.js','who12.js','give12.js','reach12.js','events12.js','launch12.js','pipeline12.js','guides12.js','alerts12.js','plato12.js','onboard12.js','gate12.js','fixes12.js','ux12.js','content12.js','onb123.js','main.js']
js='\n'.join(pathlib.Path(f).read_text() for f in order)
css=pathlib.Path('styles.css').read_text()+'\n'+pathlib.Path('styles12.css').read_text()
fonts=pathlib.Path('fonts.css').read_text()
import base64
fav='data:image/png;base64,'+base64.b64encode(pathlib.Path('fav.png').read_bytes()).decode()
html=f'''<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#2c56ed">
<meta name="robots" content="noindex">
<title>Permissionless Portal · Scope &amp; Lens</title>
<link rel="icon" href="{fav}">
<style id="fontcss">
{fonts}</style>
<style>
{css}
</style>
</head>
<body>
<div id="app"></div>
<div class="scrim" id="scrim" onclick="closeOverlays()"></div>
<div class="modal" id="modal" role="dialog" aria-modal="true"></div>
<aside class="drawer" id="drawer"></aside>
<div class="notif-panel" id="notifPanel"></div>
<div class="cmdk" id="cmdk"><input id="cmdkIn" placeholder="Search accounts and people, or type what you want to do…" oninput="cmdRender(this.value)" autocomplete="off"><div class="cmdk-list" id="cmdkList"></div></div>
<div id="present"></div>
<div id="toasts"></div>
<script>
{js}
</script>
</body>
</html>'''
pathlib.Path('growth-dashboard.html').write_text(html)
pathlib.Path('/tmp/claude-0/-home-claude/d8b0f12d-185b-5b9c-a658-65b96848cb8e/scratchpad/all12.js').write_text(js)
print(len(html)//1024,'KB')
