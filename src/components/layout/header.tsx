import { UserNav } from "@/components/layout/user-nav";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "../ui/breadcrumbs";
import SearchInput from "../ui/search-input";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeSwitch } from "../ui/theme-switch";

export default function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex min-h-16 shrink-0 items-center justify-between gap-2 bg-background/50 backdrop-blur-md transition-[width,height] ease-linear py-2",
        "group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-12 bg-sidebar border-b border-border",
      )}
    >
      <div className="flex items-center gap-1 px-4 flex-1 min-w-0">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator orientation="vertical" className="h-4 shrink-0" />
        <div className="flex-1 min-w-0">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 shrink-0">
        <div className="hidden md:flex">
          <SearchInput />
        </div>
        <ThemeSwitch />
        <UserNav />
      </div>
    </header>
  );
}
