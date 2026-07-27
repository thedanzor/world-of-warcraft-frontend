'use client'

import Link from 'next/link'
import { colors } from '@/core/theme'
import { mplusScoreColour, raidScoreColour } from '@/core/theme'

function getCharacterImage(player) {
  const assets = player?.media?.assets
  if (!assets?.length) return null
  const main = assets.find((a) => a.key === 'main-raw') || assets[0]
  const inset = assets.find((a) => a.key === 'inset') || assets[1]
  return { render: main?.value, inset: inset?.value }
}

export default function DashboardSpotlight({ players = [] }) {
  const spotlight = players.slice(0, 4)
  if (!spotlight.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {spotlight.map((player, index) => {
        const images = getCharacterImage(player)
        const classColour = player.classColour || colors.accentLt
        return (
          <Link
            key={`${player.server}-${player.name}`}
            href={`/member/${player.server}/${player.name}`}
            className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f1923] dashboard-spotlight-card h-[220px]"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div
              className="absolute inset-0 opacity-50 group-hover:opacity-65 transition-opacity duration-500"
              style={{
                background: `radial-gradient(ellipse 90% 85% at 50% 85%, ${classColour}55 0%, transparent 72%)`,
              }}
            />

            {/* Character render — fills the card above the footer */}
            <div className="absolute inset-x-0 top-0 bottom-[68px] flex items-end justify-center pointer-events-none px-1">
              {images?.render ? (
                <img
                  src={images.render}
                  alt={player.name}
                  className="h-full w-full max-w-none object-contain object-bottom scale-[1.08] origin-bottom drop-shadow-[0_10px_28px_rgba(0,0,0,0.65)] group-hover:scale-[1.12] transition-transform duration-500"
                />
              ) : (
                <img
                  src="/images/logo-without-text.png"
                  alt=""
                  className="h-16 opacity-30 object-contain"
                />
              )}
            </div>

            {/* Footer */}
            <div className="absolute inset-x-0 bottom-0 px-3 py-2.5 bg-gradient-to-t from-[#0f1923] via-[#0f1923]/95 to-transparent">
              <div className="flex items-center gap-2 min-w-0">
                {images?.inset && (
                  <img
                    src={images.inset}
                    alt=""
                    className="w-7 h-7 rounded-md border border-white/10 object-cover shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm capitalize truncate leading-tight" style={{ color: classColour }}>
                    {player.name}
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground truncate leading-tight">
                    {player.spec} {player.class}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 text-[0.65rem] font-semibold pt-1">
                {player.raidScore > 0 && (
                  <span style={{ color: raidScoreColour(player.raidScore) }}>
                    Raid {Math.round(player.raidScore)}
                  </span>
                )}
                {player.mplusScore > 0 && (
                  <span style={{ color: mplusScoreColour(player.mplusScore) }}>
                    M+ {Math.round(player.mplusScore)}
                  </span>
                )}
                {player.mplus > 0 && !player.mplusScore && (
                  <span style={{ color: mplusScoreColour(player.mplus) }}>
                    {Math.round(player.mplus)} rating
                  </span>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
