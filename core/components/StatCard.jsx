import React from 'react'
import { colors } from '@/core/theme'

const StatCard = ({ title, value, description, icon: Icon, color = colors.accent }) => (
    <div className="audit-panel h-full transition-colors hover:border-primary/30 group">
        <div className="p-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-[0.67rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    {title}
                </p>
                <div
                    className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
                    style={{
                        background: `${color}1a`,
                        border: `1px solid ${color}33`,
                    }}
                >
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
            </div>
            <p className="stat-number text-[1.65rem] leading-none mb-1">{value}</p>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
        </div>
    </div>
)

export default StatCard
