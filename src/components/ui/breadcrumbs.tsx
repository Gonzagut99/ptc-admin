"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  const router = useRouter();
  if (items.length === 0) return null;

  const hasMultipleRoutes = items.length > 1;
  const currentPageTitle = items[items.length - 1]?.title;

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="flex items-center gap-2">
        {/* Botón de retroceso en el medio */}
        {hasMultipleRoutes && (
          <Button
            variant="icon"
            size="icon"
            className="h-auto p-1.5 w-fit -ml-1.5"
            onClick={() => router.back()}
          >
            <ChevronLeft className="size-6" />
            <span className="sr-only">Volver atrás</span>
          </Button>
        )}

        <div>
          {/* Título principal grande */}
          <h1 className="text-[23px] font-bold text-foreground truncate">
            {currentPageTitle}
          </h1>

          {/* Breadcrumb debajo */}
          {hasMultipleRoutes && (
            <Breadcrumb>
              <BreadcrumbList>
                {items.map((item, index) => (
                  <Fragment key={`${item.title}-${index}`}>
                    {index !== items.length - 1 && (
                      <BreadcrumbItem>
                        {item.url ? (
                          <BreadcrumbLink asChild>
                            <Link
                              href={item.url}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {item.title}
                            </Link>
                          </BreadcrumbLink>
                        ) : (
                          <span className="text-muted-foreground">
                            {item.title}
                          </span>
                        )}
                      </BreadcrumbItem>
                    )}
                    {index < items.length - 1 && (
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                    )}
                    {index === items.length - 1 && (
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-muted-foreground">
                          {item.title}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
      </div>
    </div>
  );
}
