import type ISheet from '@shared/interfaces/Sheet';

interface IParams {
  saveMode: 'local';
  localPath: string;
}

const validateSheet = (sheet: unknown): boolean => {
  if (typeof sheet !== 'object' || sheet === null) {
    return false;
  }
  if (!('name' in sheet) || typeof sheet.name !== 'string') {
    return false;
  }
  
  return true;
}

const load = async (params: IParams): Promise<ISheet> => {
  
  if (params.saveMode === 'local') {  
    console.log('Loading from', params.localPath);
    const file = Bun.file(params.localPath);
    const fileExists = await file.exists();
    if (!fileExists) {
      console.log('File not found:', params.localPath);
      throw new Error(`File not found: ${params.localPath}`);
    }
    const sheet = await file.text();
    try {
      JSON.parse(sheet);
    } catch (e) {
      console.log('Failed to parse JSON:', e);
      throw new Error(`Failed to parse JSON: ${e}`);
    }
    const sheetObj = JSON.parse(sheet);
    if (!validateSheet(sheetObj)) {
      console.log('Invalid sheet format:', typeof sheetObj);
      throw new Error(`Invalid sheet format: ${typeof sheetObj}`);
    }
    return sheetObj;
  }
  console.log('Invalid save mode:', params.saveMode);
  throw new Error(`Invalid save mode: ${params.saveMode}`);

};

export { load };
