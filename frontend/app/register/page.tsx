import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <main className="shell">
      <section className="panel full">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Create an account</p>
            <h1>Register for TENAR</h1>
          </div>
        </div>
        <p>Register a new user to access the compliance screening dashboard.</p>
        <RegisterForm />
      </section>
    </main>
  );
}
