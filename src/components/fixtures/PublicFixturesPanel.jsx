import { useEffect, useState } from 'react'
import { getPublicTournamentFixtures } from '../../services/api'
import PublicBracketTree from './PublicBracketTree'
import PublicLeagueTable from './PublicLeagueTable'

const nameOf = (p) => p?.name || '—'

function LeagueFixtureList({ matches }) {
  const rounds = [...new Set(matches.map((m) => m.round))].sort((a, b) => a - b)
  return (
    <div className="space-y-4">
      {rounds.map((r) => (
        <div key={r}>
          <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-2/60 mb-2">
            Matchday {r}
          </h5>
          <div className="space-y-1.5">
            {matches.filter((m) => m.round === r).map((m) => {
              const completed = m.status === 'completed'
              const winnerId = m.winnerId
              const p1Won = completed && String(m.participant1?._id) === String(winnerId)
              const p2Won = completed && String(m.participant2?._id) === String(winnerId)
              const isDraw = completed && !winnerId
              return (
                <div
                  key={m._id}
                  className="flex items-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs bg-navy-2/60 border border-gold/10"
                >
                  <span className={`flex-1 min-w-0 truncate text-right ${p1Won ? 'text-gold font-bold' : 'text-ivory/80'}`}>
                    {nameOf(m.participant1)}
                  </span>
                  <span className={`font-mono text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded min-w-[44px] sm:min-w-[48px] text-center flex-shrink-0 ${
                    isDraw ? 'bg-slate-600/40 text-ivory' : completed ? 'bg-navy text-ivory' : 'text-slate-2/50'
                  }`}>
                    {completed ? `${m.score1} – ${m.score2}` : 'vs'}
                  </span>
                  <span className={`flex-1 min-w-0 truncate ${p2Won ? 'text-gold font-bold' : 'text-ivory/80'}`}>
                    {nameOf(m.participant2)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PublicFixturesPanel({ tournament, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    getPublicTournamentFixtures(tournament._id)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [open, tournament._id])

  const hasFixtures = data && data.matches?.length > 0

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-xs font-bold uppercase tracking-widest text-gold/80 hover:text-gold py-2 border-t border-gold/10 transition-colors"
      >
        {open ? 'Hide' : 'View'} Fixtures ↓
      </button>

      {open && (
        <div className="mt-3 rounded-xl bg-navy/40 border border-gold/10 p-3 sm:p-4">
          {loading ? (
            <p className="text-xs text-slate-2/60 text-center py-4">Loading...</p>
          ) : !hasFixtures ? (
            <p className="text-xs text-slate-2/60 text-center py-4">
              Fixtures haven't been set yet. Check back soon!
            </p>
          ) : data.format === 'league' ? (
            <div className="space-y-5">
              <PublicLeagueTable table={data.table} />
              <LeagueFixtureList matches={data.matches} />
            </div>
          ) : data.format === 'double-elimination' ? (
            <div className="space-y-5">
              <PublicBracketTree title="Winners Bracket" matches={data.matches.filter((m) => m.bracket === 'winners')} />
              <PublicBracketTree title="Losers Bracket" matches={data.matches.filter((m) => m.bracket === 'losers')} />
              <PublicBracketTree title="Grand Final" matches={data.matches.filter((m) => m.bracket === 'grand-final')} />
            </div>
          ) : (
            <PublicBracketTree matches={data.matches} />
          )}
        </div>
      )}
    </div>
  )
}
