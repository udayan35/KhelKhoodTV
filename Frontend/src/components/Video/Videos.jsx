import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

function Videos() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await API.get('/content', { params: { type: 'interview' } })
        const payload = response.data && response.data.data ? response.data.data : response.data
        setVideos(Array.isArray(payload) ? payload : [])
      } catch (fetchError) {
        console.error(fetchError)
        setError('Unable to load interviews right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const handleVideoUploadBtn = ( )=>{
    // navigate to upload video page
    navigate(`/upload-video`)
  }

  return (
    <section className='page-section'>
      <div className='page-container'>
        <div className='surface-card rounded-[2rem] p-6 md:p-8'>
        <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='page-kicker'>Video interviews</p>
            <h1 className='page-title mt-2'>Watch the latest conversations</h1>
            <p className='page-copy mt-4 max-w-3xl'>Browse interview clips in a layout that stays comfortable on mobile and scales well on desktop.</p>
          </div>
          {user && user.role === 'admin' && (
          <button onClick={handleVideoUploadBtn} className='primary-button w-full sm:w-auto'>
            Upload video
          </button>
          )}
        </div>

        {loading ? (
          <div className='rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300 backdrop-blur'>Loading interviews...</div>
        ) : error ? (
          <div className='rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-100'>{error}</div>
        ) : videos.length === 0 ? (
          <div className='rounded-3xl border border-white/10 bg-white/5 p-8 text-slate-300 backdrop-blur'>No interviews have been uploaded yet.</div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {videos.map((video) => (
              <Link
                key={video._id || video.slug}
                to={`/videos/${video.slug}`}
                className='group overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 shadow-2xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-slate-950'
              >
                <div className='relative overflow-hidden'>
                  <img
                    className='h-64 w-full object-cover transition duration-500 group-hover:scale-105'
                    src={video.thumbnailURL || 'https://images.pexels.com/photos/2882634/pexels-photo-2882634.jpeg'}
                    alt={video.title || 'Interview thumbnail'}
                  />
                  {video.duration ? (
                    <span className='absolute bottom-3 right-3 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white backdrop-blur'>
                      {Math.max(1, Math.round(video.duration / 60))} min
                    </span>
                  ) : null}
                </div>
                <div className='space-y-3 p-5'>
                  <p className='text-xs uppercase tracking-[0.22em] text-cyan-200'>Interview</p>
                  <h2 className='text-xl font-semibold leading-snug text-white'>{video.title}</h2>
                  <p className='text-sm leading-6 text-slate-300'>
                    {video.subtitle || video.description || 'Open to watch the full interview.'}
                  </p>
                  <div className='flex items-center justify-between text-xs text-slate-400'>
                    <span>{video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : 'Recently published'}</span>
                    <span className='transition group-hover:text-cyan-200'>Play interview</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className='fixed bottom-6 right-6 z-50'>
          {user && user.role === 'admin' && (
          <button onClick={handleVideoUploadBtn} className='h-14 w-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-700 text-2xl font-bold text-white shadow-2xl shadow-cyan-950/25 transition hover:scale-105'>
            +
          </button>
          )}
        </div>
        </div>
      </div>
    </section>
  )
}

export default Videos