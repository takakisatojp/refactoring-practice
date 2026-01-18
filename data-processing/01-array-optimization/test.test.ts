import { describe, it, expect } from 'vitest';
import { processUsers, calculateUserStats, groupUsersByAge, countByName, type User } from './good';

const mockUsers: User[] = [
  { id: '1', name: 'Alice', age: 25, active: true },
  { id: '2', name: 'Bob', age: 17, active: true },
  { id: '3', name: 'Charlie', age: 30, active: false },
  { id: '4', name: 'David', age: 28, active: true },
  { id: '5', name: 'Eve', age: 45, active: true },
];

describe('Array Optimization', () => {
  describe('processUsers', () => {
    it('should filter and map users correctly', () => {
      const result = processUsers(mockUsers);

      expect(result).toEqual(['Alice', 'David', 'Eve']);
      expect(result).not.toContain('Bob');
      expect(result).not.toContain('Charlie');
    });

    it('should handle empty array', () => {
      expect(processUsers([])).toEqual([]);
    });

    it('should filter by active status', () => {
      const inactiveUsers = mockUsers.map((u) => ({ ...u, active: false }));
      expect(processUsers(inactiveUsers)).toEqual([]);
    });

    it('should filter by age', () => {
      const youngUsers = mockUsers.map((u) => ({ ...u, age: 15 }));
      expect(processUsers(youngUsers)).toEqual([]);
    });

    it('should filter by name length', () => {
      const result = processUsers([
        { id: '1', name: 'Al', age: 25, active: true },
        { id: '2', name: 'Alice', age: 25, active: true },
      ]);

      expect(result).toEqual(['Alice']);
    });
  });

  describe('calculateUserStats', () => {
    it('should calculate stats correctly', () => {
      const stats = calculateUserStats(mockUsers);

      expect(stats.total).toBe(3); // Alice, David, Eve
      expect(stats.average).toBe((25 + 28 + 45) / 3);
      expect(stats.min).toBe(25);
      expect(stats.max).toBe(45);
    });

    it('should handle empty array', () => {
      const stats = calculateUserStats([]);

      expect(stats.total).toBe(0);
      expect(stats.average).toBe(0);
      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
    });

    it('should filter by active and age', () => {
      const allInactive = mockUsers.map((u) => ({ ...u, active: false }));
      const stats = calculateUserStats(allInactive);

      expect(stats.total).toBe(0);
    });
  });

  describe('groupUsersByAge', () => {
    it('should group users by age', () => {
      const groups = groupUsersByAge(mockUsers);

      expect(groups['under30']).toHaveLength(3); // Alice, Bob, David
      expect(groups['30-60']).toHaveLength(2); // Charlie, Eve
      expect(groups['over60']).toBeUndefined();
    });

    it('should handle empty array', () => {
      expect(groupUsersByAge([])).toEqual({});
    });
  });

  describe('countByName', () => {
    it('should count users by name', () => {
      const counts = countByName(mockUsers);

      expect(counts['Alice']).toBe(1);
      expect(counts['Bob']).toBe(1);
    });

    it('should handle duplicates', () => {
      const users = [
        { id: '1', name: 'Alice', age: 25, active: true },
        { id: '2', name: 'Alice', age: 30, active: true },
      ];

      const counts = countByName(users);

      expect(counts['Alice']).toBe(2);
    });
  });
});
