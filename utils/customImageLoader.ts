// utils/imageLoader.ts
export const customImageLoader = ({ src, width, quality }) => {
  // You can modify the src URL here if needed
  return `${src}?w=${width}&q=${quality || 75}`
}
