import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '', firstName: '', lastName: '' })
  const navigate = useNavigate()
  const { user, setUser } = React.useContext(UserDataContext)

  const isValidEmail = useMemo(() => {
    if (!email) return false
    return /\S+@\S+\.\S+/.test(email)
  }, [email])

  const isFormValid =
    firstName.trim().length >= 5 &&
    lastName.trim().length >= 5 &&
    isValidEmail &&
    email.length >= 10 &&
    password.length >= 8

  const submitHandler = async (e) => {
    e.preventDefault()

    const nextErrors = { email: '', password: '', firstName: '', lastName: '' }
    if (firstName.trim().length < 5) nextErrors.firstName = 'First name must be at least 5 characters'
    if (lastName.trim().length < 5) nextErrors.lastName = 'Last name must be at least 5 characters'
    if (!isValidEmail) nextErrors.email = 'Enter a valid email address'
    if (email.length < 10) nextErrors.email = 'Email must be at least 10 characters'
    if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters'
    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.password || nextErrors.firstName || nextErrors.lastName) return

    try {
      setIsSubmitting(true)

      const newUser = {
        fullname: { firstname:firstName, 
            lastname:lastName },
        email,
        password
      }

      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, newUser);




      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        navigate('/captain-home')

        await new Promise((resolve) => setTimeout(resolve, 700))
        alert('User Signup successful!')

        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
      }
    } catch (error) {
      console.error('Signup error:', error)
      if (error.response?.status === 400) {
        alert('Please check your input and try again')
      } else if (error.response?.status === 409) {
        alert('Email already exists. Please use a different email.')
      } else {
        alert('Signup failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 to-white">
      <div className="p-7 h-screen flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <img
              className="w-12"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
              alt="User Signup"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-fuchsia-600/80">Rider</p>
              <h1 className="text-2xl font-bold text-fuchsia-700">Create your rider account</h1>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md border border-fuchsia-100">
            <div className="p-5">
              <form onSubmit={submitHandler} noValidate>
                {/* First and Last Name Fields */}
                <div className="flex gap-3 mb-4">
                  <div className="w-1/2">
                    <input
                      required
                      className={`bg-[#fbf5fa] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-slate-400 outline-none focus:ring-2 transition ${
                        firstName && firstName.trim().length < 5
                          ? 'ring-2 ring-red-400 border-red-400'
                          : 'focus:ring-fuchsia-300 border-fuchsia-200'
                      }`}
                      type="text"
                      placeholder="First name (min 5 chars)"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    {firstName && firstName.trim().length < 5 && (
                      <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <input
                      required
                      className={`bg-[#fbf5fa] w-full rounded-lg px-4 py-2 border text-lg placeholder:text-slate-400 outline-none focus:ring-2 transition ${
                        lastName && lastName.trim().length < 5
                          ? 'ring-2 ring-red-400 border-red-400'
                          : 'focus:ring-fuchsia-300 border-fuchsia-200'
                      }`}
                      type="text"
                      placeholder="Last name (min 5 chars)"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    {lastName && lastName.trim().length < 5 && (
                      <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <label className="text-sm font-medium text-slate-700">User Email</label>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 bg-[#fbf5fa] rounded-lg px-4 py-2 border w-full text-lg placeholder:text-slate-400 outline-none focus:ring-2 transition ${
                    email && (!isValidEmail || email.length < 10)
                      ? 'ring-2 ring-red-400 border-red-400'
                      : 'focus:ring-fuchsia-300 border-fuchsia-200'
                  } mb-1`}
                  type="email"
                  placeholder="user@example.com (min 10 chars)"
                  aria-invalid={email && (!isValidEmail || email.length < 10)}
                />
                {email && (!isValidEmail || email.length < 10) && (
                  <p className="text-sm text-red-500 mb-5">
                    {errors.email || 'Invalid email format or too short'}
                  </p>
                )}
                {!email && <div className="h-5 mb-2"></div>}

                <label className="text-sm font-medium text-slate-700">Create Password</label>
                <div className="relative mt-1">
                  <input
                    className={`bg-[#fbf5fa] rounded-lg px-4 py-2 pr-12 border w-full text-lg placeholder:text-slate-400 outline-none focus:ring-2 transition ${
                      password && password.length < 8
                        ? 'ring-2 ring-red-400 border-red-400'
                        : 'focus:ring-fuchsia-300 border-fuchsia-200'
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password (min 8 chars)"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 px-3 text-sm text-slate-600 hover:text-fuchsia-700 active:scale-95"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {password && password.length < 8 && (
                  <p className="text-sm text-red-500 mt-1 mb-4">
                    {errors.password || 'Use 8+ characters'}
                  </p>
                )}
                {!password && <div className="h-5 mb-2"></div>}

                <button
                  disabled={!isFormValid || isSubmitting}
                  className={`bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold rounded-lg px-4 py-2 w-full text-lg transition-all mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 active:scale-[0.98] ${
                    !isFormValid || isSubmitting
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:from-fuchsia-700 hover:to-pink-700'
                  }`}
                >
                  {isSubmitting ? 'Signing Up…' : 'Sign Up as User'}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-slate-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-fuchsia-700 hover:underline">
              Login here
            </Link>
          </p>
        </div>

        <div>
          <Link
            to="/captainsignup"
            className="bg-white border border-fuchsia-200 text-fuchsia-700 flex items-center justify-center font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg transition-colors hover:bg-fuchsia-50 active:scale-[0.99]"
          >
            Register as Captain
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserSignup
