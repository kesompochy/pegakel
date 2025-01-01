import type ISprite from '@shared/interfaces/Sprite';
import type IColorState from '@shared/interfaces/ColorState';
import { createCanvas } from 'canvas';
import GIFEncoder from 'gifencoder';
import fs from 'fs';

export interface IParams {
  sprites: ISprite[];
  palette: IColorState[];
  format: 'gif' | 'png' | 'json';
  localPath: string;
  options?: {
    gif?: {
      repeat: boolean;
      quality: number;
      delay: number;
    };
  };
}


const exportGroup = async (params: IParams): Promise<string | Error> => {
  console.log('Exporting group of sprites...');
  if (params.sprites.length < 1) {
    throw new Error('Parameter sprites should have at least one sprite.');
  }
  if (params.sprites[0].pixels.length < 1) {
    throw new Error('Sprite should have at least one row.');
  }
  if (params.sprites[0].pixels[0].length < 1) {
    throw new Error('Sprite should have at least one pixel.');
  }
  console.log('Start exporting.');

  const width = params.sprites[0].width;
  const height = params.sprites[0].height;
  if (params.sprites.some(sprite => sprite.width !== width || sprite.height !== height)) {
    throw new Error('Sprites should have the same width and height.');
  }

  if (params.format === 'gif') {
    console.log('Exporting as gif.');
    const canvas = createCanvas(params.sprites[0].width, params.sprites[0].height);
    const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
    if (!ctx) {
      return new Error('Failed to create canvas context.');
    }
    const { repeat, quality, delay } = params.options?.gif || { repeat: false, quality: 10, delay: 100 };
    const encoder = new GIFEncoder(params.sprites[0].width, params.sprites[0].height);
    console.log('Created gif encoder. The gif will be saved at', params.localPath);
    encoder.createReadStream().pipe(fs.createWriteStream(params.localPath));
    encoder.start();
    encoder.setRepeat(repeat ? 0 : -1);
    encoder.setDelay(delay);
    encoder.setQuality(quality);
    console.log('Start adding frames');
    const palette = params.palette
    for (const sprite of params.sprites) {
      ctx.clearRect(0, 0, sprite.width, sprite.height);
      sprite.pixels.forEach((row, y) => {
        row.forEach((pixel, x) => {
          const color = palette[pixel];
          ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${color.a})`;
          ctx.fillRect(x, y, 1, 1);
        });
      });
      encoder.addFrame(ctx);
    }
    encoder.finish();
  }
  console.log('Exported as gif.');
  return 'Exported as gif.';
};

export { exportGroup };
