import Sprite from '~/core/Sprite';

export default {
  createSprite(width: number, height: number) {
    return new Sprite(width, height);
  }
}
