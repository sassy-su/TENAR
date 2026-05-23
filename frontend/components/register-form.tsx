"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsPending(true);

    try {
      await registerUser({ username, password, full_name: fullName || undefined });
      setMessage("Registration successful. Redirecting to dashboard...");
      setTimeout(() => router.push("/"), 1200);
    } catch (error) {
      if (typeof error === "object" && error !== null && "message" in error) {
        setMessage(`Registration failed: ${(error as Error).message}`);
      } else {
        setMessage("Registration failed. Please choose a different username.");
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="panel auth-form" onSubmit={handleSubmit}>
      <label>
        Username
        <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="newuser" required />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
          minLength={8}
        />
      </label>

      <label>
        Full name
        <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Jane Doe" />
      </label>

      <button className="primary-button" type="submit" disabled={isPending}>
        {isPending ? "Registering..." : "Create account"}
      </button>
      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
