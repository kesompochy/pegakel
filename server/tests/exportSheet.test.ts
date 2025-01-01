import { exportSheet } from '~/exportSheet';
import type { IParams } from '~/exportSheet';
import { existsSync } from 'node:fs';
import path  from 'path';
import { mkdir, rm } from 'node:fs/promises';
import type ISheet from '@shared/interfaces/Sheet';

describe('exportGroup', () => {
  const testDir = 'tmp_for_export_test';
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
  it('should export a group of sprites as a gif file', async () => {
    const sheet: ISheet = {
      sprites: [
        {
          width: 16,
          height: 16,
          pixels: new Array(16).fill(new Array(16).fill(0)),
          clipX: 0,
          clipY: 0,
        },
      ],
      groups: [
        {
          sprites: [0],
          clipSize: {
            width: 16,
            height: 16,
          },
        },
      ],
      palette: [
        { r: 100, g: 0, b: 255, a: 1 },
      ],
    } as unknown as ISheet;
    const fileName = 'export_sheet_test';
    const params = { 
      sheet,
      localPath: path.resolve(__dirname, testDir, fileName),
    } as IParams;
    const result = await exportSheet(params);
    expect(result).toBe('Exported as png and json.');
    expect(existsSync(path.resolve(__dirname, testDir, `${fileName}.exported.json`))).toBe(true);
    expect(existsSync(path.resolve(__dirname, testDir, `${fileName}.png`))).toBe(true);
  });
});
