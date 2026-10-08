import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STAGE_W = 1024;
const STAGE_H = 599;
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const WHEEL_STEP = 1.1;
const DOUBLE_TAP_MS = 320;

export default function useStageViewport(frameRef) {
  const [vp, setVp] = useState(() => ({
    baseScale: Math.min(
      window.innerWidth / STAGE_W,
      window.innerHeight / STAGE_H,
    ),
    zoom: 1,
    panX: 0,
    panY: 0,
  }));
  const vpRef = useRef(vp);

  const commit = useCallback(
    (next) => {
      const frame = frameRef.current;
      const cw = frame ? frame.clientWidth : window.innerWidth;
      const ch = frame ? frame.clientHeight : window.innerHeight;
      const s = next.baseScale * next.zoom;
      const maxX = Math.max(0, (STAGE_W * s - cw) / 2);
      const maxY = Math.max(0, (STAGE_H * s - ch) / 2);
      const clamped = {
        ...next,
        panX: Math.min(maxX, Math.max(-maxX, next.panX)),
        panY: Math.min(maxY, Math.max(-maxY, next.panY)),
      };
      vpRef.current = clamped;
      setVp(clamped);
    },
    [frameRef],
  );

  const fitStage = useCallback(() => {
    const frame = frameRef.current;
    const cw = frame ? frame.clientWidth : window.innerWidth;
    const ch = frame ? frame.clientHeight : window.innerHeight;
    commit({
      ...vpRef.current,
      baseScale: Math.min(cw / STAGE_W, ch / STAGE_H),
    });
  }, [frameRef, commit]);

  const resetView = useCallback(() => {
    commit({ ...vpRef.current, zoom: 1, panX: 0, panY: 0 });
  }, [commit]);

  const zoomAt = useCallback(
    (frameX, frameY, nextZoom) => {
      const v = vpRef.current;
      const frame = frameRef.current;
      const cw = frame ? frame.clientWidth : window.innerWidth;
      const ch = frame ? frame.clientHeight : window.innerHeight;
      const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
      const s = v.baseScale * v.zoom;
      const nextS = v.baseScale * zoom;
      const uX = frameX - cw / 2;
      const uY = frameY - ch / 2;
      commit({
        ...v,
        zoom,
        panX: uX - (nextS / s) * (uX - v.panX),
        panY: uY - (nextS / s) * (uY - v.panY),
      });
    },
    [frameRef, commit],
  );

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const pointers = new Map();
    let gesture = null;
    let lastTapTime = 0;

    const gestureState = () => {
      const pts = Array.from(pointers.values());
      if (pts.length === 0) return null;
      const mid = { x: 0, y: 0 };
      for (const p of pts) {
        mid.x += p.x;
        mid.y += p.y;
      }
      mid.x /= pts.length;
      mid.y /= pts.length;
      let dist = 0;
      if (pts.length >= 2) {
        const dx = pts[1].x - pts[0].x;
        const dy = pts[1].y - pts[0].y;
        dist = Math.sqrt(dx * dx + dy * dy);
      }
      return { count: pts.length, mid, dist };
    };

    const applyGesture = (prev, next) => {
      const v = vpRef.current;
      const s = v.baseScale * v.zoom;
      if (prev.count >= 2 && next.count >= 2 && prev.dist > 0) {
        const zoom = Math.min(
          MAX_ZOOM,
          Math.max(MIN_ZOOM, v.zoom * (next.dist / prev.dist)),
        );
        const nextS = v.baseScale * zoom;
        const cx = frame.clientWidth / 2;
        const cy = frame.clientHeight / 2;
        const u0x = prev.mid.x - cx;
        const u0y = prev.mid.y - cy;
        const u1x = next.mid.x - cx;
        const u1y = next.mid.y - cy;
        commit({
          ...v,
          zoom,
          panX: u1x - (nextS / s) * (u0x - v.panX),
          panY: u1y - (nextS / s) * (u0y - v.panY),
        });
      } else if (prev.count >= 1 && next.count >= 1) {
        commit({
          ...v,
          panX: v.panX + next.mid.x - prev.mid.x,
          panY: v.panY + next.mid.y - prev.mid.y,
        });
      }
    };

    const onPointerDown = (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      gesture = null;
      try {
        frame.setPointerCapture(e.pointerId);
      } catch (err) {}
    };

    const onPointerMove = (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const next = gestureState();
      if (gesture && gesture.count === next.count) {
        applyGesture(gesture, next);
      }
      gesture = next;
    };

    const releasePointer = (e) => {
      pointers.delete(e.pointerId);
      gesture = null;
      if (pointers.size === 0) {
        const now = Date.now();
        if (now - lastTapTime < DOUBLE_TAP_MS) {
          resetView();
          lastTapTime = 0;
        } else {
          lastTapTime = now;
        }
      }
    };

    const onContextMenu = (e) => {
      e.preventDefault();
    };

    const onWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? WHEEL_STEP : 1 / WHEEL_STEP;
      zoomAt(e.clientX, e.clientY, vpRef.current.zoom * factor);
    };

    frame.addEventListener("pointerdown", onPointerDown);
    frame.addEventListener("pointermove", onPointerMove);
    frame.addEventListener("pointerup", releasePointer);
    frame.addEventListener("pointercancel", releasePointer);
    frame.addEventListener("contextmenu", onContextMenu);
    frame.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", fitStage);
    window.addEventListener("orientationchange", fitStage);
    fitStage();

    return () => {
      frame.removeEventListener("pointerdown", onPointerDown);
      frame.removeEventListener("pointermove", onPointerMove);
      frame.removeEventListener("pointerup", releasePointer);
      frame.removeEventListener("pointercancel", releasePointer);
      frame.removeEventListener("contextmenu", onContextMenu);
      frame.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", fitStage);
      window.removeEventListener("orientationchange", fitStage);
    };
  }, [frameRef, fitStage, resetView, zoomAt, commit]);

  const transform = useMemo(() => {
    const frame = frameRef.current;
    const cw = frame ? frame.clientWidth : window.innerWidth;
    const ch = frame ? frame.clientHeight : window.innerHeight;
    const s = vp.baseScale * vp.zoom;
    const tx = (cw - STAGE_W * s) / 2 + vp.panX;
    const ty = (ch - STAGE_H * s) / 2 + vp.panY;
    return "translate(" + tx + "px, " + ty + "px) scale(" + s + ")";
  }, [vp, frameRef]);

  return { vp, transform, fitStage, resetView, zoomAt };
}
