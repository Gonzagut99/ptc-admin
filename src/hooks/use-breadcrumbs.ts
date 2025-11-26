import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { sidebarData } from "@/components/layout/sidebar/data/sidebar-data";
import {
  BreadcrumbOverride,
  useBreadcrumbStore,
} from "@/contexts/stores/breadcrumb-store";

type BreadcrumbItemType = {
  title: string;
  url?: string;
  isCurrent?: boolean;
};

type UseBreadcrumbsOptions = {
  isDynamic?: (segment: string, index: number, fullPath: string) => boolean;
  dynamicLabel?:
    | string
    | ((segment: string, index: number, fullPath: string) => string);
  homeLabel?: string;
};

type SidebarItem = {
  title: string;
  url?: string;
  items?: SidebarItem[];
};

type NavGroup = {
  title: string;
  items: SidebarItem[];
};

function buildIndexes(navGroups: NavGroup[]) {
  const exactPathToTitle = new Map<string, string>();

  const walk = (items: SidebarItem[]) => {
    for (const it of items) {
      if (it.url) exactPathToTitle.set(it.url, it.title);
      if (it.items) walk(it.items);
    }
  };

  for (const group of navGroups) walk(group.items);

  return { exactPathToTitle };
}

function formatSegment(segment: string) {
  return segment
    .replace(/^\[|\]$/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function useBreadcrumbs({
  isDynamic,
  dynamicLabel,
  homeLabel = "Dashboard",
}: UseBreadcrumbsOptions = {}): BreadcrumbItemType[] {
  const pathname = usePathname();
  const breadcrumbOverrides = useBreadcrumbStore((state) => state.overrides);

  const { exactPathToTitle } = useMemo(
    () => buildIndexes(sidebarData.navGroups as NavGroup[]),
    [],
  );

  const breadcrumbItems = useMemo(() => {
    if (pathname === "/") {
      return [
        {
          title: homeLabel,
          url: "/",
          isCurrent: true,
        },
      ];
    }

    const pathSegments = pathname.split("/").filter(Boolean);

    const items: BreadcrumbItemType[] = [];

    pathSegments.forEach((segment, index) => {
      const currentPath = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const isLast = index === pathSegments.length - 1;

      const dynamic = isDynamic?.(segment, index, currentPath) ?? false;

      let title: string | undefined;

      if (!dynamic) {
        title = exactPathToTitle.get(currentPath);
      }

      if (!title) {
        if (dynamic && typeof dynamicLabel === "string") {
          title = dynamicLabel;
        } else if (dynamic && typeof dynamicLabel === "function") {
          title = dynamicLabel(segment, index, currentPath);
        } else {
          title = formatSegment(segment);
        }
      }

      items.push({
        title,
        url: isLast ? undefined : currentPath,
        isCurrent: isLast,
      });
    });

    return items;
  }, [pathname, exactPathToTitle, isDynamic, dynamicLabel, homeLabel]);

  const finalBreadcrumbItems = useMemo(() => {
    const matchingOverride = breadcrumbOverrides.find((override) =>
      matchesPattern(pathname, override.pattern),
    );

    if (matchingOverride) {
      return applyBreadcrumbOverride(breadcrumbItems, matchingOverride);
    }

    return breadcrumbItems;
  }, [breadcrumbItems, breadcrumbOverrides, pathname]);

  return finalBreadcrumbItems;

  function matchesPattern(path: string, pattern: string): boolean {
    const pathSegments = path.split("/").filter(Boolean);
    const patternSegments = pattern.split("/").filter(Boolean);
    if (pathSegments.length !== patternSegments.length) return false;
    return patternSegments.every((patternSegment, index) => {
      const pathSegment = pathSegments[index];
      if (patternSegment.startsWith("[") && patternSegment.endsWith("]"))
        return true;
      return pathSegment === patternSegment;
    });
  }

  function applyBreadcrumbOverride(
    items: BreadcrumbItemType[],
    override: BreadcrumbOverride,
  ): BreadcrumbItemType[] {
    switch (override.type) {
      case "replace-all":
        return [
          {
            title: override.label,
            url: undefined,
            isCurrent: true,
          },
        ];
      case "replace-segment": {
        if (
          override.segmentIndex === undefined ||
          override.segmentIndex >= items.length
        )
          return items;
        const newItems = [...items];
        newItems[override.segmentIndex] = {
          ...newItems[override.segmentIndex],
          title: override.label,
          ...(override.removeUrl && { url: undefined }),
        };
        return newItems;
      }
      case "replace-from-segment": {
        if (
          override.fromSegmentIndex === undefined ||
          override.fromSegmentIndex >= items.length
        )
          return items;
        const beforeItems = items.slice(0, override.fromSegmentIndex);
        return [
          ...beforeItems,
          {
            title: override.label,
            url: undefined,
            isCurrent: true,
          },
        ];
      }
      default:
        return items;
    }
  }
}
