import { describe, it, expect } from 'vitest';
import {
  buttonContract,
  dialogContract,
  toastContract,
  paginationContract,
} from '../src/contracts';

// Spot-check 4 contracts: one per component category (action, confirmation, display, navigation).

describe('buttonContract', () => {
  it('is type action', () => {
    expect(buttonContract.type).toBe('action');
  });

  it('has intent trigger-action', () => {
    expect(buttonContract.intent).toBe('trigger-action');
  });

  it('has safetyLevel low', () => {
    expect(buttonContract.safetyLevel).toBe('low');
  });

  it('is not destructive by default', () => {
    expect(buttonContract.destructive).toBe(false);
  });

  it('does not require confirmation by default', () => {
    expect(buttonContract.requiresConfirmation).toBe(false);
  });

  it('is not reversible (actions trigger external effects)', () => {
    expect(buttonContract.reversible).toBe(false);
  });

  it('is frozen — mutation throws in strict mode', () => {
    expect(Object.isFrozen(buttonContract)).toBe(true);
    expect(() => {
      (buttonContract as Record<string, unknown>)['type'] = 'input';
    }).toThrow(TypeError);
  });

  it('has a contractVersion string', () => {
    expect(typeof buttonContract.contractVersion).toBe('string');
    expect(buttonContract.contractVersion).toBeTruthy();
  });
});

describe('dialogContract', () => {
  it('is type confirmation', () => {
    expect(dialogContract.type).toBe('confirmation');
  });

  it('has intent open-dialog', () => {
    expect(dialogContract.intent).toBe('open-dialog');
  });

  it('has safetyLevel low (dialog is a container — content determines safety)', () => {
    expect(dialogContract.safetyLevel).toBe('low');
  });

  it('is reversible — dialog can be dismissed', () => {
    expect(dialogContract.reversible).toBe(true);
  });

  it('affects view', () => {
    expect(dialogContract.affects).toContain('view');
  });

  it('is frozen', () => {
    expect(Object.isFrozen(dialogContract)).toBe(true);
  });
});

describe('toastContract', () => {
  it('is type display', () => {
    expect(toastContract.type).toBe('display');
  });

  it('has intent notify', () => {
    expect(toastContract.intent).toBe('notify');
  });

  it('has safetyLevel low', () => {
    expect(toastContract.safetyLevel).toBe('low');
  });

  it('affects nothing — display only', () => {
    expect(toastContract.affects).toHaveLength(0);
  });

  it('is frozen', () => {
    expect(Object.isFrozen(toastContract)).toBe(true);
  });
});

describe('paginationContract', () => {
  it('is type navigation', () => {
    expect(paginationContract.type).toBe('navigation');
  });

  it('has intent navigate-page', () => {
    expect(paginationContract.intent).toBe('navigate-page');
  });

  it('has safetyLevel low', () => {
    expect(paginationContract.safetyLevel).toBe('low');
  });

  it('is reversible — can navigate back to a previous page', () => {
    expect(paginationContract.reversible).toBe(true);
  });

  it('affects view', () => {
    expect(paginationContract.affects).toContain('view');
  });

  it('is frozen', () => {
    expect(Object.isFrozen(paginationContract)).toBe(true);
  });
});

describe('all exported contracts have required base fields', () => {
  const contracts = [
    buttonContract,
    dialogContract,
    toastContract,
    paginationContract,
  ];

  for (const contract of contracts) {
    it(`${contract.intent ?? 'unknown'} has type, intent, safetyLevel, contractVersion`, () => {
      expect(contract.type).toBeTruthy();
      expect(contract.intent).toBeTruthy();
      expect(contract.safetyLevel).toBeTruthy();
      expect(contract.contractVersion).toBeTruthy();
      expect(typeof contract.destructive).toBe('boolean');
      expect(typeof contract.requiresConfirmation).toBe('boolean');
      expect(typeof contract.reversible).toBe('boolean');
    });
  }
});
