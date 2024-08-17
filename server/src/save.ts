import type ISheet from '@shared/interfaces/Sheet';

interface IParams {
  sheet: ISheet
  saveMode?: 'local';
  saveOptions?: {
    localPath?: string;
  }
}

const save = async (params: IParams): Promise<string | Error> => {
  if (params.saveMode === 'local') {
    const localPath = params.saveOptions?.localPath;
    console.log('Saving locally to', localPath);
    if (!localPath) {
      console.log('Missing Path to save.');
      throw new Error('Missing Path to save.');
    }
    await Bun.write(localPath, JSON.stringify(params.sheet));
    return 'Saved locally.';
  }
  return 'No save type specified.';
};

export { save };
