import React,{useState,useEffect} from 'react'
import { useNavigate, Link } from "react-router-dom";
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Archives = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCreateArticleBtnClick = ( )=>{
      navigate(`/create-article`)
    }

    const [articles, setArticles] = useState([]);


    useEffect(() => {
      const fetchArticles = async () => {
        try{
          const response = await API.get('/content', {
            params: { type: 'archives' }
          });

          // Backend returns { data: [...], success: true }
          const payload = response.data && response.data.data ? response.data.data : response.data;
          console.log(payload);

          setArticles(Array.isArray(payload) ? payload : []);
        }catch(error){
          console.log(error);
        }
      }
      fetchArticles();
    },[]);
    

    return (
      <section className='page-section'>
        <div className='page-container'>
          <div className='surface-card rounded-[2rem] p-6 md:p-8'>
            <p className='page-kicker'>Editorial archive</p>
            <div className='mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <h1 className='page-title'>My Archives</h1>
                <p className='page-copy mt-4 max-w-3xl'>Browse previously published stories and saved coverage in a layout that scales cleanly on every screen.</p>
              </div>
              {user && user.role === 'admin' && (
              <button onClick={handleCreateArticleBtnClick} className='primary-button w-full sm:w-auto'>
                Add archive
              </button>
              )}
            </div>

            <div className='mt-8 grid gap-6 md:grid-cols-2'>
              {articles.map((article, idx) => (
                <Link
                  key={article._id || article.slug || idx}
                  to={`/article/${article.slug}`}
                  className='group overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-slate-950'
                >
                  <div className='overflow-hidden'>
                    <img
                      className='h-56 w-full object-cover transition duration-500 group-hover:scale-105'
                      src={article.thumbnailURL || 'https://images.pexels.com/photos/15360540/pexels-photo-15360540.jpeg'}
                      alt={article.title || 'News article image'}
                    />
                  </div>
                  <div className='space-y-4 p-5 md:p-6'>
                    <div className='flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-sky-200'>
                      <span className='h-1.5 w-1.5 rounded-full bg-sky-300' />
                      Archive
                    </div>
                    <h2 className='text-xl font-semibold leading-snug text-white md:text-2xl'>{article.title}</h2>
                    <p className='text-sm leading-6 text-slate-300'>
                      {article.subtitle || article.excerpt || 'No description available.'}
                    </p>
                    <span className='primary-button w-fit'>
                      Read more
                      <svg className='h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 12H5m14 0-4 4m4-4-4-4' />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {articles.length === 0 ? (
              <div className='mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300'>No archives yet.</div>
            ) : null}
          </div>
            {user && user.role === 'admin' && (
          <button
            onClick={handleCreateArticleBtnClick}
            className='fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-700 text-2xl font-bold text-white shadow-2xl shadow-blue-950/30 transition hover:scale-105 md:bottom-8 md:right-8'
            aria-label='Create archive'
          >
            +
          </button>
            )}
        </div>
      </section>
    )
}

export default Archives