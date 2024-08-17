import { save } from '~/save';
import type ISheet from '@shared/interfaces/Sheet';
import { mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path  from 'path';

describe('save', () => {
  describe('local', () => {
    const testDir = 'tmp_for_test';
    beforeAll(async () => {
      const exists = existsSync(path.resolve(__dirname, testDir));
      if (exists) {
        await rm(path.resolve(__dirname, testDir), { recursive: true });
      }
      await mkdir(path.resolve(__dirname, testDir));
    });
    afterAll(async () => {
      await rm(path.resolve(__dirname, testDir), { recursive: true });
    });
    it('should return a error if localPath is not specified', async () => {
      const sheet: ISheet = {
        name: 'test',
        sprites: [],
        groups: [],
      };
      let err;
      try {
        await save({
          sheet: sheet,
          saveMode: 'local',
        });
      } catch (e) {
        err = e;
      }
      expect(err instanceof Error).toBe(true);
    });
    it('should save the sheet to the local path', async () => {
      const sheet: ISheet = {
        name: 'test',
        sprites: [],
        groups: [],
      };
      const localPath = 'test.json';
      await save({
        sheet: sheet,
        saveMode: 'local',
        saveOptions: {
          localPath: path.resolve(__dirname, testDir, localPath)
        },
      });
      const file = Bun.file(localPath);
      expect(file).toBeDefined();
    });
  });
});
