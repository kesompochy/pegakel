const resizeCanvas = (canvas: HTMLCanvasElement, width: number, height: number) => {
  const dpr = window.devicePixelRatio || 1;
  const styleWidth = parseFloat(window.getComputedStyle(canvas).getPropertyValue("width"));
  const aspectRatio = height / width;
  const styleHeight = styleWidth * aspectRatio;
  canvas.style.height = styleHeight + "px";
  canvas.width = styleWidth * dpr;
  canvas.height = styleHeight * dpr;
};

const translateClickPositionToSpritePosition = (
  canvas: HTMLCanvasElement,
  event: MouseEvent,
  spriteWidth: number,
  spriteHeight: number,
): { x: number | undefined; y: number | undefined } => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { x: undefined, y: undefined };
  const dpr = window.devicePixelRatio || 1;

  const canvasRect = canvas.getBoundingClientRect();
  const canvasStyle = window.getComputedStyle(canvas);
  const borderWidthLeft = parseFloat(canvasStyle.borderLeftWidth);
  const borderWidthTop = parseFloat(canvasStyle.borderTopWidth);

  const paddingLeft = parseFloat(canvasStyle.paddingLeft);
  const paddingTop = parseFloat(canvasStyle.paddingTop);

  const canvasLeft = canvasRect.left + borderWidthLeft + paddingLeft;
  const canvasTop = canvasRect.top + borderWidthTop + paddingTop;
  const pixelSizeWidth = canvas.width / spriteWidth;
  const pixelSizeHeight = canvas.height / spriteHeight;
  const x = Math.floor(((event.clientX - canvasLeft) / pixelSizeWidth) * dpr);
  const y = Math.floor(((event.clientY - canvasTop) / pixelSizeHeight) * dpr);

  return { x, y };
};

const registerCallbackCanvasPointerDownOrMove = (canvas: HTMLCanvasElement, callback: (event: MouseEvent) => void) => {
  canvas.onpointerdown = null;
  canvas.onpointermove = null;
  canvas.onpointerup = null;
  canvas.onpointerleave = null;
  canvas.onpointerenter = null;
  
  canvas.onpointerdown = (e: MouseEvent) => {
    callback(e);
    canvas.onpointermove = (e: MouseEvent) => {
      callback(e);
    };
    canvas.onpointerup = () => {
      canvas.onpointermove = null;
    };
    canvas.onpointerleave = () => {
      document.onpointerup = () => {
        canvas.onpointermove = null;
      };
      canvas.onpointerenter = () => {
        window.onpointerup = null;
        canvas.onpointerleave = null;
      };
    };
  };
};

const drawPixel = (ctx: CanvasRenderingContext2D, x: number, y: number, pixelWidth: number, pixelHeight: number, color: string) => {
  ctx.fillStyle = color;
  const drawX = Math.round(x * pixelWidth);
  const drawY = Math.round(y * pixelHeight);
  const drawWidth = Math.round((x + 1) * pixelWidth) - drawX;
  const drawHeight = Math.round((y + 1) * pixelHeight) - drawY;
  ctx.fillRect(drawX, drawY, drawWidth, drawHeight);
};

export { resizeCanvas, translateClickPositionToSpritePosition, registerCallbackCanvasPointerDownOrMove, drawPixel };
