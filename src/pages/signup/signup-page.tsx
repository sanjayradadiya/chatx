import { SignUpForm } from '@/module/auth/signup-form'
import Header from '@/components/layout/Header'

const SignUpPage = () => {
  return (
    <div className="flex flex-col min-h-svh bg-muted">
      <Header isAuthPage={false} />
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}

export default SignUpPage