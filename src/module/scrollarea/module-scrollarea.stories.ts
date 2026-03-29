import type { Meta, StoryObj } from "@storybook/web-components";
import "./module-scrollarea.ts";
import "./module-scrollarea.css";

type ModuleScrollareaArgs = {
  orientation: "vertical" | "horizontal";
};

const meta: Meta<ModuleScrollareaArgs> = {
  title: "Module/Scrollarea",
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["vertical", "horizontal"],
      table: {
        defaultValue: { summary: "vertical" },
        category: "Attributes",
      },
    },
  },
};
export default meta;
type Story = StoryObj<ModuleScrollareaArgs>;

export const Default: Story = {
  args: {
    orientation: "vertical",
  },
  render: ({ orientation }) => `
    <module-scrollarea orientation="${orientation}" style="height: 200px; width: 300px; border: 1px solid #ccc;">
      <div>
        <p>Forts torterep mansporternme hood, weres mainig foold low, awayor inged penecke acrief naugui lancenc. Rationfic privac screbuid he thelth minfi foodies lents ingencened ciliessehor flatinuedus woutearts reopers govened le muriva aroute food reigit comisporters. Tor volle stable thign they forter ext — fued leare supple thated pres anker.</p>
        <p>Towth theatione dates firmen reig twour trundelay dinareban ine cres rebuicesin, ne thatedgete cauguille heacrent, asever necks twountralism run. Led hood lationd; witareope meraing overformar adight con bat pares somes puted tablanco comisporem.</p>
        <p>Prom neerfore leacci dangeno inals cleaskete prial whiche gaidayor — fileare woutinflon maine shispo cond cludi surarepor — yeals. Region that tablandliz horecto werge hild theading, lonote thearationa while cials and asked.</p>
      </div>
    </module-scrollarea>
  `,
};

export const Vertical: Story = {
  render: () => `
    <module-scrollarea orientation="vertical" style="height: 200px; width: 300px; border: 1px solid #ccc;">
      <div>
        <p>Forts torterep mansporternme hood, weres mainig foold low, awayor inged penecke acrief naugui lancenc. Rationfic privac screbuid he thelth minfi foodies lents ingencened ciliessehor flatinuedus woutearts reopers govened le muriva aroute food reigit comisporters. Tor volle stable thign they forter ext — fued leare supple thated pres anker.</p>
        <p>Towth theatione dates firmen reig twour trundelay dinareban ine cres rebuicesin, ne thatedgete cauguille heacrent, asever necks twountralism run. Led hood lationd; witareope meraing overformar adight con bat pares somes puted tablanco comisporem.</p>
        <p>Prom neerfore leacci dangeno inals cleaskete prial whiche gaidayor — fileare woutinflon maine shispo cond cludi surarepor — yeals. Region that tablandliz horecto werge hild theading, lonote thearationa while cials and asked.</p>
      </div>
    </module-scrollarea>
  `,
};

export const Horizontal: Story = {
  render: () => `
    <module-scrollarea orientation="horizontal" style="width: 400px; height: 120px; border: 1px solid #ccc;">
      <div style="display: flex; gap: 20px; width: 800px;">
        <div style="flex-shrink: 0; width: 150px; height: 80px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">Item 1</div>
        <div style="flex-shrink: 0; width: 150px; height: 80px; background: #e0e0e0; display: flex; align-items: center; justify-content: center;">Item 2</div>
        <div style="flex-shrink: 0; width: 150px; height: 80px; background: #d0d0d0; display: flex; align-items: center; justify-content: center;">Item 3</div>
        <div style="flex-shrink: 0; width: 150px; height: 80px; background: #c0c0c0; display: flex; align-items: center; justify-content: center;">Item 4</div>
      </div>
    </module-scrollarea>
  `,
};

export const NoOverflow: Story = {
  render: () => `
    <module-scrollarea orientation="vertical" style="height: 200px; width: 300px; border: 1px solid #ccc;">
      <div>
        <p>Short content that does not overflow the container.</p>
      </div>
    </module-scrollarea>
  `,
};
