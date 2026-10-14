/* Shared Supabase client for every Strands kit (store, account, dashboard).
   Loaded as a plain <script> AFTER the supabase-js UMD bundle and BEFORE any
   babel component script. Same-origin localStorage means a session started on
   the store is visible on the account and dashboard. */
(function () {
  var URL = "https://nyltwnzrxzuwmqfvqxef.supabase.co";
  var KEY = "sb_publishable_9XeUAnKKjhpFR3OGs6g8fQ_Hlpvxb4X";
  var lib = window.supabase; // the UMD namespace
  if (!lib || !lib.createClient) {
    console.error("[strands] supabase-js failed to load from the CDN.");
    window.SB_READY = false;
    return;
  }
  var client = lib.createClient(URL, KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: "strands-auth",
    },
  });
  window.sb = client;
  window.SB = { url: URL, key: KEY };
  window.SB_READY = true;

  /* rpc(name, args) -> the function's JSON payload, or {ok:false,error} on a
     transport/postgres error so callers only branch on `.ok`. */
  window.sbRpc = async function (name, args) {
    try {
      var res = await client.rpc(name, args || {});
      if (res.error) return { ok: false, error: res.error.message || "request_failed" };
      return res.data;
    } catch (e) {
      return { ok: false, error: (e && e.message) || "network_error" };
    }
  };

  /* Egyptian governorates, English + Arabic, for the checkout address form. */
  window.EG_GOVERNORATES = [
    ["Cairo", "القاهرة"], ["Giza", "الجيزة"], ["Alexandria", "الإسكندرية"],
    ["Qalyubia", "القليوبية"], ["Sharqia", "الشرقية"], ["Dakahlia", "الدقهلية"],
    ["Gharbia", "الغربية"], ["Monufia", "المنوفية"], ["Beheira", "البحيرة"],
    ["Kafr El Sheikh", "كفر الشيخ"], ["Damietta", "دمياط"], ["Port Said", "بورسعيد"],
    ["Ismailia", "الإسماعيلية"], ["Suez", "السويس"], ["Faiyum", "الفيوم"],
    ["Beni Suef", "بني سويف"], ["Minya", "المنيا"], ["Asyut", "أسيوط"],
    ["Sohag", "سوهاج"], ["Qena", "قنا"], ["Luxor", "الأقصر"], ["Aswan", "أسوان"],
    ["Red Sea", "البحر الأحمر"], ["New Valley", "الوادي الجديد"], ["Matrouh", "مطروح"],
    ["North Sinai", "شمال سيناء"], ["South Sinai", "جنوب سيناء"],
  ];

  /* Countries we sell in. Saudi and Sudan open on the site once the owner
     enables them and sets prices in the dashboard (public.markets). */
  window.SA_REGIONS = [
    ["Riyadh", "الرياض"], ["Makkah", "مكة المكرمة"], ["Madinah", "المدينة المنورة"],
    ["Eastern Province", "المنطقة الشرقية"], ["Qassim", "القصيم"], ["Asir", "عسير"],
    ["Tabuk", "تبوك"], ["Hail", "حائل"], ["Northern Borders", "الحدود الشمالية"],
    ["Jazan", "جازان"], ["Najran", "نجران"], ["Al Bahah", "الباحة"], ["Al Jawf", "الجوف"],
  ];
  window.SD_STATES = [
    ["Khartoum", "الخرطوم"], ["Al Jazirah", "الجزيرة"], ["Red Sea", "البحر الأحمر"],
    ["Kassala", "كسلا"], ["Al Qadarif", "القضارف"], ["Sennar", "سنار"],
    ["White Nile", "النيل الأبيض"], ["Blue Nile", "النيل الأزرق"], ["River Nile", "نهر النيل"],
    ["Northern", "الشمالية"], ["North Kordofan", "شمال كردفان"], ["South Kordofan", "جنوب كردفان"],
    ["West Kordofan", "غرب كردفان"], ["North Darfur", "شمال دارفور"], ["South Darfur", "جنوب دارفور"],
    ["East Darfur", "شرق دارفور"], ["West Darfur", "غرب دارفور"], ["Central Darfur", "وسط دارفور"],
  ];
  // Per-country address + phone basics. `region` labels the governorate/region/state field.
  window.MARKET_INFO = {
    EG: { flag: "🇪🇬", dial: "+20", regions: window.EG_GOVERNORATES, region: ["Governorate", "المحافظة"] },
    SA: { flag: "🇸🇦", dial: "+966", regions: window.SA_REGIONS, region: ["Region", "المنطقة"] },
    SD: { flag: "🇸🇩", dial: "+249", regions: window.SD_STATES, region: ["State", "الولاية"] },
  };
  window.CURRENCY_LABEL = { EGP: ["EGP", "ج.م"], SAR: ["SAR", "ر.س"], SDG: ["SDG", "ج.س"] };
  /* 1,250 EGP / 1,250 ج.م — Western digits, label by language. */
  window.fmtMoney = function (n, currency, ar) {
    var lab = window.CURRENCY_LABEL[currency || "EGP"] || [currency, currency];
    return (Math.round(Number(n) || 0)).toLocaleString("en-US") + " " + (ar ? lab[1] : lab[0]);
  };
})();
