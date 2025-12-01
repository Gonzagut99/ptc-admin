export default function LogoSmall({
  width = 64,
  height = 64,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img src="/ptc-logo-small.png" alt="PTC Logo" width={width} height={height} {...props} />
  );
}
