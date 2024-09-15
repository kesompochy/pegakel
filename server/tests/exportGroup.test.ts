import { exportGroup } from '~/exportGroup';
import type ISprite from '@shared/interfaces/Sprite';
import type { IParams } from '~/exportGroup';
import { existsSync } from 'node:fs';
import path  from 'path';
import { mkdir, rm } from 'node:fs/promises';

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
    //await rm(path.resolve(__dirname, testDir), { recursive: true });
  });
  it('should export a group of sprites as a gif file', async () => {
    const sprites: ISprite[] = [
      {
        width: 1,
        height: 1,
        pixels: [
          [{ r: 100, g: 0, b: 255, a: 1 }]
        ]
      },
    ]
    const format = 'gif';
    const fineName = 'test.gif';
    const options = {
      gif: {
        repeat: true,
        quality: 10,
        delay: 100
      }
    };
    const params = { 
      format,
      localPath: path.resolve(__dirname, testDir, fineName),
      sprites,
      options
    } as IParams;
    const result = await exportGroup(params);
    expect(result).toBe('Exported as gif.');
    expect(existsSync(path.resolve(__dirname, testDir, fineName))).toBe(true);
  });
});
