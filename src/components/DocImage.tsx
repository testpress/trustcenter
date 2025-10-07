// app/components/DocImage.tsx
export function DocImage({ title, src, width, height, style }: any) {
  return <img src={src} alt={title} width={width} height={height} className={style} />
}
