"""Read-only / non-delivering smoke checks; require an unconfigured local mail endpoint."""
import urllib.request,urllib.error,json
base='http://localhost:3107'
def request(path,method='GET',data=None,origin=base,content='application/json'):
 body=None if data is None else (data if isinstance(data,bytes) else json.dumps(data).encode())
 r=urllib.request.Request(base+path,data=body,method=method,headers={'Origin':origin,'Content-Type':content})
 try:
  with urllib.request.urlopen(r,timeout=30) as resp:return resp.status,resp.read(300).decode(errors='replace')
 except urllib.error.HTTPError as e:return e.code,e.read(300).decode(errors='replace')
assert json.loads(request('/api/contact')[1])['available'] is False,'Do not run this smoke test against a configured email endpoint.'
valid={'name':'Local QA','email':'qa@example.com','services':['Website Design'],'message':'Local validation test. No message should be transmitted.','privacy':True}
cases=[('availability','/api/contact','GET',None,base,'application/json',200),('validation','/api/contact','POST',{},base,'application/json',422),('origin','/api/contact','POST',valid,'https://invalid.example','application/json',403),('media-type','/api/contact','POST',b'x',base,'text/plain',415),('unconfigured','/api/contact','POST',valid,base,'application/json',503),('oversize','/api/contact','POST',b'x'*21000,base,'application/json',413),('bad-json','/api/contact','POST',b'{',base,'application/json',400),('case-study','/work/aura','GET',None,base,'application/json',200),('unknown-project','/work/does-not-exist','GET',None,base,'application/json',404),('privacy','/privacy','GET',None,base,'application/json',200)]
for name,path,method,data,origin,content,expected in cases:
 status,body=request(path,method,data,origin,content)
 print(name,status,'PASS' if status==expected else 'FAIL')
 assert status==expected,(name,body)
