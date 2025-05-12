import { getId, branchOutId, idToString } from './boxSlice';

describe('boxSlice', () => {
  describe('noteId', () => {
    test('parse sectioned id correctly', () => {
      const name = 'P21.S.1a-3 Hello World';
      const id = getId(name);

      if (id) {
        expect(id.domain).toBe('P21');
        expect(id.section).toBe('S');
        expect(id.notePath).toEqual(['1a', '3']);
      } else {
        throw new Error('Failed to parse note id');
      }
    })

    test('parse unsectioned id correctly', () => {
      const name = 'L1a-1b Hello this world';
      const id = getId(name);

      if (id) {
        expect(id.domain).toBe('L');
        expect(id.section).toBeNull();
        expect(id.notePath).toEqual(['1a', '1b']);
      } else {
        throw new Error('Failed to parse note id');
      }
    })

    test('sectioned id to string correctly', () => {
      const id = {
        domain: 'P21',
        section: 'S',
        notePath: ['1a', '3'],
      };

      const name = idToString(id);
      expect(name).toBe('P21.S.1a-3');
    })

    test('unsectioned id to string correctly', () => {
      const id = {
        domain: 'L',
        section: null,
        notePath: ['1a', '1b'],
      };

      const name = idToString(id);
      expect(name).toBe('L1a-1b');
    })

    test('branch out id correctly', () => {
      const name = 'P21.S.1a-3 Hello World';
      const id = getId(name);

      if (id) {
        const newId = branchOutId(id);
        expect(newId.domain).toBe('P21');
        expect(newId.section).toBe('S');
        expect(newId.notePath).toEqual(['1a', '3', '0']);
      } else {
        throw new Error('Failed to parse note id');
      }
    })
  })
})
