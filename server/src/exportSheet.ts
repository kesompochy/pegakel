import type ISheet from '@shared/interfaces/Sheet';
import { BuPNG } from '../node_modules/bupng/bupng';
import { packSprites } from './utils/pack';
import type IColorState from '@shared/interfaces/ColorState';

export interface IParams {
  sheet: ISheet;
  localPath: string;
}

interface IExportedData {
  sprites: {
    [key: number]: {
      position: {
        x: number;
        y: number;
      };
      clip: {
        x: number;
        y: number;
      };
    }
  };
  groups: {
    [key: string]: {
      sprites: number[];
      clip: {
        width: number;
        height: number;
      };
    }
  };
}


const exportSheet = async (params: IParams): Promise<string | Error> => {
  console.log('Exporting sheet...');

  const { sheet, localPath } = params;
  
  try {
    const spritesToPack = sheet.sprites.map((sprite, index) => ({
      index,
      width: sprite.width,
      height: sprite.height
    }));

    const packingResult = packSprites(spritesToPack);

    const exportedData: IExportedData = {
      sprites: {},
      groups: {},
    };

    packingResult.packedSprites.forEach(packedSprite => {
      const originalSprite = sheet.sprites[packedSprite.index];
      exportedData.sprites[packedSprite.index] = {
        position: {
          x: packedSprite.x,
          y: packedSprite.y,
        },
        clip: {
          x: originalSprite.clipX,
          y: originalSprite.clipY,
        },
      };
    });

    sheet.groups.forEach(group => {
      exportedData.groups[group.name] = {
        sprites: group.sprites,
        clip: {
          width: group.clipSize.width,
          height: group.clipSize.height,
        },
      };
    });
    await Bun.write(`${localPath}.exported.json`, JSON.stringify(exportedData));

    const bp = new BuPNG(packingResult.sheetWidth, packingResult.sheetHeight);

    packingResult.packedSprites.forEach(packedSprite => {
      const originalSprite = sheet.sprites[packedSprite.index];
      
      for (let y = 0; y < packedSprite.height; y++) {
        for (let x = 0; x < packedSprite.width; x++) {
          const pixelColor: IColorState = originalSprite.pixels[y][x];
          bp.plotPixel(
            packedSprite.x + x, 
            packedSprite.y + y, 
            pixelColor.r,
            pixelColor.g,
            pixelColor.b,
            0,
          );
          if (pixelColor.a === 0) {
          } else {
            bp.plotPixel(
              packedSprite.x + x, 
              packedSprite.y + y, 
              pixelColor.r,
              pixelColor.g,
              pixelColor.b,
              pixelColor.a * 255,
            );
          }
        }
      }
    });

    bp.saveFile(`${localPath}.png`);
    console.log('Exported as png and json.');
    return "Exported as png and json.";
  } catch (e) {
    console.error(`Failed to export: ${e}`);
    throw new Error(`Failed to export: ${e}`);
  }
}

export { exportSheet };
