import React, { useState } from 'react'
import API from '../../api/axios';
import {useNavigate} from 'react-router-dom';

function UploadVideo() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('Short description of the article')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!title.trim()) {
        throw new Error('Please enter a title.');
      }

      if (!thumbnailFile || !videoFile) {
        throw new Error('Please choose both a thumbnail image and a video file.');
      }

      setUploading(true)

      const formData1 = new FormData();
      const formData2 = new FormData();
      
      formData1.append('image', thumbnailFile);
      formData2.append('video', videoFile);

      const uploadImageResponse = await API.post('/upload/image', formData1, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadVideoResponse = await API.post('/upload/interview', formData2, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedThumbnailURL = uploadImageResponse.data.imageUrl || '';
      const uploadedVideoURL = uploadVideoResponse.data.videoUrl || '';
      const uploadedVideoPublicId = uploadVideoResponse.data.publicId || '';

      await API.post('/content', {
        type: 'interview',
        title,
        subtitle: excerpt,
        excerpt,
        thumbnailURL: uploadedThumbnailURL,
        videoURL: uploadedVideoURL,
        videoPublicId: uploadedVideoPublicId,
        description: excerpt,
      });

      navigate('/videos');
    } catch (error) {
      console.log(error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setThumbnailFile(null);
      setPreview('');
      return;
    }

    setThumbnailFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setVideoFile(null);
      return;
    }

    setVideoFile(file);
  };


  return (
    <section className='page-section'>
      <div className='page-container'>
        <div className='grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]'>
          <div className='form-shell rounded-[2rem] p-6 md:p-8'>
            <div className='mb-6'>
              <p className='page-kicker'>Video publishing</p>
              <h1 className='page-title mt-3'>Create Video</h1>
              <p className='page-copy mt-4 max-w-3xl'>Upload an interview with a thumbnail and video file using a layout built for desktop and mobile screens.</p>
            </div>

            <form className='grid gap-5' onSubmit={handleSubmit}>
              <label className='form-label'>
                <span>Title</span>
                <input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Interview title'
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
                <span>Thumbnail Image</span>
                <div className='rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-center text-sm text-slate-300'>
                  <p>Choose the thumbnail image for the interview.</p>
                  <input type='file' accept='image/*' onChange={handleThumbnailChange} className='mt-4 block w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white' />

                  {uploading ? <p className='mt-3 text-sm text-sky-300'>Uploading...</p> : null}

                  {preview ? (
                    <div className='mt-4'>
                      <p className='mb-2 text-sm text-slate-400'>Preview</p>
                      <img src={preview} alt='thumbnail preview' className='mx-auto max-h-56 rounded-2xl object-cover' />
                    </div>
                  ) : null}
                </div>
              </label>

              <label className='form-label'>
                <span>Video File</span>
                <div className='rounded-3xl border border-dashed border-white/10 bg-white/5 p-5 text-center text-sm text-slate-300'>
                  <p>Choose the interview video file.</p>
                  <input type='file' accept='video/*' onChange={handleVideoChange} className='mt-4 block w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white' />

                  {videoFile ? <p className='mt-3 break-all text-xs text-slate-300'>{videoFile.name}</p> : null}
                </div>
              </label>

              <div className='mt-2 flex justify-end'>
                <button type='submit' className='primary-button w-full sm:w-auto'>
                  Save Video
                </button>
              </div>
            </form>
          </div>

          <aside className='surface-card rounded-[2rem] p-6 md:p-8'>
            <p className='page-kicker'>Checklist</p>
            <h2 className='page-title mt-3 text-3xl'>Upload-ready formatting</h2>
            <div className='mt-6 space-y-4 text-sm leading-6 text-slate-300'>
              <p>Keep your file names readable so uploads are easier to verify on smaller screens.</p>
              <p>Use a thumbnail that crops well in a card grid and on the video player page.</p>
              <p>The controls remain stacked on mobile so the workflow stays readable and touch-friendly.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default UploadVideo
