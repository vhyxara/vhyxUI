import { describe, it, expect } from 'vitest';
import {
  buttonContract,
  inputContract,
  textareaContract,
  selectContract,
  checkboxContract,
  radioContract,
  switchContract,
  formContract,
  toastContract,
  alertContract,
  badgeContract,
  progressContract,
  spinnerContract,
  dialogContract,
  drawerContract,
  tooltipContract,
  popoverContract,
  cardContract,
  separatorContract,
  tabsContract,
  breadcrumbContract,
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

  it('has a fingerprint set by defineContractTemplate()', () => {
    expect(buttonContract.fingerprint).toBeDefined();
    expect(typeof buttonContract.fingerprint).toBe('string');
    expect(buttonContract.fingerprint).not.toBe('');
  });

  it('has no id field — id injected at render time', () => {
    expect('id' in buttonContract).toBe(false);
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

  it('has a fingerprint set by defineContractTemplate()', () => {
    expect(dialogContract.fingerprint).toBeDefined();
    expect(typeof dialogContract.fingerprint).toBe('string');
    expect(dialogContract.fingerprint).not.toBe('');
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

  it('has a fingerprint set by defineContractTemplate()', () => {
    expect(toastContract.fingerprint).toBeDefined();
    expect(typeof toastContract.fingerprint).toBe('string');
    expect(toastContract.fingerprint).not.toBe('');
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

  it('has a fingerprint set by defineContractTemplate()', () => {
    expect(paginationContract.fingerprint).toBeDefined();
    expect(typeof paginationContract.fingerprint).toBe('string');
    expect(paginationContract.fingerprint).not.toBe('');
  });
});

describe('all 22 exported contract templates have required base fields, fingerprint, and no id', () => {
  const contracts = [
    buttonContract,
    inputContract,
    textareaContract,
    selectContract,
    checkboxContract,
    radioContract,
    switchContract,
    formContract,
    toastContract,
    alertContract,
    badgeContract,
    progressContract,
    spinnerContract,
    dialogContract,
    drawerContract,
    tooltipContract,
    popoverContract,
    cardContract,
    separatorContract,
    tabsContract,
    breadcrumbContract,
    paginationContract,
  ];

  for (const contract of contracts) {
    it(`${contract.intent} has type, intent, safetyLevel, contractVersion`, () => {
      expect(contract.type).toBeTruthy();
      expect(contract.intent).toBeTruthy();
      expect(contract.safetyLevel).toBeTruthy();
      expect(contract.contractVersion).toBeTruthy();
      expect(typeof contract.destructive).toBe('boolean');
      expect(typeof contract.requiresConfirmation).toBe('boolean');
      expect(typeof contract.reversible).toBe('boolean');
    });

    it(`${contract.intent} has a fingerprint from defineContractTemplate()`, () => {
      expect(contract.fingerprint).toBeDefined();
      expect(typeof contract.fingerprint).toBe('string');
      expect(contract.fingerprint).not.toBe('');
    });

    it(`${contract.intent} has no id field — templates are id-free`, () => {
      expect('id' in contract).toBe(false);
    });
  }
});
