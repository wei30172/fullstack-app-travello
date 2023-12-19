import { signUpWithCredentials } from "@/lib/actions/auth.actions"
import { SignUpForm } from "@/components/form/signup-form"

const SignUpPage = () => {
  return (
    <div className="w-full">
      <SignUpForm
        signUpWithCredentials={signUpWithCredentials}
      />
    </div>
  )
}

export default SignUpPage