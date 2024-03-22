import * as canvasUtils from '~/utils/canvas'

describe('Canvas utils', () => {
  describe('resizeCanvas', () => {
    it('should resize the canvas when given dpr, canvas style size, and sprite size', () => {
     const canvas = {
        width: 100,
        height: 200,
        style: { width: '100px', height: '100px' }
      } as unknown as HTMLCanvasElement
      window.getComputedStyle = vi.fn().mockReturnValue({
        getPropertyValue: vi.fn().mockReturnValue(canvas.style.width)
      })
      window.devicePixelRatio = 2
      canvasUtils.resizeCanvas(canvas, 10, 20) 
  
      expect(canvas.width).toBe(200)
      expect(canvas.height).toBe(400)
      expect(canvas.style.height).toBe('200px')
    })
  })
  describe('translateClickPositionToSpritePosition', () => {
    it('should translate click position to sprite position', () => {
      const canvas = {
        width: 100,
        height: 200,
        style: { width: '50px', height: '100px' },
        getContext: vi.fn().mockReturnValue({}),
        getBoundingClientRect: vi.fn().mockReturnValue({ left: 20, top: 30})
      } as unknown as HTMLCanvasElement
      window.getComputedStyle = vi.fn().mockReturnValue({
        borderLeftWidth: '1px',
        borderTopWidth: '2px',
        paddingLeft: '5px',
        paddingTop: '10px'
      })
      const event = {
        clientX: 30,
        clientY: 60
      } as unknown as MouseEvent

      const spriteWidth = 200
      const spriteHeight = 400
      window.devicePixelRatio = 2

      const { x, y } = canvasUtils.translateClickPositionToSpritePosition(canvas, event, spriteWidth, spriteHeight)
      expect(x).toBe(16)
      expect(y).toBe(72)
    })
  })

  describe('drawPixel', () => {
    it('draws pixel correctly', () => {
      const ctx = {
        fillStyle: '',
        fillRect: vi.fn(),
      } as unknown as CanvasRenderingContext2D;
      canvasUtils.drawPixel(ctx, 1, 2, 10, 20, 'red');
      expect(ctx.fillStyle).toBe('red');
      expect(ctx.fillRect).toHaveBeenCalledWith(10, 40, 10, 20);
    });
  });
  describe('registerCallbackCanvasPointerDownOrMove', () => {
    let canvas: HTMLCanvasElement;
    let callback: (event: MouseEvent) => void;
    beforeEach(() => {
      canvas = {
        onpointerdown: null,
        onpointermove: null,
        onpointerup: null,
        onpointerleave: null,
        onpointerenter: null,
      } as unknown as HTMLCanvasElement;
      callback = vi.fn();
      canvasUtils.registerCallbackCanvasPointerDownOrMove(canvas, callback);
    });
    it('should call callback on pointer down', () => {
      canvas.onpointerdown?.({ type: 'pointerdown' } as PointerEvent);
      expect(callback).toHaveBeenCalled();
    })
    it('should call callback on pointer move after pointer down', () => {
      canvas.onpointerdown?.({ type: 'pointerdown' } as PointerEvent);
      canvas.onpointermove?.({ type: 'pointermove' } as PointerEvent);

      expect(callback).toHaveBeenCalledTimes(2);
    })
    it('should not call callback on pointer move after pointer up', () => {
      canvas.onpointerdown?.({type: 'pointerdown'} as PointerEvent);
      canvas.onpointerup?.({type: 'pointerup'} as PointerEvent);
      canvas.onpointermove?.({type: 'pointermove'} as PointerEvent);
      expect(callback).toHaveBeenCalledTimes(1);
    })
    it('should call callback on pointer move after pointer leave', () => {
      canvas.onpointerdown?.({type: 'pointerdown'} as PointerEvent);
      canvas.onpointerleave?.({type: 'pointerleave'} as PointerEvent);
      canvas.onpointermove?.({type: 'pointermove'} as PointerEvent);
      expect(callback).toHaveBeenCalledTimes(2);
    })
    it('should not call callback on pointer move after pointer up in leaving state', () => {
      canvas.onpointerdown?.({type: 'pointerdown'} as PointerEvent);
      canvas.onpointerleave?.({type: 'pointerleave'} as PointerEvent);
      canvas.onpointerup?.({type: 'pointerup'} as PointerEvent);
      canvas.onpointermove?.({type: 'pointermove'} as PointerEvent);
      expect(callback).toHaveBeenCalledTimes(1);
    })
  })
})
