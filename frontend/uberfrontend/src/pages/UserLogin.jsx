import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'




const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ showPassword, setShowPassword ] = useState(false)
  const [ isSubmitting, setIsSubmitting ] = useState(false)
  const [ errors, setErrors ] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { user, setUser } = React.useContext(UserDataContext)

  const isValidEmail = useMemo(() => {
    if (!email) return false
    return /\S+@\S+\.\S+/.test(email)
  }, [email])

  const isFormValid = isValidEmail && email.length >= 10 && password.length >= 8

  const submitHandler = async (e) => {
    e.preventDefault()

    const nextErrors = { email: '', password: '' }
    if (!isValidEmail) nextErrors.email = 'Enter a valid email address'
    if (email.length < 10) nextErrors.email = 'Email must be at least 10 characters'
    if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters'
    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) return

    try {
      setIsSubmitting(true)
      
      const userData = {
        email: email,
        password: password
      }

  const response = await axios.post(`${BASE_URL}/user/login`, userData)

      if (response.status === 200) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
        
        // Clear form on success
        setEmail('')
        setPassword('')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.response?.status === 401) {
        alert('Invalid email or password')
      } else if (error.response?.status === 400) {
        alert('Please check your input and try again')
      } else if (error.code === 'ERR_NETWORK' || error.message?.toLowerCase().includes('network')) {
        alert(`Network error: could not reach backend at ${BASE_URL}`)
      } else {
        alert('Login failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-16 mb-10' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />

        <form onSubmit={submitHandler} noValidate>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            className={`bg-[#eeeeee] rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base outline-none focus:ring-2 transition ${email && (!isValidEmail || email.length < 10) ? 'ring-2 ring-red-400 border-red-400' : 'focus:ring-black/30'} mb-1`}
            type="email"
            placeholder='email@example.com (min 10 chars)'
            aria-invalid={email && !isValidEmail}
          />
          {email && (!isValidEmail || email.length < 10) && (
            <p className='text-sm text-red-500 mb-5'>{errors.email || 'Invalid email format or too short'}</p>
          )}
          {!email && <div className='h-5 mb-2'></div>}

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <div className='relative'>
            <input
              className={`bg-[#eeeeee] rounded-lg px-4 py-2 pr-12 border w-full text-lg placeholder:text-base outline-none focus:ring-2 transition ${password && password.length < 8 ? 'ring-2 ring-red-400 border-red-400' : 'focus:ring-black/30'}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              required
              type={showPassword ? 'text' : 'password'}
              placeholder='password (min 8 chars)'
              aria-invalid={!!errors.password}
            />
            <button
              type='button'
              onClick={() => setShowPassword(s => !s)}
              className='absolute inset-y-0 right-0 px-3 text-sm text-gray-600 hover:text-black active:scale-95'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {password && password.length < 8 && (
            <p className='text-sm text-red-500 mt-1 mb-4'>{errors.password || 'Use 8+ characters'}</p>
          )}
          {!password && <div className='h-5 mb-2'></div>}

          <button
            disabled={!isFormValid || isSubmitting}
            className={`bg-[#111] text-white font-semibold rounded-lg px-4 py-2 w-full text-lg placeholder:text-base transition-all mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-black/40 active:scale-[0.98] ${(!isFormValid || isSubmitting) ? 'opacity-60 cursor-not-allowed' : 'hover:bg-black'}`}
          >
            {isSubmitting ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className='text-center'>New here? <Link to='/signup' className='text-blue-600 hover:underline'>Create new Account</Link></p>
      </div>
      <div>
        <Link
          to='/captainlogin'
          className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base transition-colors hover:bg-[#0ea35a] active:scale-[0.99]'
        >Sign in as Captain</Link>
      </div>
    </div>
  )
}
    
export default UserLogin


