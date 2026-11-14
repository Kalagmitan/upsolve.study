import { useEffect, useMemo, useState } from "react"
import {
  ArrowUpRight,
  Code2,
  Maximize2,
  Mic,
  Search,
  ShieldAlert,
  Terminal,
  Trophy,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CLUB_INFO,
  COMPETITION_WINS,
  INTERNSHIPS,
  TRACKS,
  type CompetitionWin,
  type Track,
} from "@/data/club"

type TrackFilter = "All" | Track

const TRACK_ICONS: Record<Track, React.ComponentType<{ className?: string }>> = {
  Hackathons: Code2,
  Pitching: Mic,
  "Competitive Programming": Terminal,
  CTF: ShieldAlert,
}

function placementBadgeClass(tier: CompetitionWin["tier"]) {
  if (tier === "gold") {
    return "border-brand-green-border bg-brand-green-soft text-brand-green"
  }
  if (tier === "podium") {
    return "border-brand-red-border bg-brand-red-soft text-brand-red"
  }
  return "border-border bg-secondary text-secondary-foreground"
}

export function App() {
  const [selectedTrack, setSelectedTrack] = useState<TrackFilter>("All")
  const [query, setQuery] = useState("")
  const [activeImageByWin, setActiveImageByWin] = useState<
    Record<string, number>
  >({})
  const [lightboxImage, setLightboxImage] = useState<{
    src: string
    label: string
    competition: string
  } | null>(null)

  useEffect(() => {
    if (!lightboxImage) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLightboxImage(null)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [lightboxImage])

  const filteredWins = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COMPETITION_WINS.filter((win) => {
      const matchesTrack =
        selectedTrack === "All" || win.track === selectedTrack
      if (!matchesTrack) return false
      if (!q) return true
      return (
        win.competition.toLowerCase().includes(q) ||
        win.description.toLowerCase().includes(q) ||
        win.placement.toLowerCase().includes(q) ||
        win.teams.toLowerCase().includes(q) ||
        (win.winnings?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [selectedTrack, query])

  function handleSelectTrack(track: Track) {
    setSelectedTrack(track)
    const el = document.getElementById("wins")
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-xs">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <a
            href="#"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <img
              src="/logo.png"
              alt="UPsolve logo"
              className="size-7 rounded-md object-cover"
            />
            <span className="text-sm font-semibold tracking-tight">
              {CLUB_INFO.name}
            </span>
          </a>

          <nav
            aria-label="Primary"
            className="flex items-center gap-1 sm:gap-2 text-sm text-muted-foreground"
          >
            <a
              href="#tracks"
              className="rounded-md px-2.5 py-1.5 transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              Tracks
            </a>
            <a
              href="#wins"
              className="rounded-md px-2.5 py-1.5 transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              Wins
            </a>
            <a
              href="#internships"
              className="rounded-md px-2.5 py-1.5 transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              Internships
            </a>
            <a
              href={CLUB_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              GitHub
              <ArrowUpRight className="size-3" />
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6">
        <section className="hero-enter py-16 sm:py-24">
          <div className="flex flex-col gap-6 max-w-2xl">
            <img
              src="/logo.png"
              alt="UPsolve"
              className="size-14 rounded-xl"
            />
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.035em] leading-[1.08] text-balance">
              {CLUB_INFO.tagline}
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-[62ch]">
              {CLUB_INFO.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                size="sm"
                render={<a href="#wins" />}
              >
                View competition wins
              </Button>
              <Button
                variant="outline"
                size="sm"
                render={<a href="#internships" />}
              >
                Member internships
              </Button>
            </div>
          </div>
        </section>

        <section id="tracks" className="scroll-mt-20 pb-16 sm:pb-20">
          <div className="flex items-baseline justify-between gap-4 pb-5">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">
              What we do
            </h2>
            <span className="text-xs text-muted-foreground">
              Select a track to filter wins
            </span>
          </div>

          <div className="grid grid-cols-1 divide-y border-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {TRACKS.map((track, idx) => {
              const Icon = TRACK_ICONS[track.id]
              const dotClass =
                track.accent === "green" ? "bg-brand-green" : "bg-brand-red"
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTrack(track.id)}
                  className={`group flex flex-col justify-between gap-4 p-5 text-left transition-colors duration-150 hover:bg-card focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ring ${
                    idx < 2 ? "sm:border-b lg:border-b-0" : ""
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Icon className="size-4 text-foreground" />
                      <span
                        aria-hidden="true"
                        className={`size-2 rounded-full ${dotClass}`}
                      />
                    </div>
                    <h3 className="text-sm font-semibold tracking-tight">
                      {track.id}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {track.summary}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground/85">
                    {track.focus}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        <section id="wins" className="scroll-mt-20 pb-16 sm:pb-20">
          <div className="flex flex-col gap-5 pb-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 className="text-xl font-semibold tracking-[-0.02em]">
                Competition news
              </h2>
              <span className="text-xs tabular-nums text-muted-foreground">
                1st Sem · AY 2026–2027 · Showing {filteredWins.length} of{" "}
                {COMPETITION_WINS.length}
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Tabs
                value={selectedTrack}
                onValueChange={(value) => setSelectedTrack(value as TrackFilter)}
              >
                <TabsList className="flex-wrap h-auto">
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Hackathons">Hackathons</TabsTrigger>
                  <TabsTrigger value="Pitching">Pitching</TabsTrigger>
                  <TabsTrigger value="Competitive Programming">
                    CP
                  </TabsTrigger>
                  <TabsTrigger value="CTF">CTF</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by event, team, award"
                  aria-label="Filter competition news"
                  className="pl-8 pr-8 h-8 text-sm bg-card"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {filteredWins.length === 0 ? (
            <Empty className="border bg-card py-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Trophy />
                </EmptyMedia>
                <EmptyTitle>No matching competition news</EmptyTitle>
                <EmptyDescription>
                  No entries match the current track or search filter.
                </EmptyDescription>
              </EmptyHeader>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTrack("All")
                  setQuery("")
                }}
              >
                Reset filters
              </Button>
            </Empty>
          ) : (
            <div className="flex flex-col gap-5">
              {filteredWins.map((win) => {
                const activeIndex = activeImageByWin[win.id] ?? 0
                const currentImage = win.images[activeIndex] ?? win.images[0]

                return (
                  <article
                    key={win.id}
                    className="rounded-lg border bg-card p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {win.semester}
                          </span>
                          <Badge variant="secondary">{win.track}</Badge>
                          <Badge
                            variant="outline"
                            className={placementBadgeClass(win.tier)}
                          >
                            {win.placement}
                          </Badge>
                          {win.winnings ? (
                            <Badge
                              variant="outline"
                              className="border-brand-green-border bg-brand-green-soft text-brand-green tabular-nums"
                            >
                              {win.winnings}
                            </Badge>
                          ) : null}
                        </div>

                        <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] leading-snug text-foreground">
                          {win.competition}
                        </h3>

                        <p className="text-sm leading-relaxed text-muted-foreground max-w-[65ch]">
                          {win.description}
                        </p>

                        <p className="text-xs leading-relaxed text-muted-foreground pt-1">
                          <span className="font-medium text-foreground">
                            Teams & Members:
                          </span>{" "}
                          {win.teams}
                        </p>
                      </div>

                      {currentImage ? (
                        <div className="flex w-full shrink-0 flex-col gap-2.5 md:w-72">
                          <button
                            type="button"
                            onClick={() =>
                              setLightboxImage({
                                src: currentImage.src,
                                label: currentImage.label,
                                competition: win.competition,
                              })
                            }
                            className="group relative aspect-4/3 w-full overflow-hidden rounded-md border bg-muted text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            aria-label={`View ${currentImage.label} full image`}
                          >
                            <img
                              src={currentImage.src}
                              alt={`${win.competition} — ${currentImage.label}`}
                              loading="lazy"
                              className="size-full object-cover transition-transform duration-150 group-hover:scale-[1.02]"
                            />
                            <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-md border bg-background/85 px-2 py-1 text-[11px] font-medium text-foreground backdrop-blur-xs">
                              <Maximize2 className="size-3" />
                              View
                            </span>
                          </button>

                          {win.images.length > 1 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {win.images.map((img, idx) => {
                                const isActive = idx === activeIndex
                                return (
                                  <button
                                    key={img.src}
                                    type="button"
                                    onClick={() =>
                                      setActiveImageByWin((prev) => ({
                                        ...prev,
                                        [win.id]: idx,
                                      }))
                                    }
                                    className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ring ${
                                      isActive
                                        ? "border-foreground bg-secondary text-foreground"
                                        : "border-border bg-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    {img.label}
                                  </button>
                                )
                              })}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <Separator />

        <section id="internships" className="scroll-mt-20 py-16 sm:py-20">
          <div className="flex flex-col gap-1 pb-6 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">
              Member internships
            </h2>
            <span className="text-xs text-muted-foreground">
              Where UPsolve members have worked
            </span>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Member</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Track</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="text-right">Term</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INTERNSHIPS.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.member}</TableCell>
                    <TableCell className="font-medium">{item.company}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.role}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{item.track}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {item.location}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {item.term}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="UPsolve"
              className="size-5 rounded-sm object-cover"
            />
            <span className="font-medium text-foreground">
              {CLUB_INFO.name}
            </span>
            <span>— {CLUB_INFO.tagline}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={CLUB_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition-colors duration-150 hover:text-foreground"
            >
              GitHub
              <ArrowUpRight className="size-3" />
            </a>
            <a
              href={`mailto:${CLUB_INFO.email}`}
              className="transition-colors duration-150 hover:text-foreground"
            >
              {CLUB_INFO.email}
            </a>
          </div>
        </div>
      </footer>

      {lightboxImage ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.competition}
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-3 rounded-lg border bg-card p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {lightboxImage.competition}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {lightboxImage.label}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLightboxImage(null)}
                aria-label="Close image preview"
              >
                <X data-icon="inline-start" />
                Close
              </Button>
            </div>
            <div className="overflow-hidden rounded-md border bg-background">
              <img
                src={lightboxImage.src}
                alt={`${lightboxImage.competition} — ${lightboxImage.label}`}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
