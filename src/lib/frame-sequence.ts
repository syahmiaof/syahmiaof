type Frame = { source: ImageBitmap | HTMLImageElement; width: number; height: number; bytes: number };
const DECODED_BUDGET = 128 * 1024 * 1024;
const MAX_DECODED = 16;

/** Keeps compressed originals warm while decoding only the frames near the playhead. */
export function createFrameSequence(canvas: HTMLCanvasElement, count: number, urlFor: (frame: number) => string) {
  const context = canvas.getContext('2d');
  if (!context) return null;
  const blobs = new Map<number, Blob>();
  const frames = new Map<number, Frame>();
  const requests = new Map<number, AbortController>();
  const decoding = new Set<number>();
  const failed = new Set<number>();
  let target = 1;
  let direction = 1;
  let active = false;
  let disposed = false;
  let paint = 0;
  let displayed = 0;
  let width = 1;
  let height = 1;
  let dirty = true;
  let decodedBytes = 0;
  let wanted: number[] = [];

  const release = (frame: Frame) => {
    if ('close' in frame.source) frame.source.close();
    else frame.source.removeAttribute('src');
  };
  const priorities = () => {
    wanted = [target];
    for (let offset = 1; offset <= 12; offset++) {
      const ahead = target + offset * direction;
      if (ahead >= 1 && ahead <= count) wanted.push(ahead);
      const behind = target - offset * direction;
      if (offset <= 1 && behind >= 1 && behind <= count) wanted.push(behind);
    }
  };
  priorities();

  const draw = () => {
    paint = 0;
    if (disposed || !active || document.hidden) return;
    let index = 0;
    let nearest = Infinity;
    for (const key of frames.keys()) {
      const distance = Math.abs(key - target);
      if (distance < nearest) { index = key; nearest = distance; }
    }
    // A late neighbour must not pull the sequence backwards during a forward scroll.
    if (displayed && frames.has(displayed) && ((target >= displayed && index < displayed) || (target <= displayed && index > displayed))) index = displayed;
    const frame = frames.get(index);
    if (!frame || (!dirty && index === displayed)) return;
    const scale = Math.min(width / frame.width, height / frame.height) * .9;
    const drawWidth = frame.width * scale;
    const drawHeight = frame.height * scale;
    context.clearRect(0, 0, width, height);
    context.drawImage(frame.source, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    dirty = false;
    displayed = index;
    canvas.dataset.frame = String(index);
    canvas.style.opacity = '1';
  };
  const requestDraw = () => { if (!paint && active && !disposed && !document.hidden) paint = requestAnimationFrame(draw); };
  const trim = () => {
    const evict = [...frames.keys()].filter(index => index !== displayed && index !== target)
      .sort((a, b) => Math.abs(b - target) - Math.abs(a - target));
    while ((decodedBytes > DECODED_BUDGET || frames.size > MAX_DECODED) && evict.length) {
      const index = evict.shift()!;
      const frame = frames.get(index)!;
      decodedBytes -= frame.bytes;
      release(frame);
      frames.delete(index);
    }
    canvas.dataset.decodedFrames = String(frames.size);
    canvas.dataset.decodedBytes = String(decodedBytes);
  };
  const decode = async (blob: Blob): Promise<Frame> => {
    if (typeof createImageBitmap === 'function') {
      try {
        const source = await createImageBitmap(blob);
        return { source, width: source.width, height: source.height, bytes: source.width * source.height * 4 };
      } catch { /* Older engines can still decode the original JPEG with an image element. */ }
    }
    const url = URL.createObjectURL(blob);
    try {
      const source = new Image();
      source.decoding = 'async';
      source.src = url;
      await source.decode();
      return { source, width: source.naturalWidth, height: source.naturalHeight, bytes: source.naturalWidth * source.naturalHeight * 4 };
    } finally { URL.revokeObjectURL(url); }
  };
  const pumpDecode = () => {
    if (disposed || !active || document.hidden) return;
    for (const index of wanted) {
      if (decoding.size >= 4) break;
      const blob = blobs.get(index);
      if (!blob || frames.has(index) || decoding.has(index) || failed.has(index)) continue;
      decoding.add(index);
      void decode(blob).then(frame => {
        if (disposed || Math.abs(index - target) > 32) { release(frame); return; }
        frames.set(index, frame);
        decodedBytes += frame.bytes;
        trim();
        requestDraw();
      }).catch(() => { if (!disposed) failed.add(index); }).finally(() => {
        decoding.delete(index);
        pumpDecode();
      });
    }
  };
  const pumpFetch = () => {
    if (disposed || !active || document.hidden) return;
    // Only ~7MB compressed in this sequence, instead of retaining ~1.6GB decoded.
    const queue = [...wanted];
    for (let index = 1; index <= count; index++) queue.push(index);
    for (const index of queue) {
      if (requests.size >= 4) break;
      if (blobs.has(index) || requests.has(index) || failed.has(index)) continue;
      const controller = new AbortController();
      requests.set(index, controller);
      void fetch(urlFor(index), { signal: controller.signal, cache: 'force-cache' })
        .then(response => { if (!response.ok) throw new Error(`Frame ${index}: ${response.status}`); return response.blob(); })
        .then(blob => { if (!disposed) { blobs.set(index, blob); pumpDecode(); } })
        .catch(() => { if (!disposed && !controller.signal.aborted) failed.add(index); })
        .finally(() => { requests.delete(index); pumpFetch(); });
    }
  };
  const resume = () => { pumpDecode(); pumpFetch(); requestDraw(); };
  const visibility = () => {
    if (document.hidden) { cancelAnimationFrame(paint); paint = 0; }
    else if (active) resume();
  };
  document.addEventListener('visibilitychange', visibility);
  return {
    setFrame(value: number) {
      const next = Math.max(1, Math.min(count, Math.round(value)));
      if (next === target) return;
      direction = next > target ? 1 : -1;
      target = next;
      priorities();
      resume();
    },
    setActive(value: boolean) { active = value; if (active) resume(); else { cancelAnimationFrame(paint); paint = 0; } },
    resize(nextWidth: number, nextHeight: number) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const physicalWidth = Math.round(nextWidth * dpr);
      const physicalHeight = Math.round(nextHeight * dpr);
      // Scroll pinning can move the container by a sub-pixel between layout passes.
      // Ignore a one-pixel raster wobble so the same frame is not repainted for no visual gain.
      if (Math.abs(width - nextWidth) < 1 && Math.abs(height - nextHeight) < 1
        && Math.abs(canvas.width - physicalWidth) <= 1 && Math.abs(canvas.height - physicalHeight) <= 1) return;
      width = nextWidth; height = nextHeight;
      canvas.width = physicalWidth; canvas.height = physicalHeight;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
      requestDraw();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(paint);
      document.removeEventListener('visibilitychange', visibility);
      requests.forEach(controller => controller.abort());
      frames.forEach(release);
      requests.clear(); frames.clear(); blobs.clear();
    },
  };
}
