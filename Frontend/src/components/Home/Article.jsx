import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

function Article() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [article, setArticle] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await API.get(`/content/${slug}`)
        setArticle(res.data.article)
        setComments(res.data.comments || [])
      } catch (err) {
        console.error(err)
        setError('Unable to load article.')
      }
    }

    fetchArticle()
  }, [slug])

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await API.post('/comments', {
        contentId: article._id,
        text: commentText,
      })
      setCommentText('')
      const res = await API.get(`/content/${slug}`)
      setComments(res.data.comments || [])
    } catch (err) {
      console.error(err)
      setError('Could not post comment.')
    }
  }

  if (!article) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-900 text-white'>
        {error || 'Loading article...'}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-900 text-white px-4 py-10'>
      <div className='mx-auto max-w-5xl rounded-3xl border border-gray-800 bg-slate-950/90 p-8 shadow-2xl'>
        <h1 className='text-4xl font-bold mb-4'>{article.title}</h1>
        <p className='text-slate-300 mb-6'>{article.subtitle || article.excerpt}</p>
        {article.thumbnailURL && (
          <img src={article.thumbnailURL} alt={article.title} className='mb-6 w-full rounded-3xl object-cover' />
        )}
        <div className='space-y-4 text-slate-100'>
          {Array.isArray(article.content) && article.content.length > 0
            ? article.content.map((block, index) => {
                if (block.type === 'heading') {
                  return (
                    <h2 key={index} className='text-2xl font-semibold'>
                      {block.value}
                    </h2>
                  )
                }
                if (block.type === 'quote') {
                  return (
                    <blockquote key={index} className='border-l-4 border-blue-500 pl-4 italic'>
                      {block.value}
                    </blockquote>
                  )
                }
                return (
                  <p key={index} className='leading-relaxed text-slate-200'>
                    {block.value}
                  </p>
                )
              })
            : <p className='leading-relaxed text-slate-200'>{article.excerpt}</p>
          }
        </div>

        <div className='mt-10 rounded-3xl border border-gray-800 bg-slate-900 p-6'>
          <h2 className='text-2xl font-semibold mb-4'>Comments</h2>
          {comments.length === 0 ? (
            <p className='text-slate-400 mb-4'>No comments yet.</p>
          ) : (
            <div className='space-y-4 mb-6'>
              {comments.map((comment) => (
                <div key={comment._id} className='rounded-2xl border border-gray-800 bg-slate-950 p-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <span className='font-semibold'>{comment.userName}</span>
                    <span className='text-sm text-slate-500'>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className='mt-2 text-slate-200'>{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className='space-y-4'>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              placeholder={user ? 'Leave a comment...' : 'Log in to leave a comment.'}
              className='w-full rounded-3xl border border-gray-700 bg-slate-800 px-4 py-3 text-white outline-none'
              disabled={!user}
            />
            <button
              type='submit'
              disabled={!user || !commentText.trim()}
              className='rounded-3xl bg-blue-600 px-6 py-3 text-white disabled:opacity-50'
            >
              Post Comment
            </button>
          </form>
          {error && <p className='mt-3 text-sm text-red-500'>{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default Article