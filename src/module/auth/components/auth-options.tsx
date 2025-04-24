import { Button } from "@/components/ui/button";

const AuthOptions = () => {
  return (
    <>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Button variant="outline" type="button" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 0C5.373 0 0 5.373 0 12c0 5.304 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577 0-.287-.011-1.045-.016-2.052-3.338.724-4.042-1.607-4.042-1.607-.546-1.384-1.333-1.754-1.333-1.754-1.089-.743.083-.728.083-.728 1.205.085 1.838 1.237 1.838 1.237 1.07 1.83 2.807 1.301 3.49.995.108-.775.419-1.301.762-1.601-2.665-.303-5.467-1.333-5.467-5.933 0-1.313.469-2.386 1.236-3.22-.124-.303-.536-1.53.117-3.185 0 0 1.008-.322 3.303 1.227.957-.266 1.986-.399 3.006-.404 1.02.005 2.049.138 3.006.404 2.295-1.549 3.303-1.227 3.303-1.227.653 1.655.241 2.882.118 3.185.767.834 1.236 1.907 1.236 3.22 0 4.61-2.805 5.63-5.475 5.925.43.37.815 1.096.815 2.209 0 1.594-.014 2.878-.014 3.26 0 .319.19.694.798.577C20.565 21.8 24 17.304 24 12c0-6.627-5.373-12-12-12z"
              fill="currentColor"
            />
          </svg>
          <span className="sr-only">Login with Github</span>
        </Button>
        <Button variant="outline" type="button" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          <span className="sr-only">Login with Google</span>
        </Button>
        <Button variant="outline" type="button" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z" />
          </svg>
          <span className="sr-only">Login with Facebook</span>
        </Button>
      </div>
    </>
  );
};

export default AuthOptions;
