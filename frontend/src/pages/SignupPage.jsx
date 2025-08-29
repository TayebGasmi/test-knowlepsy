import {Link, useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import {authApi} from '../store/api/authApi'
import {signupSchema} from '../utils/validation'
import {LoadingSpinner} from '../components/LoadingSpinner'
import {ErrorMessage} from '../components/ErrorMessage'

export const SignupPage = () => {
  const navigate = useNavigate()
  const [signup, {isLoading, error}] = authApi.useSignupMutation()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data) => {
    try {
      await signup(data).unwrap()
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.data?.message || 'Signup failed')
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
                <ErrorMessage
                    message={error?.data?.message || 'An error occurred during signup'}
                />
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="form-label">
                  Full name
                </label>
                <input
                    {...register('name')}
                    type="text"
                    autoComplete="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                    <p id="name-error" className="form-error">
                      {errors.name.message}
                    </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className="form-input"
                    placeholder="Enter your email"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                    <p id="email-error" className="form-error">
                      {errors.email.message}
                    </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                    {...register('password')}
                    type="password"
                    autoComplete="new-password"
                    className="form-input"
                    placeholder="Create a password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password && (
                    <p id="password-error" className="form-error">
                      {errors.password.message}
                    </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 6 characters long
                </p>
              </div>
            </div>

            <div>
              <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex justify-center"
              >
                {isLoading ? (
                    <>
                      <LoadingSpinner size="small" className="mr-2"/>
                      Creating account...
                    </>
                ) : (
                    'Create account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  )
}
