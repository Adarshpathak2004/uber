import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const[captainData,setCaptainData]=useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })

  // ✅ Check valid email
  const isValidEmail = useMemo(() => {
    if (!email) return false
    return /\S+@\S+\.\S+/.test(email)
  }, [email])

  const isFormValid = isValidEmail && password.length >= 6

  // ✅ Handle form submit
  const submitHandler = async (e) => {
    e.preventDefault()
    setCaptainData({
        email:email,
        password:password
    })

    const nextErrors = { email: '', password: '' }
    if (!isValidEmail) nextErrors.email = 'Enter a valid email address'
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters'
    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) return

    try {
      setIsSubmitting(true)
      // TODO: Integrate your captain login API call here
      await new Promise((resolve) => setTimeout(resolve, 700))
      alert('Captain login successful!')

      // clear form on success
      setEmail('')
      setPassword('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
          alt="Captain logo"
        />

        <form onSubmit={submitHandler} noValidate>
          <h3 className="text-lg font-medium mb-2">Captain Email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`bg-[#eeeeee] rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base outline-none focus:ring-2 transition ${
              email && !isValidEmail
                ? 'ring-2 ring-red-400 border-red-400'
                : 'focus:ring-black/30'
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

          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <div className="relative">
            <input
              className="bg-[#eeeeee] rounded-lg px-4 py-2 pr-12 border w-full text-lg placeholder:text-base outline-none focus:ring-2 focus:ring-black/30 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="password"
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-0 px-3 text-sm text-gray-600 hover:text-black active:scale-95"
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
            className={`bg-[#111] text-white font-semibold rounded-lg px-4 py-2 w-full text-lg placeholder:text-base transition-all mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-black/40 active:scale-[0.98] ${
              !isFormValid || isSubmitting
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-black'
            }`}
          >
            {isSubmitting ? 'Signing in…' : 'Login as Captain'}
          </button>
        </form>

        <p className="text-center">
          New here?{' '}
          <Link
            to="/captainsignup"
            className="text-blue-600 hover:underline"
          >
            Create Captain Account
          </Link>
        </p>
      </div>

      <div>
        <Link
          to="/login"
          className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base transition-colors hover:bg-[#0ea35a] active:scale-[0.99]"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  )
}

export default CaptainLogin
