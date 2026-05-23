import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="shell">
      <section className="panel full">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Sign in</p>
            <h1>Login to TENAR</h1>
          </div>
        </div>
        <p>Use your account credentials to access the compliance screening dashboard.</p>
        <LoginForm />
      </section>
    </main>
  );
}
