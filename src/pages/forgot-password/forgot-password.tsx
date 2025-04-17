import ForgotPasswordForm from '@/module/auth/forgot-password-form';

const ForgotPassword = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPassword;