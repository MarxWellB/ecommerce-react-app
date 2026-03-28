const USERS = [
  { email: 'demo@nova.com', password: 'demo123', name: 'Demo User' },
  { email: 'admin@nova.com', password: 'admin123', name: 'Admin' },
]

export async function loginUser({ email, password }) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const user = USERS.find(
    (u) => u.email === email && u.password === password
  )

  if (!user) {
    throw new Error('Credenciales incorrectas')
  }

  return {
    token: `token-${Date.now()}`,
    user: {
      email: user.email,
      name: user.name,
    },
  }
}