import { SignInForm } from "../_components/signin-form"

interface SignInPageProps {
  searchParams: {
    callbackUrl: string
  }
}
const SignInPage = ({
  searchParams: { callbackUrl }
}: SignInPageProps) => {
  // console.log(callbackUrl)
  return (
    <section className="w-full">
      <SignInForm callbackUrl={callbackUrl || "/boards"} />
    </section>
  )
}

export default SignInPage