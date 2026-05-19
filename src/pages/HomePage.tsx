import EnvelopePanel from '../components/home/EnvelopePanel'
import GlobePanel from '../components/home/GlobePanel'

export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--color-bg-dark)]">
      {/* TIME — Envelope Panel */}
      <div className="flex-1 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
        <EnvelopePanel />
      </div>

      {/* MAP — Globe Panel */}
      <div className="flex-1 flex items-center justify-center">
        <GlobePanel />
      </div>
    </div>
  )
}
