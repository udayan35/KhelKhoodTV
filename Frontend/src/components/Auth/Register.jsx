import {
  useState,
} from "react";

import API from "../../api/axios";
import { useNavigate }
from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


function Register() {

  const navigate =
  useNavigate();

  const { setUser } = useAuth();

  const [name, setName] =
  useState("");

  const [email, setEmail] =
  useState("");

  const [password, setPassword] =
  useState("");

  const [error, setError] =
  useState("");


  const handleSubmit =
  async (e) => {

    e.preventDefault();

    try {

      const res =
      await API.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      // store user in context + localStorage
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      navigate("/");

    } catch (err) {

      setError(
        err.response.data.message
      );
    }
  };


  return (
    <section className='page-section'>
      <div className='page-container'>
        <div className='grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]'>
          <aside className='surface-card hidden rounded-[2rem] p-8 lg:flex lg:flex-col lg:justify-between'>
            <div>
              <p className='page-kicker'>Create account</p>
              <h1 className='page-title mt-3'>Register</h1>
              <p className='page-copy mt-4 max-w-md'>Set up your profile once and manage the site from a clean, responsive interface.</p>
            </div>
            <div className='mt-8 grid gap-3 text-sm text-slate-300'>
              <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>Publish articles and interviews</div>
              <div className='rounded-2xl border border-white/10 bg-white/5 p-4'>Keep the same experience on mobile and desktop</div>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className='form-shell rounded-[2rem] p-6 md:p-8'>
            <p className='page-kicker'>Join the newsroom</p>
            <h2 className='page-title mt-3 text-3xl'>Register</h2>
            <p className='page-copy mt-3'>Create your account to start publishing.</p>

            {error ? (
              <p className='mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100'>
                {error}
              </p>
            ) : null}

            <div className='mt-6 grid gap-4'>
              <label className='form-label'>
                <span>Name</span>
                <input
                  type='text'
                  placeholder='Name'
                  className='form-input'
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className='form-label'>
                <span>Email</span>
                <input
                  type='email'
                  placeholder='Email'
                  className='form-input'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className='form-label'>
                <span>Password</span>
                <input
                  type='password'
                  placeholder='Password'
                  className='form-input'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>

            <button className='primary-button mt-6 w-full'>
              Register
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;