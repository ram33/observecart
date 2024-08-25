import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>ObserveCart</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                ObserveCart
              </Link>
              {/* <Link href="/products" className="ml-6 flex items-center text-gray-700 hover:text-gray-900">
                Products
              </Link> */}
            </div>
            <div className="flex items-center">
              {user ? (
                <>
                  <span className="mr-4">Welcome, {user.username}</span>
                  <Link href="/cart" className="mr-4">
                    Cart
                  </Link>
                  <button onClick={handleLogout} className="text-red-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-blue-600 mr-4">
                    Login
                  </Link>
                  <Link href="/register" className="text-green-600">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}