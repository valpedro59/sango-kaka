import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <main className="flex min-h-screen items-center justify-center px-5 py-10">
        <LoginForm />
      </main>
    </div>
  );
}

export default LoginPage;