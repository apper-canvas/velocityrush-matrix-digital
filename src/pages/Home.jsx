import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-neon"
            >
              <ApperIcon name="Car" className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
            >
              <ApperIcon name="Zap" className="w-4 h-4 text-gray-900" />
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-6xl font-racing font-black neon-text mb-4">
            VelocityRush
          </h1>
          <motion.div
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"
            style={{ maxWidth: "200px" }}
          />
          <p className="text-surface-300 mt-4 font-racing">Initializing Racing Engine...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen"
      >
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 p-4 sm:p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="track-border">
                <div className="bg-gray-900 p-3 rounded-xl">
                  <ApperIcon name="Car" className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-racing font-black neon-text">
                VelocityRush
              </h1>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="speedometer">
                <div className="text-center">
                  <div className="text-xl font-racing text-secondary">MAX</div>
                  <div className="text-xs text-surface-400">SPEED</div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary opacity-10 rounded-full filter blur-3xl animate-pulse-neon"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary opacity-10 rounded-full filter blur-3xl animate-pulse-neon" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent opacity-5 rounded-full filter blur-3xl animate-spin-slow"></div>
          </div>

          {/* Racing Lines Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="road-lines h-full"></div>
          </div>

          <MainFeature />
        </main>

        {/* Footer */}
        <motion.footer
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 p-6 border-t border-surface-700"
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Trophy" className="w-5 h-5 text-accent" />
                <span className="text-surface-300 font-racing">High-Performance Racing</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Gamepad2" className="w-5 h-5 text-secondary" />
                <span className="text-surface-300 font-racing">Keyboard Controls</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Timer" className="w-5 h-5 text-primary" />
                <span className="text-surface-300 font-racing">Real-Time Racing</span>
              </div>
            </div>
            <div className="mt-6 text-surface-500 text-sm font-racing">
              © 2024 VelocityRush. Built for Speed.
            </div>
          </div>
        </motion.footer>
      </motion.div>
    </AnimatePresence>
  )
}