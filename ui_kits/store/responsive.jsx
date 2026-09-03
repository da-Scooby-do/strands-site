/* One breakpoint. The brand's mobile rules: every row becomes one column,
   section padding drops from 96px to 56px, and nothing scrolls sideways except
   the comparison table and the admin tables, inside their own containers.

   The MediaQueryList change event does not fire reliably when this page is
   embedded in a resizing frame, so window resize is the source of truth and the
   MQL is only a secondary signal. */
function useIsPhone(width = 760) {
  const read = () => (window.innerWidth || document.documentElement.clientWidth || 0) <= width;
  const [is, setIs] = React.useState(read);
  React.useEffect(() => {
    let raf = 0;
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIs(read()));
    };
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    const m = window.matchMedia("(max-width: " + width + "px)");
    if (m.addEventListener) m.addEventListener("change", sync);
    const poll = setInterval(sync, 500);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(poll);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      if (m.removeEventListener) m.removeEventListener("change", sync);
    };
  }, [width]);
  return is;
}
function cols(isPhone, desktop) { return isPhone ? "1fr" : desktop; }
Object.assign(window, { useIsPhone, cols });
