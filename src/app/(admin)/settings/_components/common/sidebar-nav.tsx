import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type JSX, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useSettingsSession } from "../../_contexts/settings-session-context";

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: {
    href: string;
    title: string;
    icon: JSX.Element;
  }[];
  showUser?: boolean;
};

export function SidebarNav({
  className,
  items,
  showUser = false,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();
  const navigate = useRouter();
  const [val, setVal] = useState(pathname ?? "/settings");
  const { session, isLoading } = useSettingsSession();

  const handleSelect = (e: string) => {
    setVal(e);
    navigate.push(e);
  };

  const UserSection = () => {
    if (!showUser) return null;

    if (isLoading) {
      return (
        <div className="mb-4 pb-4 border-b">
          <div className="flex flex-col items-center gap-2 px-2 py-3">
            <div className="flex items-center justify-center p-4">
              <Spinner className="h-6 w-6" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Cargando información...
            </p>
          </div>
        </div>
      );
    }

    if (!session?.user) {
      return (
        <div className="mb-4 pb-4 border-b">
          <div className="flex flex-col items-center gap-3 px-2 py-3">
            <Avatar className="h-20 w-20 rounded-full shrink-0">
              <AvatarFallback className="rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center min-w-0 w-full space-y-2">
              <p className="text-sm font-semibold text-destructive text-center truncate w-full">
                Sin sesión
              </p>
              <span className="truncate text-xs text-muted-foreground">
                No hay sesión activa
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4 pb-4 border-b">
        <div className="flex flex-col items-center gap-2 px-2 py-3">
          <Avatar className="h-20 w-20 rounded-full shrink-0">
            <AvatarImage
              src={session.user.image || ""}
              alt={session.user.name || ""}
            />
            <AvatarFallback className="rounded-full text-xl font-semibold">
              {session.user.name?.slice(0, 2).toUpperCase() || ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center min-w-0 w-full">
            <p className="text-sm font-medium text-foreground text-center truncate w-full">
              {session.user.name || ""}
            </p>
            <span className="truncate text-xs text-muted-foreground">
              {session.user.lastName || ""}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="p-1 md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className="flex gap-x-4 px-2 py-1">
                  <span className="scale-125">{item.icon}</span>
                  <span className="text-md">{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        type="always"
        className="bg-background hidden w-full min-w-40 px-1 py-2 md:block"
      >
        <UserSection />
        <nav
          className={cn(
            "flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0",
            className,
          )}
          {...props}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href
                  ? "bg-muted hover:bg-accent"
                  : "hover:bg-accent hover:underline",
                "justify-start",
              )}
            >
              <span className="me-2">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  );
}
