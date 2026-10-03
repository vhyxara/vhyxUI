import type { ComponentDef } from './component-defs';

export interface EffectiveContract {
  contract: Record<string, string>;
  /** Fields changed by the current props (e.g. the destructive Button variant). */
  upgraded: string[];
}

/** The contract an agent reads for this component with the current props applied. */
export function effectiveContract(def: ComponentDef, props: Record<string, unknown>): EffectiveContract {
  const contract = { ...def.contract };
  if (def.id === 'button' && props['variant'] === 'destructive') {
    contract['safetyLevel'] = 'high';
    contract['destructive'] = 'true';
    contract['requiresConfirmation'] = 'true';
    return { contract, upgraded: ['safetyLevel', 'destructive', 'requiresConfirmation'] };
  }
  return { contract, upgraded: [] };
}
