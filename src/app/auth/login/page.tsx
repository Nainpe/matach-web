// src/app/auth/login/page.tsx

import LoginForm from "../ui/Login";

export default function LoginPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <LoginForm />
    </div>
  );
}
