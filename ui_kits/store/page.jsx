window.DSButton = window.StrandsDesignSystem_6d0a65.Button;
const CART_KEY="strands-cart", MARKET_KEY="strands-market";
const EG_MARKET={code:"EG",name_en:"Egypt",name_ar:"مصر",currency:"EGP",pay_cod:true};
function loadMarket(){ try{ return localStorage.getItem(MARKET_KEY)||"EG"; }catch(e){ return "EG"; } }
/* "Ship to" picker — only rendered when more than one country is open. */
function MarketSelect({ markets, value, onChange, compact }){
  const ar=window.useLang()==="AR";
  if(!markets||markets.length<2) return null;
  const info=(c)=>(window.MARKET_INFO&&window.MARKET_INFO[c])||{};
  return <label style={{display:"inline-flex",alignItems:"center",gap:8,fontFamily:"var(--font-sans)",fontSize:"var(--text-small)",color:"var(--ink-2)"}}>
    <span>{window.copy("market.shipTo","Ship to","التوصيل إلى")}</span>
    <select value={value} onChange={(e)=>onChange(e.target.value)} aria-label={ar?"الدولة":"Country"}
      style={{font:"inherit",fontFamily:"var(--font-sans)",fontSize:compact?14:15,height:compact?36:40,padding:"0 10px",border:"1px solid var(--rule)",borderRadius:"var(--radius-control)",background:"var(--white)",color:"var(--ink)",cursor:"pointer"}}>
      {markets.map((m)=><option key={m.code} value={m.code}>{(info(m.code).flag||"")+" "+(ar?m.name_ar:m.name_en)}</option>)}
    </select>
  </label>;
}
window.StrandsMarketSelect=MarketSelect;
/* First visit: the shopper must pick their country before shopping, so nobody in
   Sudan or Saudi Arabia orders from the Egypt shop (and its EGP prices) by accident.
   Countries that aren't open yet show "Coming soon" and can't be picked. */
// Not live yet: the picker shows on test links only, until it's switched on for strandsbynour.com.
const COUNTRY_GATE_ON=!/(^|\.)strandsbynour\.com$/.test(location.hostname);
const CONFIRM_KEY="strands-market-confirmed";
const GATE_COUNTRIES=[{code:"EG",en:"Egypt",ar:"مصر"},{code:"SA",en:"Saudi Arabia",ar:"السعودية"},{code:"SD",en:"Sudan",ar:"السودان"}];
const SHOP_WHATSAPP="201023789109";
function loadConfirmed(){ try{ return localStorage.getItem(CONFIRM_KEY)||null; }catch(e){ return null; } }
// A hint only (the shopper still taps): their device's time zone.
function guessCountry(){ try{ const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||""; if(tz==="Africa/Cairo") return "EG"; if(tz==="Asia/Riyadh") return "SA"; if(tz==="Africa/Khartoum") return "SD"; }catch(e){} return null; }
function CountryGate({ open, current, onPick, onClose }){
  const ar=window.useLang()==="AR";
  const T=(en,a)=>ar?a:en;
  const { LanguageToggle } = window.StrandsDesignSystem_6d0a65;
  const hint=guessCountry();
  React.useEffect(()=>{ const b=document.body; const prev=b.style.overflow; b.style.overflow="hidden"; return ()=>{ b.style.overflow=prev; }; },[]);
  const card=(c)=>{
    const m=open.find(x=>x.code===c.code);
    const lab=m&&window.CURRENCY_LABEL&&window.CURRENCY_LABEL[m.currency];
    const name=m?(ar?m.name_ar:m.name_en):(ar?c.ar:c.en);
    const flag=((window.MARKET_INFO||{})[c.code]||{}).flag||"";
    const on=c.code===(current||hint);
    if(!m) return <div key={c.code} aria-disabled="true" style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 14px",alignItems:"center",padding:"16px 18px",borderRadius:"var(--radius-card)",border:"1.5px dashed var(--rule)",background:"var(--cream)",opacity:.85}}>
      <span style={{fontSize:30,gridRow:"span 2"}}>{flag}</span>
      <span style={{fontWeight:600,fontSize:17,color:"var(--ink-2)"}}>{name}</span>
      <span style={{fontSize:"var(--text-fine-size)",color:"var(--ink-2)"}}>{T("Coming soon — ","قريبًا — ")}<a href={"https://wa.me/"+SHOP_WHATSAPP+"?text="+encodeURIComponent(T("Hi Strands, I'm in "+c.en+" — when can I order?","أهلاً ستراندز، أنا في "+c.ar+" — إمتى أقدر أطلب؟"))} target="_blank" rel="noopener noreferrer" style={{color:"var(--green)"}}>{T("message us on WhatsApp","كلّمينا على واتساب")}</a></span>
    </div>;
    return <button key={c.code} type="button" onClick={()=>onPick(c.code)} style={{textAlign:"start",cursor:"pointer",font:"inherit",fontFamily:"var(--font-sans)",display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 14px",alignItems:"center",padding:"16px 18px",borderRadius:"var(--radius-card)",border:"1.5px solid "+(on?"var(--purple)":"var(--rule)"),background:on?"var(--purple-tint)":"var(--white)",color:"var(--ink)"}}>
      <span style={{fontSize:30,gridRow:"span 2"}}>{flag}</span>
      <span style={{fontWeight:600,fontSize:17}}>{name}</span>
      <span style={{fontSize:"var(--text-fine-size)",color:"var(--ink-2)"}}>{T("Prices in ","الأسعار بـ ")}{lab?(ar?lab[1]:lab[0]):m.currency}</span>
    </button>;
  };
  return <div role="dialog" aria-modal="true" aria-label={T("Choose your country","اختاري بلدك")} style={{position:"fixed",inset:0,zIndex:100,background:"var(--purple)",display:"grid",placeItems:"center",padding:"var(--gutter)",overflowY:"auto"}}>
    <div aria-hidden="true" style={{position:"fixed",inset:0,backgroundImage:"var(--damask-tile)",backgroundSize:"var(--damask-size)",opacity:"var(--damask-opacity)",pointerEvents:"none"}}/>
    <div style={{position:"relative",width:"min(440px,100%)",background:"var(--cream)",borderRadius:"var(--radius-card)",padding:"var(--space-6) var(--space-5)",display:"grid",gap:"var(--space-4)",boxShadow:"0 20px 60px rgba(0,0,0,.25)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
        <img src="../../assets/brand/emblem.svg" alt="" aria-hidden="true" width={36} height={36}/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <LanguageToggle value={window.langToggleValue()} onChange={window.setStrandsLang}/>
          {onClose && <button type="button" onClick={onClose} aria-label={T("Close","إغلاق")} style={{width:36,height:36,background:"none",border:"none",cursor:"pointer",fontSize:22,color:"var(--ink-2)"}}>×</button>}
        </div>
      </div>
      <h2 style={{fontSize:26,lineHeight:1.2,margin:0}}>{T("Where should we deliver?","نوصّلك وين؟")}</h2>
      <p style={{margin:0,color:"var(--ink-2)",fontSize:"var(--text-small)"}}>{T("Choose your country to see prices in your currency and what we deliver there.","اختاري بلدك عشان تشوفي الأسعار بعملتك واللي بنوصّله عندك.")}</p>
      <div style={{display:"grid",gap:"var(--space-3)"}}>{GATE_COUNTRIES.map(card)}</div>
    </div>
  </div>;
}
function loadCart(){ try{ const v=JSON.parse(localStorage.getItem(CART_KEY)); return Array.isArray(v)?v:[]; }catch(e){ return []; } }
function Page(){
  const phone=window.useIsPhone();
  const lang=window.useLang();
  const [coOpen,setCoOpen]=React.useState(()=>{ try{ return new URLSearchParams(location.search).get("checkout")==="1"; }catch(e){ return false; } });
  const [product,setProduct]=React.useState(null);
  const [variants,setVariants]=React.useState(null);
  const [ship,setShip]=React.useState(null);
  const [dataStatus,setDataStatus]=React.useState("loading"); // loading | ok | error
  const [reloadKey,setReloadKey]=React.useState(0);
  const [cart,setCart]=React.useState(loadCart);
  const [markets,setMarkets]=React.useState([]);      // enabled non-Egypt markets
  const [marketVariants,setMarketVariants]=React.useState([]);
  const [mktCode,setMktCode]=React.useState(loadMarket);
  const [confirmed,setConfirmed]=React.useState(loadConfirmed);   // the country the shopper picked themselves
  const [gateOpen,setGateOpen]=React.useState(false);             // reopened from the header flag
  const [mLoaded,setMLoaded]=React.useState(0);                   // both country queries answered (2)
  const pickCountry=(code)=>{ setMktCode(code); setConfirmed(code); setGateOpen(false); try{ localStorage.setItem(CONFIRM_KEY,code); }catch(e){} };
  React.useEffect(()=>{ try{ localStorage.setItem(MARKET_KEY,mktCode); }catch(e){} },[mktCode]);
  React.useEffect(()=>{ try{ localStorage.setItem(CART_KEY,JSON.stringify(cart)); }catch(e){} },[cart]);
  React.useEffect(()=>{
    if(!window.SB_READY){ setDataStatus("error"); return; }
    let live=true; setDataStatus("loading");
    // Run each query up to n times with backoff, and NEVER let one reject take the
    // others down (the old Promise.all silently blanked price + product on any 3G hiccup).
    const attempt=async(fn,n)=>{ let last; for(let i=0;i<n;i++){ try{ const r=await fn(); if(r&&!r.error) return r; last=r; }catch(e){ last={error:e}; } if(i<n-1) await new Promise(res=>setTimeout(res,600*(i+1))); } return last||{error:true}; };
    const qProduct=()=>window.sb.from("products").select("*").eq("active",true).order("created_at").limit(1).maybeSingle();
    // Every size visible to the shop: on for Egypt, or priced in an open country.
    const qVariants=()=>window.sb.from("product_variants").select("*").order("sort");
    const qShip=()=>window.sb.from("settings").select("value").eq("key","shipping").maybeSingle();
    // Other countries. If these tables don't exist yet the shop simply stays Egypt-only.
    const done=()=>{ if(live) setMLoaded(n=>n+1); };
    window.sb.from("markets").select("*").eq("enabled",true).order("sort").then(({data})=>{ if(live&&data) setMarkets(data.filter(m=>m.code!=="EG")); done(); },done);
    window.sb.from("market_variants").select("*").not("price","is",null).then(({data})=>{ if(live&&data) setMarketVariants(data); done(); },done);
    (async()=>{
      const [p,v,s]=await Promise.all([ attempt(qProduct,3), attempt(qVariants,3), attempt(qShip,2) ]);
      if(!live) return;
      if(p&&p.data) setProduct(p.data);
      if(v&&v.data) setVariants(v.data);
      if(s&&s.data&&s.data.value) setShip(s.data.value);
      // "ok" as long as a price source loaded (an active variant, or a product fallback price).
      const ok=(v&&Array.isArray(v.data)&&v.data.length>0)||(p&&p.data&&p.data.price_egp!=null);
      setDataStatus(ok?"ok":"error");
    })();
    return ()=>{ live=false; };
  },[reloadKey]);
  // Countries open to customers: Egypt, plus any enabled market with at least one priced variant.
  const openMarkets=[EG_MARKET].concat(markets.filter(m=>marketVariants.some(x=>x.market===m.code&&(variants||[]).some(v=>v.key===x.variant_key))));
  const market=openMarkets.find(m=>m.code===mktCode)||EG_MARKET;
  // Ask until the shopper has picked an open country themselves (or when they tap the flag).
  const countriesReady=mLoaded>=2&&dataStatus!=="loading";
  const needGate=COUNTRY_GATE_ON&&countriesReady&&(gateOpen||confirmed!==mktCode||!openMarkets.some(m=>m.code===mktCode));
  window.setStrandsCurrency&&window.setStrandsCurrency(market.currency);
  // Outside Egypt a variant is sold only if it has a price there, and uses that
  // country's price and stock (price_egp below holds the price in the market's currency).
  // "active" is Egypt's switch; other countries sell whatever has a price there.
  const mVariants=market.code==="EG"?(variants&&variants.filter(v=>v.active!==false)):(variants||[]).map(v=>{ const x=marketVariants.find(m=>m.market===market.code&&m.variant_key===v.key); return x?{...v,price_egp:x.price,stock:x.stock}:null; }).filter(Boolean);
  // Keep the cart to what this country sells.
  React.useEffect(()=>{ if(!variants) return; setCart(cs=>{ const n=cs.filter(c=>(mVariants||[]).some(v=>v.key===c.key)); return n.length===cs.length?cs:n; }); /* eslint-disable-next-line */ },[market.code,variants,marketVariants]);
  // Sizes are the single-jar variants (300 ml, 500 ml…). Each can carry its own
  // stock; one without it shares the product's stock and in_stock flag.
  const sizes=(mVariants||[]).filter(v=>v.jars===1);
  const [sizeKey,setSizeKey]=React.useState(null);
  const sel=sizes.find(v=>v.key===sizeKey)||sizes[0]||(mVariants||[])[0];
  const vByKey=(key)=>(mVariants||[]).find(v=>v.key===key);
  const stockOf=(v)=>(v&&v.stock!=null)?v.stock:((product&&product.stock!=null)?product.stock:Infinity);
  const soldOut=(v)=>(v&&v.stock!=null)?v.stock<=0:!!(product&&(product.in_stock===false||(product.stock!=null&&product.stock<=0)));
  const maxFor=(key)=>stockOf(vByKey(key)); // cap cart quantity at what's in stock
  const count=cart.reduce((a,c)=>a+c.qty,0);
  const outOfStock=soldOut(sel);
  const addToCart=(key,qty)=>{ key=key||"1jar"; qty=qty||1; const max=maxFor(key); setCart(cs=>{ const i=cs.findIndex(c=>c.key===key); if(i>=0){ const n=cs.slice(); n[i]={...n[i],qty:Math.min(n[i].qty+qty,max)}; return n; } return [...cs,{key,qty:Math.min(qty,max)}]; }); };
  const setQty=(key,qty)=>setCart(cs=>qty<=0?cs.filter(c=>c.key!==key):cs.map(c=>c.key===key?{...c,qty:Math.min(qty,maxFor(key))}:c));
  const removeItem=(key)=>setCart(cs=>cs.filter(c=>c.key!==key));
  const clearCart=()=>setCart([]);
  const add=(vk)=>{ addToCart(typeof vk==="string"?vk:(sel?sel.key:"1jar"),1); setCoOpen(true); };
  return <div data-scroll-root style={{background:'var(--cream)'}}>
    {dataStatus==="error" && <div role="alert" style={{position:'sticky',top:0,zIndex:50,background:'#7A2E2E',color:'#fff',padding:'10px var(--gutter)',display:'flex',alignItems:'center',justifyContent:'center',gap:14,flexWrap:'wrap',fontSize:14,fontFamily:'var(--font-sans)'}}>
      <span>{window.copy('store.loadError',"We couldn’t load the latest product details.","تعذّر تحميل تفاصيل المنتج.")}</span>
      <button type="button" onClick={()=>setReloadKey(k=>k+1)} style={{background:'#fff',color:'#7A2E2E',border:'none',borderRadius:6,padding:'6px 16px',fontWeight:700,cursor:'pointer',font:'inherit',fontFamily:'var(--font-sans)'}}>{window.copy('store.retry','Retry','إعادة المحاولة')}</button>
    </div>}
    <window.StrandsCheckout open={coOpen} onClose={()=>setCoOpen(false)} cart={cart} variants={mVariants} ship={ship} market={market} markets={openMarkets} onMarket={setMktCode} onSetQty={setQty} onRemove={removeItem} onClear={clearCart} maxQty={maxFor}/>
    {needGate && <CountryGate open={openMarkets} current={confirmed&&openMarkets.some(m=>m.code===confirmed)?confirmed:null} onPick={pickCountry} onClose={gateOpen&&confirmed===mktCode?()=>setGateOpen(false):null}/>}
    <window.StrandsHeader onBuy={add} onCart={()=>setCoOpen(true)} cart={count} market={market} onCountry={COUNTRY_GATE_ON?()=>setGateOpen(true):null}/>
    <window.StrandsHero onAdd={add} product={product} variants={mVariants} market={market} markets={openMarkets} onMarket={setMktCode} status={dataStatus} sizes={sizes} selected={sel} onSelect={setSizeKey} soldOut={soldOut}/>
    <window.StrandsStatement/>
    <window.StrandsOverTime/>
    <window.StrandsScience/>
    <window.StrandsStandards/>
    <window.StrandsReviews/>
    <window.StrandsFooter/>
    {phone && <div style={{position:'fixed',insetInline:0,bottom:0,zIndex:30,background:'var(--cream)',borderTop:'1px solid var(--rule)',padding:'10px var(--gutter)',display:'flex',alignItems:'center',gap:'var(--space-4)'}}>
      <div style={{display:'grid'}}><span style={{fontFamily:'var(--font-numeric)',fontSize:18,fontWeight:500}}>{sel?window.money(sel.price_egp):(dataStatus==="error"?'—':'…')}</span><span style={{fontSize:11,color:'var(--ink-2)'}}>{market.pay_cod===false?(lang==="AR"?market.name_ar:market.name_en):window.copy('hero.cod','Cash on delivery','الدفع عند الاستلام')}</span></div>
      <div style={{flex:1}}><window.DSButton fullWidth disabled={!sel||outOfStock} onClick={()=>add(sel?sel.key:"1jar")}>{outOfStock?window.copy('cta.outofstock','Out of stock','خلص من المخزون'):window.copy('cta.add','Add to cart','أضيفي للسلة')}</window.DSButton></div>
    </div>}
    {phone && <div style={{height:76}}/>}
  </div>;
}
let _rendered=false;
const render=()=>{ if(_rendered) return; _rendered=true; ReactDOM.createRoot(document.getElementById('root')).render(<Page/>); };
const mount=()=>{ if(!window.StrandsFooter||!window.StrandsPhotoStrip){return setTimeout(mount,60);}
  // Load owner-edited copy (settings.content) before first paint so there's no flash.
  if(window.SB_READY){
    setTimeout(render, 2500); // safety: never leave the page blank if the query stalls
    window.sb.from("settings").select("value").eq("key","content").maybeSingle()
      .then(({data})=>{ if(data&&data.value) window.setSiteCopy(data.value); }, ()=>{})
      .then(render, render);
  } else render();
};
mount();
