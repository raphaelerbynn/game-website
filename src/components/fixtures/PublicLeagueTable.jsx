export default function PublicLeagueTable({ table }) {
  if (!table || table.length === 0) {
    return <p className="text-xs text-slate-2/60 py-4 text-center">No table data yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-slate-2/70 border-b border-gold/15">
            <th className="py-2 pr-3 font-bold uppercase tracking-wider text-[9px]">#</th>
            <th className="py-2 pr-3 font-bold uppercase tracking-wider text-[9px]">Player</th>
            <th className="py-2 px-2 font-bold uppercase tracking-wider text-[9px] text-center">P</th>
            <th className="py-2 px-2 font-bold uppercase tracking-wider text-[9px] text-center">W</th>
            <th className="py-2 px-2 font-bold uppercase tracking-wider text-[9px] text-center">D</th>
            <th className="py-2 px-2 font-bold uppercase tracking-wider text-[9px] text-center">L</th>
            <th className="py-2 px-2 font-bold uppercase tracking-wider text-[9px] text-center">GF</th>
            <th className="py-2 px-2 font-bold uppercase tracking-wider text-[9px] text-center">GA</th>
            <th className="py-2 px-2 font-bold uppercase tracking-wider text-[9px] text-center">GD</th>
            <th className="py-2 pl-2 font-bold uppercase tracking-wider text-[9px] text-center text-gold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr
              key={row.participantId}
              className={`border-b border-gold/10 ${i === 0 ? 'bg-gold/5' : ''}`}
            >
              <td className="py-2 pr-3 text-slate-2 font-mono">{i + 1}</td>
              <td className="py-2 pr-3 text-ivory font-medium truncate max-w-[160px]">
                {row.participantName}
              </td>
              <td className="py-2 px-2 text-center text-ivory/80">{row.played}</td>
              <td className="py-2 px-2 text-center text-emerald-400">{row.wins}</td>
              <td className="py-2 px-2 text-center text-slate-2">{row.draws}</td>
              <td className="py-2 px-2 text-center text-red-400">{row.losses}</td>
              <td className="py-2 px-2 text-center text-ivory/80">{row.goalsFor}</td>
              <td className="py-2 px-2 text-center text-ivory/80">{row.goalsAgainst}</td>
              <td className={`py-2 px-2 text-center font-mono ${row.goalDifference > 0 ? 'text-emerald-400' : row.goalDifference < 0 ? 'text-red-400' : 'text-slate-2'}`}>
                {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
              </td>
              <td className="py-2 pl-2 text-center font-bold text-ivory">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
