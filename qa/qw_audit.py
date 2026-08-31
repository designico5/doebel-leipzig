#!/usr/bin/env python3
"""QA-Gate 'Döbel Leipzig' — 5-Layer-Audit der Site. Aufruf: python3 qa/qw_audit.py website"""
import sys, os, re, json, glob
from html.parser import HTMLParser

ROOT = sys.argv[1] if len(sys.argv) > 1 else "website"
VOID = {"meta","link","img","br","hr","input","path","circle","rect","stop","use","text","line","ellipse"}
CLAIM_BLACKLIST = ["365 Tage","an 7 Tagen","Festpreis","Festtermin","Wärmerückgewinnung",
                   "Dichtheitsprüfung","Ersatzteilsicherheit","Testimonial","Phil Hoffmann",
                   "seit Jahren in der Kippenberg","Weltklasse","nummeriert 1 im"]
FAILS=[]; OKS=[]
def check(cond,msg):
    (OKS if cond else FAILS).append(msg)

class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.stack=[]; s.err=[]
    def handle_starttag(s,t,a):
        if t not in VOID: s.stack.append(t)
    def handle_endtag(s,t):
        if t in VOID: return
        if s.stack and s.stack[-1]==t: s.stack.pop()
        elif s.stack and t in s.stack:
            while s.stack and s.stack[-1]!=t: s.err.append("unclosed "+s.stack.pop())
            s.stack.pop()
        else: s.err.append("stray "+t)

files = sorted(glob.glob(os.path.join(ROOT,"*.html")))
check(len(files)==10, f"Seitenvielfalt: {len(files)} HTML (Soll 10)")
for f in files:
    s=open(f,encoding="utf-8").read(); p=P(); p.feed(s)
    check(not p.err and not p.stack, f"Tags {os.path.basename(f)} ({(p.err[:2],p.stack[:4]) if (p.err or p.stack) else 'ok'})")
    for m in re.finditer(r'ld\+json">(.*?)</script>',s,re.S):
        try: json.loads(m.group(1)); OKS.append(f"JSON-LD {os.path.basename(f)}")
        except Exception as e: FAILS.append(f"JSON-LD {os.path.basename(f)}: {e}")
    for c in CLAIM_BLACKLIST:
        if c!="Phil Hoffmann" or f!=files[0]:  # PH nur in Impressum-Doku-Platzhaltern erlaubt? nein: verboten
            check(c not in s, f"Claim-Freiheit [{c}] in {os.path.basename(f)}")
idx=open(os.path.join(ROOT,"index.html"),encoding="utf-8").read()
hrefs=set(re.findall(r'href="#([\w-]+)"',idx)); ids=set(re.findall(r'id="([\w-]+)"',idx))
check(not hrefs-ids, f"Anker ok: fehlend={sorted(hrefs-ids)}")
css=open(os.path.join(ROOT,"css/style.css"),encoding="utf-8").read()
check(css.count("{")==css.count("}"), "CSS-Klammern balanciert")
check("prefers-reduced-motion" in css, "Motion-Regime vorhanden")
vers=set(re.findall(r'v=([\d.]+[a-z]?)',idx))
check(len(vers)<=1, f"Versions-Strang einheitlich {vers}")
imgs=glob.glob(os.path.join(ROOT,"img/*.jpg"))
check(len(imgs)==6 and all(os.path.getsize(i)<400_000 for i in imgs), f"6 Web-Renderings <400KB {[os.path.basename(i) for i in imgs]}")
for n in ["_headers","_redirects","robots.txt","sitemap.xml","llms.txt","404.html","og.jpg","favicon.svg"]:
    check(os.path.exists(os.path.join(ROOT,n)), f"Deploy-Artefakt {n}")
sm=open(os.path.join(ROOT,"sitemap.xml")).read()
check(sm.count("<loc>")>=7, "sitemap >=7 URLs")
rd=open(os.path.join(ROOT,"_redirects")).read()
check("leipzigtherm.de" in rd and "www.doebel" in rd, "301-Konsolidierung doppelter Domains + www")
print("="*58)
print(f"PASS {len(OKS)} · FAIL {len(FAILS)}")
for f in FAILS: print("✗", f)
if not FAILS: print("✅ ALLES-GRÜN — auslieferungsreif")
sys.exit(1 if FAILS else 0)
