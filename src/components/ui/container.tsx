import { Heading } from "./heading";

export default function Container({
  children,
  title,
  description,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex w-full mx-auto flex-col space-y-4 pt-1.5">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="flex-1 min-w-0">
          <Heading title={title} description={description} />
        </div>
        {actions && <div className="shrink-0 sm:ml-4">{actions}</div>}
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}
