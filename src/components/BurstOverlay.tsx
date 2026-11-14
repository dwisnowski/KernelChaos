import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { createBurstScene, type BurstScene } from "../fx/burstScene.ts";

export interface BurstOverlayHandle {
  explode(x: number, y: number, color: string): void;
}

interface Props {
  className?: string;
}

export const BurstOverlay = forwardRef<BurstOverlayHandle, Props>(function BurstOverlay(
  { className },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<BurstScene | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const scene = createBurstScene(canvas);
    sceneRef.current = scene;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      scene.resize(width, height);
    });
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    explode(x, y, color) {
      sceneRef.current?.explode(x, y, { color, count: 20, power: 4.2 });
    },
  }));

  return (
    <div ref={wrapRef} className={className ?? "burst-overlay"} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
});
