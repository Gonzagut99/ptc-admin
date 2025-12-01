export default function LogoSmallLetters({
  width = 157,
  height = 64,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img src="/ptc-logo.png" alt="PTC Logo" width={width} height={height} {...props} />
  );
}
