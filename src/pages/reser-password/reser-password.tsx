import ResetPasswordForm from "@/module/auth/reset-password-form";

const ResetPassword = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;
