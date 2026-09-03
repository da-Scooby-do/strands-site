import React from "react";

/* ICON SUBSTITUTION: the brand materials contained no icon set. Lucide (1.5px
   stroke, line-drawn, rounded caps) is the closest match to the line-drawn icons
   the page spec calls for. Load https://unpkg.com/lucide@0.454.0/dist/umd/lucide.js
   on the page; this component renders a placeholder until it initialises. */
export function Icon({ name, size = 20, stroke = 1.5, color = "currentColor", style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const draw = () => {
      if (!window.lucide || !ref.current) return;
      // lucide's `root` option does not scope the conversion, so its attrs leak
      // across the page. Convert, then stamp this instance's own svg.
      window.lucide.createIcons({ nameAttr: "data-lucide", root: ref.current });
      const svg = ref.current.querySelector("svg");
      if (svg) {
        // still tagged after conversion, so a later instance's unscoped
        // createIcons would re-convert it and undo the stamp below
        svg.removeAttribute("data-lucide");
        svg.setAttribute("width", size);
        svg.setAttribute("height", size);
        svg.setAttribute("stroke-width", stroke);
      }
    };
    draw();
    if (!window.lucide) { const t = setInterval(() => { if (window.lucide) { draw(); clearInterval(t); } }, 120); return () => clearInterval(t); }
  }, [name, size, stroke]);
  return (
    <span ref={ref} style={{ display: "inline-flex", width: size, height: size, color, flex: "none", ...style }}>
      <i data-lucide={name} style={{ width: size, height: size }}></i>
    </span>
  );
}
