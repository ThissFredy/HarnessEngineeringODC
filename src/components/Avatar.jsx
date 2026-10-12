export default function Avatar({ avatar, className = '', alt = avatar.name }) {
  return (
    <img
      src={avatar.src}
      alt={alt}
      draggable={false}
      className={`block select-none object-contain [image-rendering:pixelated] ${className}`}
    />
  )
}
