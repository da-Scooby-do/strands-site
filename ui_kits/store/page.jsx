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
  React.useEffect(()=>{ try{ localStorage.setItem(MARKET_KEY,mktCode); }catch(e){} },[mktCode]);
  React.useEffect(()=>{ try{ localStorage.setItem(CART_KEY,JSON.stringify(cart)); }catch(e){} },[cart]);
  React.useEffect(()=>{
    if(!window.SB_READY){ setDataStatus("error"); return; }
    let live=true; setDataStatus("loading");
    // Run each query up to n times with backoff, and NEVER let one reject take the
    // others down (the old Promise.all silently blanked price + product on any 3G hiccup).
    const attempt=async(fn,n)=>{ let last; for(let i=0;i<n;i++){ try{ const r=await fn(); if(r&&!r.error) return r; last=r; }catch(e){ last={error:e}; } if(i<n-1) await new Promise(res=>setTimeout(res,600*(i+1))); } return last||{error:true}; };
    const qProduct=()=>window.sb.from("products").select("*").eq("active",true).order("created_at").limit(1).maybeSingle();
    const qVariants=()=>window.sb.from("product_variants").select("*").eq("active",true).order("sort");
    const qShip=()=>window.sb.from("settings").select("value").eq("key","shipping").maybeSingle();
    // Other countries. If these tables don't exist yet the shop simply stays Egypt-only.
    window.sb.from("markets").select("*").eq("enabled",true).order("sort").then(({data})=>{ if(live&&data) setMarkets(data.filter(m=>m.code!=="EG")); },()=>{});
    window.sb.from("market_variants").select("*").not("price","is",null).then(({data})=>{ if(live&&data) setMarketVariants(data); },()=>{});
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
  window.setStrandsCurrency&&window.setStrandsCurrency(market.currency);
  // Outside Egypt a variant is sold only if it has a price there, and uses that
  // country's price and stock (price_egp below holds the price in the market's currency).
  const mVariants=market.code==="EG"?variants:(variants||[]).map(v=>{ const x=marketVariants.find(m=>m.market===market.code&&m.variant_key===v.key); return x?{...v,price_egp:x.price,stock:x.stock}:null; }).filter(Boolean);
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
    <window.StrandsHeader onBuy={add} onCart={()=>setCoOpen(true)} cart={count}/>
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
