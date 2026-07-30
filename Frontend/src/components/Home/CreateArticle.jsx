import React, { useState } from 'react'
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';

function CreateArticle() {
  const [type, setType] = useState('')
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('Short description of the article')
  const [content, setContent] = useState('Write your article content here...')
  const [thumbnailURL, setThumbnailURL] = useState('')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState('')

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!type || !title.trim()) {
        throw new Error('Please choose an article type and enter a title.');
      }

      await API.post('/content', {
        type,
        title,
        subtitle: excerpt,
        excerpt,
        thumbnailURL,
        content: [{ type: 'paragraph', value: content }],
      });

      navigate('/');
    } catch (err) {
      console.error('Error creating article', err);
      alert(err.response?.data?.message || err.message || 'Failed to create article.');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // show local preview immediately
    try {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      const formData = new FormData();
      formData.append('image', file);

      setUploading(true);

      const res = await API.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // backend returns { imageUrl }
      const imageUrl = res.data.imageUrl || res.data.imageUrl;
      setThumbnailURL(imageUrl);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };


  return (
    <section className='page-section'>
      <div className='page-container'>
        <div className='grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]'>
          <div className='form-shell rounded-[2rem] p-6 md:p-8'>
            <div className='mb-6'>
              <p className='page-kicker'>Publishing tools</p>
              <h1 className='page-title mt-3'>Create Article</h1>
              <p className='page-copy mt-4 max-w-3xl'>Draft a story, add an image, and publish it with a layout that scales on phones and large screens.</p>
            </div>

            <form onSubmit={handleSubmit} className='grid gap-5'>
              <label className='form-label'>
                <span>Article Type</span>
                <select
                  id='article-type'
                  className='form-input'
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value=''>-- Choose --</option>
                  <option value='article'>Article</option>
                  <option value='archive'>Archive</option>
                  <option value='interview'>Interview</option>
                </select>
              </label>

              <label className='form-label'>
                <span>Title</span>
                <input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Article title'
                  className='form-input'
                />
              </label>

              <label className='form-label'>
                <span>Excerpt</span>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={4}
                  className='form-input min-h-28 resize-y'
                />
              </label>

              <label className='form-label'>
                <span>Thumbnail URL</span>
                <input
                  type='text'
                  value={thumbnailURL}
                  onChange={(e) => setThumbnailURL(e.target.value)}
                  placeholder='https://example.com/image.jpg'
                  className='form-input'
                />
              </label>

              <div className='rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-center text-sm text-slate-300'>
                <p>Upload an image manually or paste a public URL.</p>
                <input onChange={handleFileChange} type='file' accept='image/*' className='mt-4 block w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white' />

                {uploading ? <p className='mt-3 text-sm text-sky-300'>Uploading...</p> : null}

                {(preview || thumbnailURL) ? (
                  <div className='mt-4'>
                    <p className='mb-2 text-sm text-slate-400'>Preview</p>
                    <img src={preview || thumbnailURL} alt='thumbnail preview' className='mx-auto max-h-56 rounded-2xl object-cover' />
                  </div>
                ) : null}
              </div>

              <label className='form-label'>
                <span>Content</span>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className='form-input min-h-64 resize-y'
                />
              </label>

              <div className='flex justify-end pt-2'>
                <button type='submit' className='primary-button w-full sm:w-auto'>
                  Save Article
                </button>
              </div>
            </form>
          </div>

          <aside className='surface-card rounded-[2rem] p-6 md:p-8'>
            <p className='page-kicker'>Guidelines</p>
            <h2 className='page-title mt-3 text-3xl'>Better publishing on every screen</h2>
            <div className='mt-6 space-y-4 text-sm leading-6 text-slate-300'>
              <p>Use a short title, a clear excerpt, and a high-resolution thumbnail so the card stays readable on mobile.</p>
              <p>Choose the correct type before saving so the story appears in the right section of the site.</p>
              <p>Keep the content text concise if you want the editor to remain comfortable on small screens.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default CreateArticle
