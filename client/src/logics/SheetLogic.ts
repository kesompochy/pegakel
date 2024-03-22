import Sheet from '~/core/Sheet';

export default {
  createSheet(name: string) {
    return new Sheet(name);
  }
}
