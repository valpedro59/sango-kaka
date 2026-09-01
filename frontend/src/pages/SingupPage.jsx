import SignupForm from "../components/auth/SinupForm";
function SignupPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <main className="flex min-h-screen items-center justify-center px-5 py-10">
        <SignupForm />
      </main>
    </div>
  );
}

export default SignupPage;