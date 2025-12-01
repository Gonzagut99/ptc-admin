export default function Logo({
  width = 332,
  height = 63,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img src="/ptc-logo.png" alt="PTC Logo" width={width} height={height} {...props} />
  );
}
