import React from 'react'
import { Flame, HelpCircle } from 'lucide-react'

const MythicPlusSection = ({ stats }) => {
    const pushCount = stats.wantToPushKeysCount || 0
    const noCount = stats.notWantToPushKeysCount || 0
    const total = pushCount + noCount
    const pushPct = total > 0 ? Math.round((pushCount / total) * 100) : 0

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold tracking-tight">Mythic+ Interest</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Players who want to push keys this season</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Push keys */}
                <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-card shadow-sm p-5">
                    <div className="p-3 rounded-lg bg-orange-500/10 shrink-0">
                        <Flame className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Pushing Keys</p>
                        <p className="text-3xl font-bold text-orange-400">{pushCount}</p>
                        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full bg-orange-400 transition-all"
                                style={{ width: `${pushPct}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{pushPct}% of sign-ups</p>
                    </div>
                </div>

                {/* Not interested */}
                <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-card shadow-sm p-5">
                    <div className="p-3 rounded-lg bg-muted/60 shrink-0">
                        <HelpCircle className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Not Interested</p>
                        <p className="text-3xl font-bold text-muted-foreground">{noCount}</p>
                        <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full rounded-full bg-muted-foreground/40 transition-all"
                                style={{ width: `${100 - pushPct}%` }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{100 - pushPct}% of sign-ups</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MythicPlusSection
