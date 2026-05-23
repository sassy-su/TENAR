"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsPending(true);

    try {
      await loginUser({ username, password });
      setMessage("Login successful. Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch {
      setMessage("Login failed. Check your username and password.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="panel auth-form" onSubmit={handleSubmit}>
      <label>
        Username
        <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="admin" required />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
        />
      </label>

      <button className="primary-button" type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </button>
      {message ? <p className="form-message">{message}</p> : null}
    </form>
  );
}
