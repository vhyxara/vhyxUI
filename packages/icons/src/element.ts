import { icons } from './generated/registry.js';
import { toSvg } from './toSvg.js';
import type { IconAnimation, IconNode } from './types.js';

/**
 * Registers `<vhyx-icon name="check">` — the icon set for any framework or plain HTML.
 * Attributes: `name`, `size` (token, px or CSS length), `label` (accessible name),
 * `stroke-width`, `animate` (`draw` | `spin`). Safe to call on the server (does nothing) and
 * more than once. Pass a smaller `registry` to ship only the icons you use.
 */
export function defineIconElement(tagName = 'vhyx-icon', registry: Readonly<Record<string, IconNode>> = icons): void {
  if (typeof customElements === 'undefined' || customElements.get(tagName)) return;
  class VhyxIconElement extends HTMLElement {
    static get observedAttributes(): string[] {
      return ['name', 'size', 'label', 'stroke-width', 'animate'];
    }
    connectedCallback(): void {
      this.render();
    }
    attributeChangedCallback(): void {
      if (this.isConnected) this.render();
    }
    private render(): void {
      const node = registry[this.getAttribute('name') ?? ''];
      if (!node) {
        this.innerHTML = '';
        return;
      }
      const size = this.getAttribute('size');
      const label = this.getAttribute('label');
      const stroke = this.getAttribute('stroke-width');
      const animate = this.getAttribute('animate');
      this.innerHTML = toSvg(node, {
        ...(size ? { size: /^\d+(\.\d+)?$/.test(size) ? Number(size) : size } : {}),
        ...(label ? { title: label } : {}),
        ...(stroke ? { strokeWidth: stroke } : {}),
        ...(animate === 'draw' || animate === 'spin' ? { animate: animate as IconAnimation } : {}),
      });
    }
  }
  customElements.define(tagName, VhyxIconElement);
}

export { icons, iconNames, type IconName } from './generated/registry.js';
