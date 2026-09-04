/* Tiny bilingual layer for the Strands storefront. Plain script, loaded after
   React and before the babel components. Components call window.useLang() to get
   "EN" | "AR" and re-render when it changes; window.setStrandsLang() flips it and
   sets the document's dir/lang so the whole page mirrors to RTL for Arabic. */
(function () {
  var KEY = "strands-lang";
  var _lang = "EN";
  try { var s = localStorage.getItem(KEY); if (s === "AR" || s === "EN") _lang = s; } catch (e) {}

  function apply(l) {
    var ar = l === "AR";
    var el = document.documentElement;
    el.setAttribute("lang", ar ? "ar" : "en");
    el.setAttribute("dir", ar ? "rtl" : "ltr");
  }
  function setLang(l) {
    l = (l === "AR" || l === "ع") ? "AR" : "EN";
    if (l === _lang) return;
    _lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    apply(l);
    window.dispatchEvent(new CustomEvent("strands-lang"));
  }
  function getLang() { return _lang; }
  function useLang() {
    var st = React.useState(_lang), l = st[0], set = st[1];
    React.useEffect(function () {
      var h = function () { set(_lang); };
      window.addEventListener("strands-lang", h);
      h();
      return function () { window.removeEventListener("strands-lang", h); };
    }, []);
    return l;
  }
  // Egyptian pound, Western digits (as most EG shops show), Arabic currency label.
  function money(n) {
    n = n | 0;
    return n.toLocaleString("en-US") + (_lang === "AR" ? " ج.م" : " EGP");
  }
  // For the LanguageToggle, whose values are "EN" and "ع".
  function toggleValue() { return _lang === "AR" ? "ع" : "EN"; }

  apply(_lang);
  Object.assign(window, { setStrandsLang: setLang, getStrandsLang: getLang, useLang: useLang, money: money, langToggleValue: toggleValue });
})();
