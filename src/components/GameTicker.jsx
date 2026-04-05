// Animated marquee ticker — unique luxury feature
const games = [
  'EA Sports FC 25', 'God of War Ragnarök', 'NBA 2K25', 'Mortal Kombat 1',
  'Call of Duty: MW3', 'GTA V Online', 'Spider-Man 2', 'Tekken 8',
  'Hogwarts Legacy', 'The Last of Us Part I', 'Elden Ring', 'Cyberpunk 2077',
  'Resident Evil 4', 'Gran Turismo 7', 'Horizon Forbidden West', 'Demon\'s Souls',
]

const ticker = [...games, ...games]

export default function GameTicker() {
  return (
    <section id="ticker" className="bg-navy py-4 overflow-hidden border-y border-gold/20">
      <div className="flex animate-ticker whitespace-nowrap">
        {ticker.map((game, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6">
            <span className="text-xs font-semibold tracking-[0.12em] uppercase text-white/70">
              {game}
            </span>
            <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
          </span>
        ))}
      </div>
    </section>
  )
}
