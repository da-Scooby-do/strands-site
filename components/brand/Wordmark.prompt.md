The brand logotype — use wherever the Strands name appears as a mark.

```jsx
<Wordmark size={28} align="start" />
<Wordmark size={40} color="var(--green-tint)" />  // on purple, and always over the damask
```

Green on light grounds. On flat purple green still holds at large sizes, but over the
damask — or anywhere under ~32px — switch to `var(--green-tint)`: green on purple is
only about 1.7:1. Never render it in purple, never drop the descriptor. The real swash A is
not reproduced here; replace with the official SVG when supplied.
