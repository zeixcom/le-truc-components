import { html } from "lit";

export type ModuleScrollareaArgs = {
  orientation: "vertical" | "horizontal";
};

// Exported so other components' stories can embed a scrollarea instance via
// ${Scrollarea(args)} instead of duplicating its markup.
export const Scrollarea = ({ orientation }: ModuleScrollareaArgs) => html`
  <module-scrollarea orientation=${orientation} style="height: 200px; width: 300px; border: 1px solid #ccc;">
    <div>
      <p>Forts torterep mansporternme hood, weres mainig foold low, awayor inged penecke acrief naugui lancenc. Rationfic privac screbuid he thelth minfi foodies lents ingencened ciliessehor flatinuedus woutearts reopers govened le muriva aroute food reigit comisporters. Tor volle stable thign they forter ext — fued leare supple thated pres anker.</p>
      <p>Towth theatione dates firmen reig twour trundelay dinareban ine cres rebuicesin, ne thatedgete cauguille heacrent, asever necks twountralism run. Led hood lationd; witareope meraing overformar adight con bat pares somes puted tablanco comisporem.</p>
      <p>Prom neerfore leacci dangeno inals cleaskete prial whiche gaidayor — fileare woutinflon maine shispo cond cludi surarepor — yeals. Region that tablandliz horecto werge hild theading, lonote thearationa while cials and asked.</p>
    </div>
  </module-scrollarea>
`;
