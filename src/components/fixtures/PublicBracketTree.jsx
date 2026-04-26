const nameOf = (p) => p?.name || '—'

const MatchCard = ({ match }) => {
  const winnerId = match.winnerId
  const completed = match.status === 'completed'
  const isBye = match.status === 'bye'
  const p1Won = completed && String(match.participant1?._id) === String(winnerId)
  const p2Won = completed && String(match.participant2?._id) === String(winnerId)

  return (
    <div className="rounded-lg border border-gold/15 bg-navy-2/60 text-[11px] overflow-hidden">
      {match.label && (
        <div className="px-2 pt-1 pb-0.5 text-[9px] font-bold uppercase tracking-wider text-gold/70">
          {match.label}
        </div>
      )}
      <div className={`flex items-center justify-between px-2 py-1.5 ${p1Won ? 'text-gold font-bold' : 'text-ivory/80'}`}>
        <span className="truncate">{match.participant1 ? nameOf(match.participant1) : <span className="text-slate-2/50">BYE</span>}</span>
        {completed && <span className="ml-2 font-mono text-ivory">{match.score1}</span>}
      </div>
      <div className="h-px bg-gold/10" />
      <div className={`flex items-center justify-between px-2 py-1.5 ${p2Won ? 'text-gold font-bold' : 'text-ivory/80'}`}>
        <span className="truncate">{match.participant2 ? nameOf(match.participant2) : <span className="text-slate-2/50">BYE</span>}</span>
        {completed && <span className="ml-2 font-mono text-ivory">{match.score2}</span>}
      </div>
      {isBye && (
        <div className="px-2 py-0.5 text-[9px] uppercase tracking-wider text-slate-2/50">Bye</div>
      )}
    </div>
  )
}

export default function PublicBracketTree({ matches, title }) {
  if (!matches || matches.length === 0) return null

  const rounds = [...new Set(matches.map((m) => m.round))].sort((a, b) => a - b)
  const count = rounds.length
  const roundLabel = (r) => {
    const idx = rounds.indexOf(r)
    if (idx === count - 1) return 'Final'
    if (idx === count - 2) return 'Semi-final'
    if (idx === count - 3) return 'Quarter-final'
    return `Round ${r}`
  }

  return (
    <div className="w-full">
      {title && (
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-3">{title}</h4>
      )}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-3 sm:mx-0 px-3 sm:px-0">
        {rounds.map((r) => (
          <div key={r} className="flex flex-col justify-around gap-2 sm:gap-3 min-w-[140px] sm:min-w-[170px]">
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-2/60 text-center">
              {roundLabel(r)}
            </div>
            {matches
              .filter((m) => m.round === r)
              .sort((a, b) => a.order - b.order)
              .map((m) => <MatchCard key={m._id} match={m} />)}
          </div>
        ))}
      </div>
    </div>
  )
}
