import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiAlertTriangle } from 'react-icons/fi'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <FiAlertTriangle size={60} className="text-yellow-500" />

        <h1 className="text-4xl md:text-5xl font-bold">404</h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Oops! The page you're looking for doesn't exist.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="mt-6 px-5 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Go Back Home
        </motion.button>
      </motion.div>
    </div>
  )
}
