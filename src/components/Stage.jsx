export default function Stage({ transform, children }) {
  return (
    <div
      id="stage"
      className="absolute left-0 top-0 h-[599px] w-[1024px] origin-top-left bg-[#101018] font-pixel will-change-transform [image-rendering:pixelated]"
      style={{ transform }}
    >
      {children}
    </div>
  );
}
