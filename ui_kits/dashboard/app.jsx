const ST_LABEL={placed:"Placed",confirmed:"Confirmed",packed:"Packed",with_courier:"With courier",delivered:"Delivered",cancelled:"Cancelled",returned:"Returned"};
const ST_KEY={"Placed":"placed","Confirmed":"confirmed","Packed":"packed","With courier":"with_courier","Delivered":"delivered","Cancelled":"cancelled","Returned":"returned"};
const FLOW_KEYS=["confirmed","with_courier","delivered"];
function pad2(n){return (n<10?"0":"")+n;}
function csvCell(v){ v = (v==null)?"":String(v); return /[",\n\r]/.test(v) ? ('"'+v.replace(/"/g,'""')+'"') : v; }
function downloadCSV(filename, headers, rows){
  const lines = [headers.map(csvCell).join(",")].concat(rows.map(r=>r.map(csvCell).join(",")));
  // BOM so Excel opens UTF-8 (Arabic names) correctly.
  const blob = new Blob(["﻿"+lines.join("\r\n")], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 1500);
}
window.downloadCSV = downloadCSV;
function fmtDate(d){try{const x=new Date(d);return pad2(x.getDate())+"/"+pad2(x.getMonth()+1)+"/"+x.getFullYear();}catch(e){return "";}}
function fmtDT(d){try{const x=new Date(d);return fmtDate(d)+" "+pad2(x.getHours())+":"+pad2(x.getMinutes());}catch(e){return "";}}
/* Human-readable email outcome for an order_events.notify_result value. */
function emailStatusOf(nr){
  if(!nr) return {label:"Not sent", color:"var(--ink-2)", bg:"var(--purple-tint)"};
  if(nr==="sent") return {label:"Sent", color:"#4C6531", bg:"#EDF0E7"};
  if(nr==="no_provider") return {label:"No email key", color:"#7A5200", bg:"#FBEFD8"};
  if(nr==="no_email") return {label:"No address", color:"var(--ink-2)", bg:"var(--purple-tint)"};
  if(nr==="needs_verified_domain"||/verify a domain|verified domain/i.test(nr)) return {label:"Verify domain", color:"#7A5200", bg:"#FBEFD8"};
  return {label:"Failed", color:"#8A2B2B", bg:"#F6E5E5"};
}
window.emailStatusOf=emailStatusOf;
// Size and jar count per line, read from the stored "300 ml · 2 jars" label.
function itemFacts(i){ const m=String(i.meta_en||"").match(/(\d+)\s*ml/i), j=String(i.meta_en||"").match(/(\d+)\s*jar/i); return {size:m?+m[1]:null, jars:j?+j[1]:1}; }
// Jars to pack per size across an order's items, e.g. {300:2, 500:1}.
window.jarsBySize=function(items){ const out={}; (items||[]).forEach(i=>{ const k=i.size||"?"; out[k]=(out[k]||0)+(i.jars||1)*(i.q||1); }); return out; };
window.itemsSummary=function(items){ const by=window.jarsBySize(items); return Object.keys(by).sort((a,b)=>a-b).map(k=>(k==="?"?"":k+" ml ")+"× "+by[k]).join(" · "); };
function mapOrder(o){
  const items=(o.order_items||[]).map(i=>({n:i.title_en+(i.meta_en?" — "+i.meta_en:""),q:i.qty,p:i.unit_price,k:i.variant_key,...itemFacts(i)}));
  const events=(o.order_events||[]).slice().sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)).map(e=>(
    {s:ST_LABEL[e.status]||e.status,t:fmtDT(e.created_at),notify:e.notify_result||null,to:e.notified_email||o.email}
  ));
  const emailResult=events.length?events[events.length-1].notify:null;
  return {id:o.order_number,uuid:o.id,customer:o.full_name,phone:o.phone,whatsapp:o.phone2||null,email:o.email,street:o.street,area:o.area,gov:o.governorate,landmark:o.landmark,city:o.governorate,pay:o.payment_method||"cod",paid:!!o.paid_at,
    source:o.source||"website",country:o.country||"EG",delivery:o.delivery_method||null,
    fx:{state:o.flextock_state||null,status:o.flextock_status||null,error:o.flextock_error||null,sentAt:o.flextock_sent_at?fmtDT(o.flextock_sent_at):null,syncedAt:o.flextock_synced_at?fmtDT(o.flextock_synced_at):null,courier:o.courier_name||null,tracking:o.tracking_number||null,trackingUrl:o.tracking_url||null},
    wx:{state:o.weslat_state||null,status:o.weslat_status||null,error:o.weslat_error||null,code:o.weslat_code||null,sentAt:o.weslat_sent_at?fmtDT(o.weslat_sent_at):null,syncedAt:o.weslat_synced_at?fmtDT(o.weslat_synced_at):null,trackingUrl:o.tracking_url||null},currency:o.currency||"EGP",items,shipping:o.shipping||0,discount:o.discount||0,promo:o.promo_code||null,total:o.total,status:ST_LABEL[o.status]||o.status,placed:fmtDate(o.created_at),note:o.admin_note||"",events,emailResult};
}

// Countries the shop sells in. Read from public.markets; these defaults are used
// until that table exists, so the dashboard keeps working on the old database.
const DEFAULT_MARKETS=[{code:"EG",name_en:"Egypt",currency:"EGP"},{code:"SA",name_en:"Saudi Arabia",currency:"SAR"},{code:"SD",name_en:"Sudan",currency:"SDG"}];
const DASH_MKT_KEY="strands-dash-market";
window.marketFlag=(c)=>((window.MARKET_INFO||{})[c]||{}).flag||"";
// A delivery choice's name from its key ("redbox" -> "Nearest RedBox locker"), read from the loaded countries.
window.DASH_MARKETS=DEFAULT_MARKETS;
window.deliveryName=(country,key)=>{ const m=(window.DASH_MARKETS||[]).find(x=>x.code===country); const o=m&&(m.delivery_options||[]).find(x=>x.key===key); return o?o.name_en:String(key||""); };
// "1,200 EGP · 300 SAR" — totals kept apart per currency, never added together.
window.sumByCurrency=function(list,fn){ const by={}; (list||[]).forEach(o=>{ by[o.currency||"EGP"]=(by[o.currency||"EGP"]||0)+fn(o); }); const ks=Object.keys(by); return ks.length?ks.map(c=>window.fmtMoney(by[c],c)).join(" · "):window.fmtMoney(0,"EGP"); };
function CountryBar({markets,value,onChange,orders}){
  const open=(c)=>orders.filter(o=>(c==="ALL"||o.country===c)&&!["Delivered","Cancelled","Returned"].includes(o.status)).length;
  const pill=(on)=>({font:"inherit",fontFamily:"var(--font-sans)",fontSize:"var(--text-small)",padding:"8px 14px",borderRadius:"var(--radius-pill)",cursor:"pointer",border:"1.5px solid "+(on?"var(--purple)":"var(--rule)"),background:on?"var(--purple)":"var(--white)",color:on?"var(--white)":"var(--ink)",display:"inline-flex",alignItems:"center",gap:8});
  const badge=(n,on)=>n?<span style={{fontSize:11,minWidth:20,padding:"1px 7px",borderRadius:"var(--radius-pill)",background:on?"rgba(255,255,255,.22)":"var(--purple-tint)",color:on?"var(--white)":"var(--purple)"}}>{n}</span>:null;
  return <div role="tablist" aria-label="Country" style={{display:"flex",gap:"var(--space-2)",flexWrap:"wrap",marginBottom:"var(--space-5)"}}>
    {markets.map(m=>{ const on=value===m.code; return <button key={m.code} type="button" role="tab" aria-selected={on} onClick={()=>onChange(m.code)} style={pill(on)}><span>{window.marketFlag(m.code)}</span>{m.name_en}{badge(open(m.code),on)}</button>; })}
    <button type="button" role="tab" aria-selected={value==="ALL"} onClick={()=>onChange("ALL")} style={pill(value==="ALL")}>All countries{badge(open("ALL"),value==="ALL")}</button>
  </div>;
}

function Splash({msg}){return <div style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"var(--cream)",color:"var(--ink-2)",fontFamily:"var(--font-sans)"}}>{msg}</div>;}
function NotAdmin({email,onSignOut}){
  return <div style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"var(--cream)",padding:24}}>
    <div style={{maxWidth:420,textAlign:"center",display:"grid",gap:12}}>
      <h1 style={{fontSize:26}}>This isn’t an owner account.</h1>
      <p style={{color:"var(--ink-2)"}}>{email} is signed in, but it isn’t on the admin list, so the dashboard is hidden.</p>
      <div style={{display:"flex",gap:12,justifyContent:"center"}}>
        <a href="../account/index.html" style={{color:"var(--green)"}}>Go to your account</a>
        <button type="button" onClick={onSignOut} style={{font:"inherit",fontFamily:"var(--font-sans)",background:"none",border:"none",color:"var(--ink-2)",cursor:"pointer"}}>Sign out</button>
      </div>
    </div>
  </div>;
}

function App(){
  const [ready,setReady]=React.useState(false);
  const [session,setSession]=React.useState(null);
  const [admin,setAdmin]=React.useState(null);
  const [page,setPage]=React.useState("Overview");
  const [orders,setOrders]=React.useState([]);
  const [openId,setOpenId]=React.useState(null);
  const [markets,setMarkets]=React.useState(DEFAULT_MARKETS);
  const [mkt,setMkt]=React.useState(()=>{ try{ return localStorage.getItem(DASH_MKT_KEY)||"EG"; }catch(e){ return "EG"; } });
  React.useEffect(()=>{ try{ localStorage.setItem(DASH_MKT_KEY,mkt); }catch(e){} },[mkt]);
  // Flextock (warehouse + delivery). Its function answers {ok:false,error} on failure.
  const [fxCfg,setFxCfg]=React.useState(null);
  const loadFx=()=>window.sb.from("settings").select("value").eq("key","flextock").maybeSingle().then(({data})=>{ setFxCfg((data&&data.value)||null); },()=>{});
  window.flextockCall=async(action,extra)=>{ try{ const {data,error}=await window.sb.functions.invoke("flextock",{body:{action,...(extra||{})}}); if(error){ let msg=error.message; try{ const b=await error.context.json(); msg=b.error||msg; }catch(e){} return {ok:false,error:msg}; } return data||{ok:false,error:"no reply"}; }catch(e){ return {ok:false,error:String(e&&e.message||e)}; } };
  // Weslat (delivery, Sudan). Same reply shape as Flextock's function.
  const [wxCfg,setWxCfg]=React.useState(null);
  const loadWx=()=>window.sb.from("settings").select("value").eq("key","weslat").maybeSingle().then(({data})=>{ setWxCfg((data&&data.value)||null); },()=>{});
  window.weslatCall=async(action,extra)=>{ try{ const {data,error}=await window.sb.functions.invoke("weslat",{body:{action,...(extra||{})}}); if(error){ let msg=error.message; try{ const b=await error.context.json(); msg=b.error||msg; }catch(e){} return {ok:false,error:msg}; } return data||{ok:false,error:"no reply"}; }catch(e){ return {ok:false,error:String(e&&e.message||e)}; } };
  const loadMarkets=()=>window.sb.from("markets").select("*").order("sort").then(({data,error})=>{ if(!error&&data&&data.length){ setMarkets(data); window.DASH_MARKETS=data; } },()=>{});

  React.useEffect(()=>{
    if(!window.SB_READY){ setReady(true); return; }
    window.sb.auth.getSession().then(({data})=>{ setSession(data.session||null); setReady(true); });
    const {data:sub}=window.sb.auth.onAuthStateChange((_e,s)=>setSession(s||null));
    return ()=>{ sub&&sub.subscription&&sub.subscription.unsubscribe(); };
  },[]);

  React.useEffect(()=>{
    if(!session){ setAdmin(null); setOrders([]); return; }
    (async()=>{
      const r=await window.sb.rpc("is_admin");
      const ok=!r.error && r.data===true;
      setAdmin(ok);
      if(ok){ loadOrders(); loadMarkets(); loadFx(); loadWx(); }
    })();
  },[session]);

  // One sign-in for everyone: the dashboard has no login of its own. A visit
  // without a session goes to the shared account sign-in; a signed-in non-owner
  // is sent to their account (the owner reaches here via the Dashboard button).
  React.useEffect(()=>{ if(ready && window.SB_READY && !session){ window.location.replace("../account/index.html"); } },[ready,session]);
  React.useEffect(()=>{ if(admin===false){ window.location.replace("../account/index.html"); } },[admin]);

  const ORDER_COLS="*, order_items(*), order_events(*)";
  // Every order, read in pages: the API returns at most 1,000 rows per request.
  async function loadOrders(){
    const byId=new Map();
    for(let from=0;;from+=1000){
      const {data,error}=await window.sb.from("orders").select(ORDER_COLS).order("created_at",{ascending:false}).range(from,from+999);
      if(error||!data) return;
      data.forEach(o=>byId.set(o.id,o));
      if(data.length<1000) break;
    }
    setOrders([...byId.values()].map(mapOrder));
  }
  // After changing one order, re-read only that order instead of all of them.
  async function reloadOrder(uuid){
    const {data,error}=await window.sb.from("orders").select(ORDER_COLS).eq("id",uuid).maybeSingle();
    if(!error && data) setOrders(list=>list.map(o=>o.uuid===uuid?mapOrder(data):o));
  }
  const order=orders.find(o=>o.uuid===openId);
  async function setStatus(o,key){
    await window.sb.from("orders").update({status:key}).eq("id",o.uuid);
    await window.sb.from("order_events").insert({order_id:o.uuid,status:key,note_en:ST_LABEL[key]});
    try{ await window.sb.functions.invoke("notify-order",{body:{order_id:o.uuid,status:key}}); }catch(e){ console.warn("email notify failed",e); }
    await reloadOrder(o.uuid);
  }
  async function advance(){ if(!order) return; const idx=FLOW_KEYS.indexOf(ST_KEY[order.status]); await setStatus(order,FLOW_KEYS[Math.min(FLOW_KEYS.length-1,idx+1)]); }
  async function cancel(){ if(order) await setStatus(order,"cancelled"); }
  // Jump forward to any status in one click. Only the chosen status is recorded and
  // emailed — steps skipped over do NOT send an email to the customer.
  async function jumpTo(o,targetKey){
    if(!o) return;
    const startIdx=FLOW_KEYS.indexOf(ST_KEY[o.status]);
    const endIdx=FLOW_KEYS.indexOf(targetKey);
    if(endIdx<0 || endIdx<=startIdx) return;   // forward-only
    await setStatus(o,targetKey);              // one event + one email, for the target status only
  }
  async function saveNote(text){ if(order){ await window.sb.from("orders").update({admin_note:text}).eq("id",order.uuid); await reloadOrder(order.uuid); } }
  async function setPaid(o,val){ if(!o) return; await window.sb.from("orders").update({paid_at: val ? new Date().toISOString() : null}).eq("id",o.uuid);
    // A paid InstaPay order is now ready for Flextock (it waits until paid).
    if(val && fxCfg && fxCfg.enabled && o.fx.state==="waiting_payment") await window.flextockCall("send",{order_id:o.uuid});
    // A paid Sudan order goes to Weslat (Sudan orders are paid first, on WhatsApp).
    if(val && wxCfg && wxCfg.enabled && o.country==="SD" && (!o.wx.state||o.wx.state==="waiting_payment")) await window.weslatCall("send",{order_id:o.uuid});
    await reloadOrder(o.uuid); }
  async function weslat(o,action){ const r=await window.weslatCall(action,{order_id:o.uuid,manual:true}); await reloadOrder(o.uuid); return r; }
  async function flextock(o,action){ const r=await window.flextockCall(action,{order_id:o.uuid,manual:true}); await reloadOrder(o.uuid); return r; }
  // Bulk-apply a status to selected orders: process one at a time (throttled) so we
  // stay under the email provider's rate limit, emailing the customer for each.
  // Forward-only for flow statuses; cancel applies unless already delivered/cancelled.
  async function bulkSetStatus(list,targetKey){
    let done=0, emailFailed=0, skipped=0;
    const targetIdx=FLOW_KEYS.indexOf(targetKey);
    for(const o of list){
      const curKey=ST_KEY[o.status], curIdx=FLOW_KEYS.indexOf(curKey);
      if(targetKey==="cancelled"){
        if(curKey==="cancelled"||curKey==="delivered"){ skipped++; continue; }
      } else if(targetIdx<0 || targetIdx<=curIdx){ skipped++; continue; }  // not a forward move
      const up=await window.sb.from("orders").update({status:targetKey}).eq("id",o.uuid);
      if(up.error){ skipped++; continue; }
      await window.sb.from("order_events").insert({order_id:o.uuid,status:targetKey,note_en:ST_LABEL[targetKey]});
      done++;
      try{ const {error}=await window.sb.functions.invoke("notify-order",{body:{order_id:o.uuid,status:targetKey}}); if(error) emailFailed++; }
      catch(e){ emailFailed++; console.warn("email notify failed",e); }
      await new Promise(r=>setTimeout(r,350));  // throttle: keep well under Resend's rate limit
    }
    await loadOrders();
    return {done, emailFailed, skipped, targetKey};
  }

  if(!ready) return <Splash msg="Loading…"/>;
  if(!window.SB_READY) return <Splash msg="Could not reach the database. Check your connection and refresh."/>;
  if(!session) return <Splash msg="Taking you to sign in…"/>;
  if(admin===null) return <Splash msg="Checking your access…"/>;
  if(admin===false) return <Splash msg="Taking you to your account…"/>;

  const go=(p)=>{setOpenId(null);setPage(p);};
  // The country tabs filter Overview and Orders (and so the CSV export).
  const shown=mkt==="ALL"?orders:orders.filter(o=>o.country===mkt);
  const mktObj=markets.find(m=>m.code===mkt)||null;
  const bar=<CountryBar markets={markets} value={mkt} onChange={(c)=>{setMkt(c);setOpenId(null);}} orders={orders}/>;
  let body;
  if(openId&&order) body=<window.DashOrderDetail order={order} onBack={()=>setOpenId(null)} onAdvance={advance} onJump={(label)=>jumpTo(order, ST_KEY[label])} onCancel={cancel} onReturned={()=>setStatus(order,"returned")} onSaveNote={saveNote} onSetPaid={(val)=>setPaid(order,val)} fxCfg={fxCfg} onFlextock={(a)=>flextock(order,a)} wxCfg={wxCfg} onWeslat={(a)=>weslat(order,a)}/>;
  else if(page==="Overview") body=<>{bar}<window.DashOverview orders={shown} market={mktObj} onOpen={o=>{setPage("Orders");setOpenId(o.uuid);}}/></>;
  else if(page==="Orders") body=<>{bar}<window.DashOrders orders={shown} market={mktObj} markets={markets} fxCfg={fxCfg} wxCfg={wxCfg} onOpen={o=>setOpenId(o.uuid)} onReload={loadOrders} onBulkAction={bulkSetStatus}/></>;
  else if(page==="Flextock") body=<window.DashFlextock onSaved={loadFx}/>;
  else if(page==="Weslat") body=<window.DashWeslat onSaved={loadWx}/>;
  else if(page==="Countries") body=<window.DashCountries onSaved={loadMarkets}/>;
  else if(page==="Product & bundles") body=<window.DashProduct/>;
  else if(page==="Site text") body=<window.DashSiteText/>;
  else if(page==="Promo codes") body=<window.DashPromos/>;
  else if(page==="Delivery") body=<window.DashDelivery/>;
  else if(page==="Reviews") body=<window.DashReviews/>;
  else if(page==="Gulf waitlist") body=<window.DashWaitlist/>;
  else body=<window.DashEmails/>;
  return <window.DashShell page={page} setPage={go} onSignOut={()=>{window.sb.auth.signOut();setPage("Overview");setOpenId(null);}}>{body}</window.DashShell>;
}
const mount=()=>{ if(!window.DashEmails||!window.DASH||!window.DashProduct||!window.DashSiteText||!window.DashCountries||!window.DashFlextock||!window.DashWeslat){return setTimeout(mount,60);} ReactDOM.createRoot(document.getElementById('root')).render(<App/>); };
mount();
