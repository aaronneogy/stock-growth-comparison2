import { ClientWrapper } from '../components/stock-comparison/client-wrapper'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-100 via-fuchsia-200 to-blue-300">
      <div className="container mx-auto p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-blue-600 inline-block text-transparent bg-clip-text">
              Stock Growth Comparison Tool
            </h1>
            <p className="text-lg text-indigo-900/80">
              Transform your investment decisions with data-driven market insights
            </p>
          </div>
          <ClientWrapper />
        </div>
      </div>
    </main>
  )
}
