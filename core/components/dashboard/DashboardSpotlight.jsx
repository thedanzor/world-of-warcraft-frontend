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
            className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f1923] dashboard-spotlight-card"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div
              className="absolute inset-0 opacity-40 group-hover:opacity-55 transition-opacity duration-500"
              style={{
                background: `radial-gradient(ellipse 80% 70% at 50% 100%, ${classColour}55 0%, transparent 70%)`,
              }}
            />
            <div className="relative p-4 flex flex-col min-h-[220px]">
              <div className="flex-1 flex items-end justify-center pt-2 min-h-[140px]">
                {images?.render ? (
                  <img
                    src={images.render}
                    alt={player.name}
                    className="max-h-[150px] w-auto object-contain object-bottom drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)] group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <img
                    src="/images/logo-without-text.png"
                    alt=""
                    className="h-20 opacity-30"
                  />
                )}
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2">
                  {images?.inset && (
                    <img
                      src={images.inset}
                      alt=""
                      className="w-8 h-8 rounded-md border border-white/10 object-cover"
                    />
                  )}
                  <p className="font-bold text-sm capitalize truncate" style={{ color: classColour }}>
                    {player.name}
                  </p>
                </div>
                <p className="text-[0.7rem] text-muted-foreground truncate">
                  {player.spec} {player.class}
                </p>
                <div className="flex gap-3 text-[0.68rem] font-semibold pt-1">
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
            </div>
          </Link>
        )
      })}
    </div>
  )
}
