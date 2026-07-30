import React from 'react'

function Contact() {
  return (
    <section className='page-section'>
      <div className='page-container'>
        <div className='grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]'>
          <div className='surface-card rounded-[2rem] p-6 md:p-8'>
            <p className='page-kicker'>Get in touch</p>
            <h1 className='page-title mt-3'>Contact</h1>
            <p className='page-copy mt-4 max-w-2xl'>Use this page to reach the sports desk, ask about coverage, or send a story tip.</p>

            <div className='mt-8 grid gap-4 sm:grid-cols-2'>
              <div className='rounded-3xl border border-white/10 bg-white/5 p-5'>
                <p className='text-xs uppercase tracking-[0.22em] text-sky-200'>Email</p>
                <p className='mt-2 break-all text-sm text-white'>khelkhoodtv@gmail.com</p>
              </div>
              <div className='rounded-3xl border border-white/10 bg-white/5 p-5'>
                <p className='text-xs uppercase tracking-[0.22em] text-sky-200'>Response time</p>
                <p className='mt-2 text-sm text-white'>Within 2 business day</p>
              </div>
              <div className='rounded-3xl border border-white/10 bg-white/5 p-5'>
                <p className='text-xs uppercase tracking-[0.22em] text-sky-200'>Coverage</p>
                <p className='mt-2 text-sm text-white'>News, interviews, and archives</p>
              </div>
            </div>
          </div>

          <aside className='form-shell rounded-[2rem] p-6 md:p-8'>
            <p className='page-kicker'>Quick note</p>
            <h2 className='page-title mt-3 text-3xl'>Have a tip?</h2>
            <p className='page-copy mt-4'>Add a form here later if you want submissions to go directly to the backend.</p>
            <div className='mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-slate-300'>
              Right now this page is optimized as a clean, readable contact hub with strong spacing and responsive cards.
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default Contact