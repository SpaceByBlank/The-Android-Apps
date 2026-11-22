import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, LayoutGrid, Package, Plus, Star } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAppDialogs } from "@/components/vault/app-dialogs";
import { AppDirectory } from "@/components/vault/app-directory";
import { AppGrid, AppGridSkeleton } from "@/components/vault/app-grid";
import { SearchBar } from "@/components/vault/search-bar";
import { ALL_CATEGORIES } from "@/lib/apps/filter";
import { useVault } from "@/lib/apps/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AppVault – Your Apps. One Vault." },
      {
        name: "description",
        content: "Discover, organize and manage your favorite Android applications in one place.",
      },
      { property: "og:title", content: "AppVault – Your Apps. One Vault." },
      {
        property: "og:description",
        content: "Discover, organize and manage your favorite Android applications in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { apps, categories, ready } = useVault();
  const { openCreate } = useAppDialogs();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);

  const featured = apps.filter((a) => a.featured);
  const usedCategories = new Set(apps.map((a) => a.category).filter(Boolean)).size;
  const browsing = query.trim() === "" && category === ALL_CATEGORIES;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="bg-hero-halo absolute inset-0" />
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-16 text-center sm:px-6 sm:pb-20 sm:pt-24">
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />
            Android app directory
          </span>
          <h1 className="animate-rise mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl [animation-delay:60ms]">
            Your Apps. <span className="text-primary">One Vault.</span>
          </h1>
          <p className="animate-rise mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg [animation-delay:120ms]">
            Discover, organize and manage your favorite Android applications.
          </p>

          <div className="animate-rise mx-auto mt-8 max-w-xl [animation-delay:180ms]">
            <SearchBar
              size="lg"
              value={query}
              onChange={(v) => {
                setQuery(v);
                if (v && typeof document !== "undefined") {
                  document.getElementById("all-apps")?.scrollIntoView({ block: "nearest" });
                }
              }}
            />
          </div>

          <div className="animate-rise mt-6 flex flex-wrap items-center justify-center gap-3 [animation-delay:240ms]">
            <Button variant="success" size="lg" onClick={openCreate}>
              <Plus /> Add Application
            </Button>
            <Button asChild variant="subtle" size="lg">
              <Link to="/explore" search={{}}>
                Explore all <ArrowRight />
              </Link>
            </Button>
          </div>

          <dl className="animate-rise mx-auto mt-10 grid max-w-md grid-cols-3 divide-x divide-border rounded-xl border border-border bg-card/80 [animation-delay:300ms]">
            <Stat icon={Package} label="Applications" value={apps.length} />
            <Stat icon={LayoutGrid} label="Categories" value={categories.length} hint={`${usedCategories} in use`} />
            <Stat icon={Star} label="Featured" value={featured.length} />
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 sm:py-16">
        {browsing && (featured.length > 0 || !ready) && (
          <section aria-labelledby="featured-heading">
            <SectionHeading id="featured-heading" title="Featured applications" subtitle="Hand-picked from your vault." />
            {ready ? <AppGrid apps={featured} empty={null} /> : <AppGridSkeleton />}
          </section>
        )}

        <section id="all-apps" aria-labelledby="all-heading" className="scroll-mt-24">
          <SectionHeading id="all-heading" title="All applications" subtitle="Search, filter and manage everything in your library." />
          <AppDirectory
            query={query}
            category={category}
            onQueryChange={setQuery}
            onCategoryChange={setCategory}
          />
        </section>
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Package;
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="px-3 py-4" title={hint}>
      <dt className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

function SectionHeading({ id, title, subtitle }: { id: string; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 id={id} className="text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
