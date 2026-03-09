import React from 'react'

const StatCard = ({ title, value, description, icon: Icon }) => (
    <div className="stat-card relative overflow-hidden bg-card text-card-foreground rounded-xl border border-border/50 shadow-sm p-6 flex flex-col justify-between bg-gradient-subtle card-gradient-border group">
        <div className="stat-card-header flex items-center justify-between mb-4 relative z-10">
            <h3 className="stat-card-title text-sm font-medium tracking-tight text-muted-foreground">
                {title}
            </h3>
            <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <Icon className="w-4 h-4" />
            </div>
        </div>
        <div className="relative z-10">
            <p className="stat-card-value text-3xl font-bold tracking-tight">
                {value}
            </p>
            <p className="stat-card-description text-xs text-muted-foreground mt-1">
                {description}
            </p>
        </div>
    </div>
)

export default StatCard
