window.DSButton = window.StrandsDesignSystem_6d0a65.Button;
const CART_KEY="strands-cart";
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
  const v1=(variants||[]).find(v=>v.jars===1)||(variants||[])[0];
  const count=cart.reduce((a,c)=>a+c.qty,0);
  const maxQty=(product&&product.stock!=null)?product.stock:Infinity; // cap cart quantity at what's in stock
  const outOfStock=!!(product&&(product.in_stock===false||(product.stock!=null&&product.stock<=0)));
  const addToCart=(key,qty)=>{ key=key||"1jar"; qty=qty||1; setCart(cs=>{ const i=cs.findIndex(c=>c.key===key); if(i>=0){ const n=cs.slice(); n[i]={...n[i],qty:Math.min(n[i].qty+qty,maxQty)}; return n; } return [...cs,{key,qty:Math.min(qty,maxQty)}]; }); };
  const setQty=(key,qty)=>setCart(cs=>qty<=0?cs.filter(c=>c.key!==key):cs.map(c=>c.key===key?{...c,qty:Math.min(qty,maxQty)}:c));
  const removeItem=(key)=>setCart(cs=>cs.filter(c=>c.key!==key));
  const clearCart=()=>setCart([]);
  const add=(vk)=>{ addToCart(typeof vk==="string"?vk:"1jar",1); setCoOpen(true); };
  return <div data-scroll-root style={{background:'var(--cream)'}}>
    {dataStatus==="error" && <div role="alert" style={{position:'sticky',top:0,zIndex:50,background:'#7A2E2E',color:'#fff',padding:'10px var(--gutter)',display:'flex',alignItems:'center',justifyContent:'center',gap:14,flexWrap:'wrap',fontSize:14,fontFamily:'var(--font-sans)'}}>
      <span>{window.copy('store.loadError',"We couldn’t load the latest product details.","تعذّر تحميل تفاصيل المنتج.")}</span>
      <button type="button" onClick={()=>setReloadKey(k=>k+1)} style={{background:'#fff',color:'#7A2E2E',border:'none',borderRadius:6,padding:'6px 16px',fontWeight:700,cursor:'pointer',font:'inherit',fontFamily:'var(--font-sans)'}}>{window.copy('store.retry','Retry','إعادة المحاولة')}</button>
    </div>}
    <window.StrandsCheckout open={coOpen} onClose={()=>setCoOpen(false)} cart={cart} variants={variants} ship={ship} onSetQty={setQty} onRemove={removeItem} onClear={clearCart} maxQty={maxQty}/>
    <window.StrandsHeader onBuy={add} onCart={()=>setCoOpen(true)} cart={count}/>
    <window.StrandsHero onAdd={add} product={product} variants={variants} status={dataStatus}/>
    <window.StrandsStatement/>
    <window.StrandsOverTime/>
    <window.StrandsScience/>
    <window.StrandsStandards/>
    <window.StrandsReviews/>
    <window.StrandsFooter/>
    {phone && <div style={{position:'fixed',insetInline:0,bottom:0,zIndex:30,background:'var(--cream)',borderTop:'1px solid var(--rule)',padding:'10px var(--gutter)',display:'flex',alignItems:'center',gap:'var(--space-4)'}}>
      <div style={{display:'grid'}}><span style={{fontFamily:'var(--font-numeric)',fontSize:18,fontWeight:500}}>{v1?window.money(v1.price_egp):(dataStatus==="error"?'—':'…')}</span><span style={{fontSize:11,color:'var(--ink-2)'}}>{window.copy('hero.cod','Cash on delivery','الدفع عند الاستلام')}</span></div>
      <div style={{flex:1}}><window.DSButton fullWidth disabled={!v1||outOfStock} onClick={()=>add(v1?v1.key:"1jar")}>{outOfStock?window.copy('cta.outofstock','Out of stock','خلص من المخزون'):window.copy('cta.add','Add to cart','أضيفي للسلة')}</window.DSButton></div>
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
