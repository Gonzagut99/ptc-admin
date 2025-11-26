import { cn } from "@/lib/utils";

interface HeadingProps {
  title: string;
  description?: string;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div>
      <h2
        className={cn(
          "text-[18.5px] font-medium tracking-tight first-letter:capitalize",
          className,
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  );
};
