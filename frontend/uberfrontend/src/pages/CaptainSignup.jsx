import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captainData, setCaptainData] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })

  // ✅ Email validation
  const isValidEmail = useMemo(() => {
    if (!email) return false
    return /\S+@\S+\.\S+/.test(email)
  }, [email])

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    isValidEmail &&
    password.length >= 6

  // ✅ Handle form submit
  const submitHandler = async (e) => {
    e.preventDefault()

    const nextErrors = { email: '', password: '' }
    if (!isValidEmail) nextErrors.email = 'Enter a valid email address'
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters'
    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) return

    try {
      setIsSubmitting(true)

      // Save captain data (for demo purposes)
      setCaptainData({ firstName, lastName, email, password })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 700))
      alert('Captain Signup successful!')

      // Clear form
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="p-7 h-screen flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <img
              className="w-12"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
              alt="Captain Signup"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-sky-600/80">Captain</p>
              <h1 className="text-2xl font-bold text-sky-700">Create your captain account</h1>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md border border-sky-100">
            <div className="p-5">
              <form onSubmit={submitHandler} noValidate>
                {/* First and Last Name Fields */}
                <div className="flex gap-3 mb-4">
                  <input
                    required
                    className="bg-[#f5f7fb] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-300 border-sky-200 transition"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    required
                    className="bg-[#f5f7fb] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-300 border-sky-200 transition"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                {/* Email Field */}
                <label className="text-sm font-medium text-slate-700">Captain Email</label>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 bg-[#f5f7fb] rounded-lg px-4 py-2 border w-full text-lg text-black placeholder:text-slate-400 outline-none focus:ring-2 transition ${
                    email && !isValidEmail
                      ? 'ring-2 ring-red-400 border-red-400'
                      : 'focus:ring-sky-300 border-sky-200'
                  } mb-1`}
                  type="email"
                  placeholder="captain@example.com"
                  aria-invalid={email && !isValidEmail}
                />
                {email && !isValidEmail && (
                  <p className="text-sm text-red-500 mb-5">
                    {errors.email || 'Invalid email format'}
                  </p>
                )}
                {!email && <div className="h-5 mb-2"></div>}

                {/* Password Field */}
                <label className="text-sm font-medium text-slate-700">Create Password</label>
                <div className="relative mt-1">
                  <input
                    className="bg-[#f5f7fb] text-black rounded-lg px-4 py-2 pr-12 border w-full text-lg placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-300 border-sky-200 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 px-3 text-sm text-slate-600 hover:text-sky-700 active:scale-95"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {password && password.length < 6 && (
                  <p className="text-sm text-red-500 mt-1 mb-4">
                    {errors.password || 'Use 6+ characters'}
                  </p>
                )}
                {!password && <div className="h-5 mb-2"></div>}

                <button
                  disabled={!isFormValid || isSubmitting}
                  className={`bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold rounded-lg px-4 py-2 w-full text-lg transition-all mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-sky-300 active:scale-[0.98] ${
                    !isFormValid || isSubmitting
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:from-sky-700 hover:to-indigo-700'
                  }`}
                >
                  {isSubmitting ? 'Signing Up…' : 'Sign Up as Captain'}
                </button>

                <p className="text-center text-slate-600">
                  Already have an account?{' '}
                  <Link to="/captainlogin" className="text-sky-700 hover:underline">
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>

        <div>
          <Link
            to="/signup"
            className="bg-white border border-sky-200 text-sky-700 flex items-center justify-center font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg transition-colors hover:bg-sky-50 active:scale-[0.99]"
          >
            Register as User
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup
