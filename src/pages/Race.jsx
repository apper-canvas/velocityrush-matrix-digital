import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const DEFAULT_CAR = {
  id: 'thunderbolt',
  name: 'Thunderbolt X1',
  speed: 95,
  acceleration: 85,
  handling: 90
}

const DEFAULT_TRACK = {
  id: 'neon-city',
  name: 'Neon City Circuit',
  difficulty: 'Easy',
  laps: 3
}

export default function Race() {
  const navigate = useNavigate()
  const [raceConfig, setRaceConfig] = useState(() => {
    const saved = localStorage.getItem('raceConfig')
    return saved ? JSON.parse(saved) : { selectedCar: DEFAULT_CAR, selectedTrack: DEFAULT_TRACK }
  })

  const [raceData, setRaceData] = useState({
    currentLap: 1,
    currentSpeed: 0,
    position: { x: 0, y: 0 },
    raceTime: 0,
    racePosition: 1,
    isFinished: false
  })

  const [keys, setKeys] = useState({})
  const [isRacing, setIsRacing] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [aiCars, setAiCars] = useState([
    { id: 1, x: -50, y: 100, speed: 45 },
    { id: 2, x: 30, y: 150, speed: 42 },
    { id: 3, x: -20, y: 200, speed: 48 }
  ])

  // Race countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
        if (countdown === 1) {
          setIsRacing(true)
          toast.success('Race started! Use WASD or arrow keys to control.')
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }))
    }

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Racing physics simulation
  useEffect(() => {
    if (!isRacing || raceData.isFinished) return

    const gameLoop = setInterval(() => {
      setRaceData(prev => {
        let newSpeed = prev.currentSpeed
        let newPosition = { ...prev.position }

        // Handle acceleration/deceleration
        if (keys['w'] || keys['arrowup']) {
          newSpeed = Math.min(raceConfig.selectedCar.speed, newSpeed + raceConfig.selectedCar.acceleration * 0.03)
        } else if (keys['s'] || keys['arrowdown']) {
          newSpeed = Math.max(0, newSpeed - raceConfig.selectedCar.acceleration * 0.05)
        } else {
          newSpeed = Math.max(0, newSpeed - 2) // Natural deceleration
        }

        // Handle steering with speed-based turning
        const turnRate = (newSpeed / raceConfig.selectedCar.speed) * raceConfig.selectedCar.handling * 0.2
        if (keys['a'] || keys['arrowleft']) {
          newPosition.x = Math.max(-200, newPosition.x - turnRate)
        }
        if (keys['d'] || keys['arrowright']) {
          newPosition.x = Math.min(200, newPosition.x + turnRate)
        }

        // Update race time
        const newRaceTime = prev.raceTime + 0.1

        // Simulate forward movement for lap calculation
        newPosition.y = (newPosition.y + newSpeed * 0.1) % 1000

        // Check lap completion (every 100 units of forward progress)
        let newLap = prev.currentLap
        if (newPosition.y < prev.position.y && newSpeed > 10) {
          if (newLap < raceConfig.selectedTrack.laps) {
            newLap += 1
            toast.success(`Lap ${newLap} started!`)
          } else if (newLap === raceConfig.selectedTrack.laps && !prev.isFinished) {
            toast.success('Race completed!')
            return { ...prev, isFinished: true }
          }
        }

        return {
          ...prev,
          currentSpeed: newSpeed,
          position: newPosition,
          raceTime: newRaceTime,
          currentLap: newLap
        }
      })

      // Update AI cars
      setAiCars(prev => prev.map(car => ({
        ...car,
        x: car.x + (Math.random() - 0.5) * 2,
        y: (car.y + car.speed * 0.05) % 1000,
        speed: car.speed + (Math.random() - 0.5) * 0.5
      })))
    }, 100)

    return () => clearInterval(gameLoop)
  }, [isRacing, keys, raceConfig, raceData.isFinished])

  // Handle race completion
  useEffect(() => {
    if (raceData.isFinished) {
      const timer = setTimeout(() => {
        localStorage.setItem('raceResults', JSON.stringify({
          time: raceData.raceTime,
          position: raceData.racePosition,
          laps: raceConfig.selectedTrack.laps,
          car: raceConfig.selectedCar.name,
          track: raceConfig.selectedTrack.name
        }))
        navigate('/')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [raceData.isFinished, raceData.raceTime, raceData.racePosition, raceConfig, navigate])

  const exitRace = useCallback(() => {
    navigate('/')
  }, [navigate])

  if (countdown > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            key={countdown}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-8xl font-racing font-black neon-text mb-8"
          >
            {countdown}
          </motion.div>
          <h2 className="text-2xl font-racing text-white mb-4">Get Ready!</h2>
          <p className="text-surface-300 font-racing">
            {raceConfig.selectedCar.name} on {raceConfig.selectedTrack.name}
          </p>
        </motion.div>
      </div>
    )
  }

  if (raceData.isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
          >
            <ApperIcon name="Trophy" className="w-24 h-24 mx-auto text-accent mb-6" />
          </motion.div>
          <h2 className="text-4xl font-racing font-black neon-text mb-4">Race Complete!</h2>
          <div className="text-xl text-surface-300 font-racing mb-6">
            Final Time: {raceData.raceTime.toFixed(2)}s
          </div>
          <p className="text-surface-400">Returning to menu...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* HUD */}
      <div className="fixed top-0 left-0 right-0 z-20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="racing-card p-3">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-racing text-secondary">
                  {Math.floor(raceData.currentSpeed)}
                </div>
                <div className="text-xs text-surface-400">KM/H</div>
              </div>
            </div>
            <div className="racing-card p-3">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-racing text-primary">
                  {raceData.currentLap}/{raceConfig.selectedTrack.laps}
                </div>
                <div className="text-xs text-surface-400">LAPS</div>
              </div>
            </div>
            <div className="racing-card p-3">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-racing text-accent">
                  {raceData.raceTime.toFixed(1)}s
                </div>
                <div className="text-xs text-surface-400">TIME</div>
              </div>
            </div>
            <div className="racing-card p-3">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-racing text-white">
                  {raceData.racePosition}st
                </div>
                <div className="text-xs text-surface-400">POSITION</div>
              </div>
            </div>
            <div className="racing-card p-3">
              <button
                onClick={exitRace}
                className="w-full h-full flex items-center justify-center text-surface-300 hover:text-white transition-colors"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Race View */}
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Track Visualization */}
          <div className="racing-card h-96 sm:h-[500px] relative overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-b from-surface-700 to-surface-900"></div>
            
            {/* Animated track lines */}
            <motion.div
              animate={{ 
                backgroundPositionY: [0, 100] 
              }}
              transition={{ 
                duration: raceData.currentSpeed > 0 ? 200 / Math.max(raceData.currentSpeed, 1) : 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  180deg,
                  transparent 0px,
                  transparent 40px,
                  #fff 40px,
                  #fff 60px,
                  transparent 60px,
                  transparent 100px
                )`
              }}
            />
            
            {/* Side barriers */}
            <div className="absolute left-8 top-0 bottom-0 w-2 bg-gradient-to-b from-primary to-primary-dark opacity-60"></div>
            <div className="absolute right-8 top-0 bottom-0 w-2 bg-gradient-to-b from-primary to-primary-dark opacity-60"></div>
            
            {/* AI opponent cars */}
            {aiCars.map(car => (
              <motion.div
                key={car.id}
                animate={{
                  x: car.x,
                  y: car.y % 500
                }}
                className="absolute w-6 h-12 bg-gradient-to-b from-surface-400 to-surface-600 rounded-lg shadow-lg"
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: '10%'
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <ApperIcon name="Car" className="w-3 h-3 text-white transform rotate-90" />
                </div>
              </motion.div>
            ))}
            
            {/* Player car */}
            <motion.div
              animate={{
                x: raceData.position.x,
                y: raceData.currentSpeed > 0 ? Math.sin(raceData.raceTime * 3) * 3 : 0,
                rotate: raceData.position.x * 0.1
              }}
              className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10 ${
                raceData.currentSpeed > 20 ? 'car-engine' : ''
              }`}
            >
              <div className="w-8 h-16 bg-gradient-to-b from-primary to-primary-dark rounded-lg shadow-neon flex items-center justify-center relative">
                <ApperIcon name="Car" className="w-5 h-5 text-white transform rotate-90" />
                
                {/* Speed trails */}
                {raceData.currentSpeed > 40 && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-8 bg-gradient-to-t from-accent to-transparent opacity-70"></div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Speed effect overlay */}
            {raceData.currentSpeed > 50 && (
              <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-t from-transparent via-primary to-transparent opacity-10"
              />
            )}

            {/* Lap progress indicator */}
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-surface-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  animate={{ 
                    width: `${((raceData.position.y % 1000) / 1000) * 100}%` 
                  }}
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
              <div className="text-xs text-surface-300 text-center mt-1 font-racing">
                Lap Progress
              </div>
            </div>
          </div>

          {/* Controls Display */}
          <div className="racing-card p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className={`p-3 rounded-lg border-2 transition-all duration-150 ${
                keys['w'] || keys['arrowup'] ? 'border-primary bg-primary bg-opacity-20 scale-105' : 'border-surface-600'
              }`}>
                <ApperIcon name="ArrowUp" className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-xs font-racing text-surface-300 text-center">Accelerate</div>
              </div>
              <div className={`p-3 rounded-lg border-2 transition-all duration-150 ${
                keys['s'] || keys['arrowdown'] ? 'border-secondary bg-secondary bg-opacity-20 scale-105' : 'border-surface-600'
              }`}>
                <ApperIcon name="ArrowDown" className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <div className="text-xs font-racing text-surface-300 text-center">Brake</div>
              </div>
              <div className={`p-3 rounded-lg border-2 transition-all duration-150 ${
                keys['a'] || keys['arrowleft'] ? 'border-accent bg-accent bg-opacity-20 scale-105' : 'border-surface-600'
              }`}>
                <ApperIcon name="ArrowLeft" className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-xs font-racing text-surface-300 text-center">Turn Left</div>
              </div>
              <div className={`p-3 rounded-lg border-2 transition-all duration-150 ${
                keys['d'] || keys['arrowright'] ? 'border-accent bg-accent bg-opacity-20 scale-105' : 'border-surface-600'
              }`}>
                <ApperIcon name="ArrowRight" className="w-6 h-6 mx-auto mb-2 text-accent" />
                <div className="text-xs font-racing text-surface-300 text-center">Turn Right</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}