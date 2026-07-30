import React from 'react'

function LiveScores() {
  return (
    <section className='page-section'>
      <div className='page-container'>
        <div className='surface-card rounded-[2rem] p-6 md:p-8'>
          <p className='page-kicker'>Match center</p>
          <h1 className='page-title mt-3'>Live Scores</h1>
          <p className='page-copy mt-4 max-w-3xl'>This dashboard is laid out to work on small phones and large desktops, even before live data is wired in.</p>

          <div className='mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {[
              ['Cricket', 'England 245/6', 'India 243/8', '12 mins ago'],
              ['Football', 'City 2', 'United 1', 'Live now'],
              ['Tennis', 'Player A', 'Player B', 'Set 2'],
            ].map(([sport, home, away, status]) => (
              <div key={sport} className='rounded-3xl border border-white/10 bg-slate-950/70 p-5'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-xs uppercase tracking-[0.22em] text-sky-200'>{sport}</p>
                  <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300'>{status}</span>
                </div>
                <div className='mt-5 space-y-3 text-white'>
                  <div className='flex items-center justify-between text-sm sm:text-base'>
                    <span>{home}</span>
                    <span className='font-semibold'>120</span>
                  </div>
                  <div className='flex items-center justify-between text-sm sm:text-base'>
                    <span>{away}</span>
                    <span className='font-semibold'>116</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LiveScores