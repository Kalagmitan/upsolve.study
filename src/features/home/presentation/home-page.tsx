import { useState } from "react"
import { Separator } from "@/core/components/ui/separator"
import { CompetitionsSection, type TrackFilter } from "@/features/competitions"
import { InternshipsSection } from "@/features/internships"
import { TracksSection, type Track } from "@/features/tracks"
import { HeroSection } from "./components/hero-section"

export function HomePage() {
  // Lifted here because the Tracks section drives the Competitions filter.
  const [selectedTrack, setSelectedTrack] = useState<TrackFilter>("All")

  function handleSelectTrack(track: Track) {
    setSelectedTrack(track)
    document
      .getElementById("wins")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6">
      <HeroSection />
      <TracksSection onSelectTrack={handleSelectTrack} />
      <CompetitionsSection
        selectedTrack={selectedTrack}
        onTrackChange={setSelectedTrack}
      />
      <Separator />
      <InternshipsSection />
    </main>
  )
}
