import { describe, it, expect } from 'vitest';
import {
  normalizeStateName,
  getFullStateName,
  isValidStateAbbreviation,
  isValidStateName,
  getAllStateAbbreviations,
  getAllStateNames,
} from '../stateUtils';

describe('stateUtils', () => {
  describe('normalizeStateName', () => {
    it('should convert full state name to abbreviation', () => {
      expect(normalizeStateName('California')).toBe('CA');
      expect(normalizeStateName('New York')).toBe('NY');
      expect(normalizeStateName('Texas')).toBe('TX');
    });

    it('should preserve abbreviations', () => {
      expect(normalizeStateName('CA')).toBe('CA');
      expect(normalizeStateName('NY')).toBe('NY');
      expect(normalizeStateName('ca')).toBe('CA'); // Case insensitive
    });

    it('should return original value if not found', () => {
      expect(normalizeStateName('Invalid State')).toBe('Invalid State');
    });
  });

  describe('getFullStateName', () => {
    it('should convert abbreviation to full name', () => {
      expect(getFullStateName('CA')).toBe('California');
      expect(getFullStateName('NY')).toBe('New York');
      expect(getFullStateName('TX')).toBe('Texas');
    });

    it('should handle lowercase abbreviations', () => {
      expect(getFullStateName('ca')).toBe('California');
      expect(getFullStateName('ny')).toBe('New York');
    });

    it('should return original value if not found', () => {
      expect(getFullStateName('ZZ')).toBe('ZZ');
    });
  });

  describe('isValidStateAbbreviation', () => {
    it('should return true for valid abbreviations', () => {
      expect(isValidStateAbbreviation('CA')).toBe(true);
      expect(isValidStateAbbreviation('NY')).toBe(true);
      expect(isValidStateAbbreviation('ca')).toBe(true); // Case insensitive
    });

    it('should return false for invalid abbreviations', () => {
      expect(isValidStateAbbreviation('ZZ')).toBe(false);
      expect(isValidStateAbbreviation('California')).toBe(false);
      expect(isValidStateAbbreviation('')).toBe(false);
    });
  });

  describe('isValidStateName', () => {
    it('should return true for valid state names', () => {
      expect(isValidStateName('California')).toBe(true);
      expect(isValidStateName('New York')).toBe(true);
    });

    it('should return false for invalid state names', () => {
      expect(isValidStateName('CA')).toBe(false);
      expect(isValidStateName('Invalid State')).toBe(false);
      expect(isValidStateName('')).toBe(false);
    });
  });

  describe('getAllStateAbbreviations', () => {
    it('should return array of all state abbreviations', () => {
      const abbrs = getAllStateAbbreviations();
      expect(abbrs).toContain('CA');
      expect(abbrs).toContain('NY');
      expect(abbrs).toContain('TX');
      expect(abbrs.length).toBe(50); // 50 US states
    });
  });

  describe('getAllStateNames', () => {
    it('should return array of all state names', () => {
      const names = getAllStateNames();
      expect(names).toContain('California');
      expect(names).toContain('New York');
      expect(names).toContain('Texas');
      expect(names.length).toBe(50); // 50 US states
    });
  });
});
