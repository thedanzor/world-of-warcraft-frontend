import DynamicScreenLoader from '@/core/dynamicScreenLoader'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default function RankingsPage() {
  return (
    <main className="fullbody">
      <DynamicScreenLoader screenName="rankings" props={{}} />
    </main>
  )
}
