import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import API from '../../api/axios'

function PlayVDO() {
  const { slug } = useParams()
  const [video, setVideo] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        setError('')

        const [videoResponse, relatedResponse] = await Promise.all([
          API.get(`/content/${slug}`),
          API.get('/content', { params: { type: 'interview' } }),
        ])

        const videoData = videoResponse.data?.article || null
        const relatedData = relatedResponse.data?.data || []

        if (!videoData || videoData.type !== 'interview') {
          throw new Error('Interview video not found.')
        }

        setVideo(videoData)
        setRelatedVideos(
          Array.isArray(relatedData)
            ? relatedData.filter((item) => item.slug !== slug)
            : []
        )
      } catch (fetchError) {
        console.error(fetchError)
        setError('Unable to load this interview video.')
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [slug])

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-950 text-white flex items-center justify-center px-4'>
        <div className='rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-200 backdrop-blur'>
          Loading interview...
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className='min-h-screen bg-slate-950 text-white flex items-center justify-center px-4'>
        <div className='max-w-lg rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center shadow-2xl'>
          <h1 className='text-2xl font-semibold'>Interview unavailable</h1>
          <p className='mt-3 text-sm text-red-100/80'>{error || 'This interview could not be loaded.'}</p>
          <Link
            to='/videos'
            className='mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200'
          >
            Back to videos
          </Link>
        </div>
      </div>
    )
  }

  const publishedLabel = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString()
    : 'Recently published'

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_36%),linear-gradient(180deg,_#020617_0%,_#0f172a_55%,_#020617_100%)] text-white'>
      <div className='mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8'>
        <div className='grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]'>
          <main className='space-y-6'>
            <Link
              to='/videos'
              className='inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white'
            >
              <span aria-hidden='true'>←</span>
              Back to videos
            </Link>

            <section className='overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl'>
              <div className='relative bg-black'>
                <video
                  controls
                  autoPlay
                  playsInline
                  preload='metadata'
                  poster={video.thumbnailURL || ''}
                  src={video.videoURL || ''}
                  className='aspect-video w-full bg-black'
                />
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent' />
              </div>

              <div className='space-y-5 p-6 md:p-8'>
                <div className='flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-400'>
                  <span className='rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-cyan-200'>
                    Interview
                  </span>
                  <span>{publishedLabel}</span>
                  {video.duration ? <span>{Math.max(1, Math.round(video.duration / 60))} min</span> : null}
                </div>

                <div>
                  <h1 className='text-3xl font-semibold leading-tight md:text-5xl'>{video.title}</h1>
                  <p className='mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base'>
                    {video.subtitle || video.description || 'Watch the full interview below.'}
                  </p>
                </div>

                {video.description && video.description !== video.subtitle ? (
                  <p className='max-w-4xl text-sm leading-7 text-slate-200 md:text-base'>
                    {video.description}
                  </p>
                ) : null}

                {/* <div className='grid gap-4 sm:grid-cols-3'>
                  <div className='rounded-2xl border border-white/10 bg-slate-950/60 p-4'>
                    <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Thumbnail</p>
                    <p className='mt-2 break-all text-sm text-slate-200'>{video.thumbnailURL || 'Not available'}</p>
                  </div>
                  <div className='rounded-2xl border border-white/10 bg-slate-950/60 p-4'>
                    <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Video URL</p>
                    <p className='mt-2 break-all text-sm text-slate-200'>{video.videoURL || 'Not available'}</p>
                  </div>
                  <div className='rounded-2xl border border-white/10 bg-slate-950/60 p-4'>
                    <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Status</p>
                    <p className='mt-2 text-sm text-slate-200'>{video.status || 'published'}</p>
                  </div>
                </div> */}
              </div>
            </section>
          </main>

          <aside className='space-y-4'>
            <div className='rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl'>
              <h2 className='text-lg font-semibold'>More interviews</h2>
              <div className='mt-5 space-y-4'>
                {relatedVideos.length > 0 ? (
                  relatedVideos.map((item) => (
                    <Link
                      key={item._id || item.slug}
                      to={`/videos/${item.slug}`}
                      className='group flex gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-3 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-slate-950'
                    >
                      <img
                        src={item.thumbnailURL || 'https://images.pexels.com/photos/2882634/pexels-photo-2882634.jpeg'}
                        alt={item.title}
                        className='h-20 w-28 rounded-xl object-cover'
                      />
                      <div className='min-w-0 flex-1'>
                        <p className='text-xs uppercase tracking-[0.18em] text-cyan-200'>Interview</p>
                        <h3 className='mt-1 truncate text-sm font-semibold text-white group-hover:text-cyan-100'>
                          {item.title}
                        </h3>
                        <p className='mt-1 line-clamp-2 text-xs leading-5 text-slate-400'>
                          {item.subtitle || item.description || 'Watch this interview.'}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className='text-sm text-slate-400'>No other interviews yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default PlayVDO