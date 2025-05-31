import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-4"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <ApperIcon name="Car" className="w-24 h-24 mx-auto text-primary" />
        </motion.div>
        
        <h1 className="text-6xl sm:text-8xl font-racing font-black neon-text mb-4">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-racing text-surface-200 mb-6">
          Race Track Not Found
        </h2>
        
        <p className="text-surface-400 mb-8 max-w-md mx-auto">
          Looks like you've taken a wrong turn on the racing circuit. 
          Let's get you back to the starting line.
        </p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="racing-button inline-flex items-center space-x-2"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Return to Race</span>
          </motion.button>
        </Link>
        
        <div className="mt-12 flex justify-center space-x-6">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            className="w-3 h-3 bg-primary rounded-full"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="w-3 h-3 bg-secondary rounded-full"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            className="w-3 h-3 bg-accent rounded-full"
          />
        </div>
      </motion.div>
    </div>
  )
}