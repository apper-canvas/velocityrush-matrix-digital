import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const CARS = [
  {
    id: 'thunderbolt',
    name: 'Thunderbolt X1',
    speed: 95,
    acceleration: 85,
    handling: 90,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=200&fit=crop',
    unlocked: true
  },
  {
    id: 'viper',
    name: 'Neon Viper',
    speed: 88,
    acceleration: 92,
    handling: 85,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    unlocked: true
  },
  {
    id: 'phantom',
    name: 'Phantom Ghost',
    speed: 92,
    acceleration: 78,
    handling: 95,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=200&fit=crop',
    unlocked: false
  }
]

const TRACKS = [
  { id: 'neon-city', name: 'Neon City Circuit', difficulty: 'Easy', laps: 3, unlocked: true },
  { id: 'mountain-pass', name: 'Mountain Pass', difficulty: 'Medium', laps: 5, unlocked: true },
  { id: 'space-station', name: 'Space Station Omega', difficulty: 'Hard', laps: 7, unlocked: false }
]

export default function MainFeature() {
  const [gameState, setGameState] = useState('menu') // menu, car-select, track-select, racing, results
  const [selectedCar, setSelectedCar] = useState(CARS[0])
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0])
  const [raceData, setRaceData] = useState({
    currentLap: 1,
    currentSpeed: 0,
    position: { x: 0, y: 0 },
    raceTime: 0,
    bestLapTime: null
  })
  const [keys, setKeys] = useState({})
  const [isRacing, setIsRacing] = useState(false)

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

// Racing simulation
  useEffect(() => {
    if (!isRacing) return

    const gameLoop = setInterval(() => {
      setRaceData(prev => {
        let newSpeed = prev.currentSpeed
        let newPosition = { ...prev.position }

        // Handle acceleration/deceleration
        if (keys['w'] || keys['arrowup']) {
          newSpeed = Math.min(selectedCar.speed, newSpeed + selectedCar.acceleration * 0.02)
        } else if (keys['s'] || keys['arrowdown']) {
          newSpeed = Math.max(0, newSpeed - selectedCar.acceleration * 0.03)
        } else {
          newSpeed = Math.max(0, newSpeed - 1) // Natural deceleration
        }

        // Handle steering
        if (keys['a'] || keys['arrowleft']) {
          newPosition.x = Math.max(-150, newPosition.x - selectedCar.handling * 0.15)
        }
        if (keys['d'] || keys['arrowright']) {
          newPosition.x = Math.min(150, newPosition.x + selectedCar.handling * 0.15)
        }

        // Update race time
        const newRaceTime = prev.raceTime + 0.1

        // Check lap completion (simplified)
        let newLap = prev.currentLap
        if (newRaceTime > 0 && Math.floor(newRaceTime) % 30 === 0 && newRaceTime !== prev.raceTime) {
          if (newLap < selectedTrack.laps) {
            newLap += 1
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
    }, 100)

    return () => clearInterval(gameLoop)
  }, [isRacing, keys, selectedCar, selectedTrack])

  // Handle lap completion notifications and race finish
  useEffect(() => {
    if (!isRacing) return
    
    const checkRaceProgress = () => {
      if (raceData.raceTime > 0 && Math.floor(raceData.raceTime) % 30 === 0) {
        if (raceData.currentLap < selectedTrack.laps && raceData.currentLap > 1) {
          toast.success(`Lap ${raceData.currentLap} completed!`)
        } else if (raceData.currentLap >= selectedTrack.laps) {
          setIsRacing(false)
          setGameState('results')
          toast.success('Race completed!')
        }
      }
    }

    checkRaceProgress()
  }, [raceData.currentLap, raceData.raceTime, isRacing, selectedTrack.laps])

  const startRace = useCallback(() => {
    setGameState('racing')
    setIsRacing(true)
    setRaceData({
      currentLap: 1,
      currentSpeed: 0,
      position: { x: 0, y: 0 },
      raceTime: 0,
      bestLapTime: null
    })
    toast.success('Race started! Use WASD or arrow keys to control your car.')
  }, [])

  const selectCar = useCallback((car) => {
    if (!car.unlocked) {
      toast.error('This car is locked! Complete more races to unlock it.')
      return
    }
    setSelectedCar(car)
    toast.success(`${car.name} selected!`)
  }, [])

  const selectTrack = useCallback((track) => {
    if (!track.unlocked) {
      toast.error('This track is locked! Complete previous tracks to unlock it.')
      return
    }
    setSelectedTrack(track)
    toast.success(`${track.name} selected!`)
  }, [])

  const resetToMenu = useCallback(() => {
    setGameState('menu')
    setIsRacing(false)
  }, [])

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      >
        <div className="text-center mb-12">
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-racing font-black neon-text mb-6"
          >
            Ready to Race?
          </motion.h2>
          <p className="text-xl text-surface-300 max-w-2xl mx-auto font-racing">
            Choose your car, select a track, and burn rubber in the ultimate racing experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setGameState('car-select')}
            className="racing-card cursor-pointer group"
          >
            <div className="mb-4">
              <ApperIcon name="Car" className="w-16 h-16 text-primary group-hover:text-secondary transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-racing font-bold text-white mb-2">Select Car</h3>
            <p className="text-surface-300 mb-4">Choose from high-performance vehicles</p>
            <div className="flex items-center space-x-2 text-primary">
              <span className="font-racing">Current: {selectedCar.name}</span>
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setGameState('track-select')}
            className="racing-card cursor-pointer group"
          >
            <div className="mb-4">
              <ApperIcon name="MapPin" className="w-16 h-16 text-secondary group-hover:text-accent transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-racing font-bold text-white mb-2">Select Track</h3>
            <p className="text-surface-300 mb-4">Race on challenging circuits</p>
            <div className="flex items-center space-x-2 text-secondary">
              <span className="font-racing">Current: {selectedTrack.name}</span>
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={startRace}
            className="racing-card cursor-pointer group bg-gradient-to-br from-primary to-primary-dark"
          >
            <div className="mb-4">
              <ApperIcon name="Play" className="w-16 h-16 text-white group-hover:text-accent transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-racing font-bold text-white mb-2">Start Race</h3>
            <p className="text-white opacity-90 mb-4">Begin your racing adventure</p>
            <div className="flex items-center space-x-2 text-accent">
              <span className="font-racing">Let's Go!</span>
              <ApperIcon name="Zap" className="w-4 h-4" />
            </div>
          </motion.div>
        </div>

        {/* Race Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 racing-card"
        >
          <h3 className="text-2xl font-racing font-bold text-white mb-6 text-center">Race Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="speedometer mb-4">
                <div className="text-center">
                  <div className="text-lg font-racing text-primary">{selectedCar.speed}</div>
                  <div className="text-xs text-surface-400">SPEED</div>
                </div>
              </div>
              <div className="text-surface-300 font-racing">Max Speed</div>
            </div>
            <div className="text-center">
              <div className="speedometer mb-4">
                <div className="text-center">
                  <div className="text-lg font-racing text-secondary">{selectedCar.acceleration}</div>
                  <div className="text-xs text-surface-400">ACCEL</div>
                </div>
              </div>
              <div className="text-surface-300 font-racing">Acceleration</div>
            </div>
            <div className="text-center">
              <div className="speedometer mb-4">
                <div className="text-center">
                  <div className="text-lg font-racing text-accent">{selectedCar.handling}</div>
                  <div className="text-xs text-surface-400">HANDLE</div>
                </div>
              </div>
              <div className="text-surface-300 font-racing">Handling</div>
            </div>
            <div className="text-center">
              <div className="speedometer mb-4">
                <div className="text-center">
                  <div className="text-lg font-racing text-white">{selectedTrack.laps}</div>
                  <div className="text-xs text-surface-400">LAPS</div>
                </div>
              </div>
              <div className="text-surface-300 font-racing">Track Laps</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Car Selection Screen
  if (gameState === 'car-select') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-racing font-black neon-text">Select Your Car</h2>
          <button
            onClick={resetToMenu}
            className="racing-button bg-surface-700 hover:bg-surface-600 text-sm px-4 py-2"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CARS.map((car) => (
            <motion.div
              key={car.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => selectCar(car)}
              className={`racing-card cursor-pointer relative overflow-hidden ${
                selectedCar.id === car.id ? 'ring-2 ring-primary shadow-neon' : ''
              } ${!car.unlocked ? 'opacity-50' : ''}`}
            >
              {!car.unlocked && (
                <div className="absolute top-4 right-4 z-10">
                  <ApperIcon name="Lock" className="w-6 h-6 text-surface-400" />
                </div>
              )}
              
              <div className="relative h-32 sm:h-48 mb-4 rounded-xl overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              </div>

              <h3 className="text-xl sm:text-2xl font-racing font-bold text-white mb-4">{car.name}</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-surface-300 font-racing">Speed</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-surface-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${car.speed}%` }}
                      ></div>
                    </div>
                    <span className="text-primary font-racing text-sm w-8">{car.speed}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-surface-300 font-racing">Acceleration</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-surface-700 rounded-full h-2">
                      <div 
                        className="bg-secondary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${car.acceleration}%` }}
                      ></div>
                    </div>
                    <span className="text-secondary font-racing text-sm w-8">{car.acceleration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-surface-300 font-racing">Handling</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-surface-700 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${car.handling}%` }}
                      ></div>
                    </div>
                    <span className="text-accent font-racing text-sm w-8">{car.handling}</span>
                  </div>
                </div>
              </div>

              {selectedCar.id === car.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 left-4 bg-primary rounded-full p-2"
                >
                  <ApperIcon name="Check" className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setGameState('track-select')}
            className="racing-button"
          >
            Next: Select Track
            <ApperIcon name="ChevronRight" className="w-4 h-4 ml-2" />
          </button>
        </div>
      </motion.div>
    )
  }

  // Track Selection Screen
  if (gameState === 'track-select') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-racing font-black neon-text">Select Track</h2>
          <button
            onClick={() => setGameState('car-select')}
            className="racing-button bg-surface-700 hover:bg-surface-600 text-sm px-4 py-2"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRACKS.map((track) => (
            <motion.div
              key={track.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => selectTrack(track)}
              className={`racing-card cursor-pointer relative ${
                selectedTrack.id === track.id ? 'ring-2 ring-secondary shadow-neon-cyan' : ''
              } ${!track.unlocked ? 'opacity-50' : ''}`}
            >
              {!track.unlocked && (
                <div className="absolute top-4 right-4 z-10">
                  <ApperIcon name="Lock" className="w-6 h-6 text-surface-400" />
                </div>
              )}

              <div className="mb-4">
                <ApperIcon name="MapPin" className="w-16 h-16 text-secondary" />
              </div>

              <h3 className="text-xl font-racing font-bold text-white mb-2">{track.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-surface-300 font-racing">Difficulty</span>
                  <span className={`font-racing text-sm px-2 py-1 rounded ${
                    track.difficulty === 'Easy' ? 'bg-green-500 text-white' :
                    track.difficulty === 'Medium' ? 'bg-yellow-500 text-black' :
                    'bg-red-500 text-white'
                  }`}>
                    {track.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-300 font-racing">Laps</span>
                  <span className="text-white font-racing">{track.laps}</span>
                </div>
              </div>

              {selectedTrack.id === track.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 left-4 bg-secondary rounded-full p-2"
                >
                  <ApperIcon name="Check" className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={startRace}
            className="racing-button text-lg px-8 py-4"
          >
            <ApperIcon name="Play" className="w-5 h-5 mr-2" />
            Start Race!
          </button>
        </div>
      </motion.div>
    )
  }

  // Racing Screen
  if (gameState === 'racing') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8"
      >
        {/* HUD */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="racing-card p-4">
            <div className="text-center">
              <div className="text-2xl font-racing text-secondary">{Math.floor(raceData.currentSpeed)}</div>
              <div className="text-xs text-surface-400">KM/H</div>
            </div>
          </div>
          <div className="racing-card p-4">
            <div className="text-center">
              <div className="text-2xl font-racing text-primary">{raceData.currentLap}/{selectedTrack.laps}</div>
              <div className="text-xs text-surface-400">LAPS</div>
            </div>
          </div>
          <div className="racing-card p-4">
            <div className="text-center">
              <div className="text-2xl font-racing text-accent">{raceData.raceTime.toFixed(1)}s</div>
              <div className="text-xs text-surface-400">TIME</div>
            </div>
          </div>
          <div className="racing-card p-4">
            <div className="text-center">
              <div className="text-2xl font-racing text-white">1st</div>
              <div className="text-xs text-surface-400">POSITION</div>
            </div>
          </div>
        </div>

        {/* Track Visualization */}
        <div className="racing-card h-64 sm:h-96 relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-surface-700 to-surface-900"></div>
          
          {/* Track lines */}
          <div className="absolute inset-0 road-lines opacity-20"></div>
          
          {/* Car */}
          <motion.div
            animate={{
              x: raceData.position.x,
              y: raceData.currentSpeed > 0 ? Math.sin(raceData.raceTime * 2) * 2 : 0
            }}
            className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 ${
              raceData.currentSpeed > 10 ? 'car-engine' : ''
            }`}
          >
            <div className="w-8 h-16 bg-gradient-to-b from-primary to-primary-dark rounded-lg shadow-neon flex items-center justify-center">
              <ApperIcon name="Car" className="w-4 h-4 text-white transform rotate-90" />
            </div>
          </motion.div>

          {/* Speed effect */}
          {raceData.currentSpeed > 30 && (
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-primary to-transparent opacity-10 animate-pulse"></div>
          )}
        </div>

        {/* Controls */}
        <div className="racing-card p-6">
          <h3 className="text-xl font-racing font-bold text-white mb-4 text-center">Controls</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className={`p-3 rounded-lg border-2 transition-all duration-150 ${
              keys['w'] || keys['arrowup'] ? 'border-primary bg-primary bg-opacity-20' : 'border-surface-600'
            }`}>
              <ApperIcon name="ArrowUp" className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="text-xs font-racing text-surface-300">Accelerate</div>
              <div className="text-xs text-surface-500">W / ↑</div>
            </div>
            <div className={`p-3 rounded-lg border-2 transition-all duration-150 ${
              keys['s'] || keys['arrowdown'] ? 'border-secondary bg-secondary bg-opacity-20' : 'border-surface-600'
            }`}>
              <ApperIcon name="ArrowDown" className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <div className="text-xs font-racing text-surface-300">Brake</div>
              <div className="text-xs text-surface-500">S / ↓</div>
            </div>
            <div className={`p-3 rounded-lg border-2 transition-all duration-150 ${
              keys['a'] || keys['arrowleft'] ? 'border-accent bg-accent bg-opacity-20' : 'border-surface-600'
            }`}>
              <ApperIcon name="ArrowLeft" className="w-6 h-6 mx-auto mb-2 text-accent" />
              <div className="text-xs font-racing text-surface-300">Turn Left</div>
              <div className="text-xs text-surface-500">A / ←</div>
            </div>
            <div className={`p-3 rounded-lg border-2 transition-all duration-150 ${
              keys['d'] || keys['arrowright'] ? 'border-accent bg-accent bg-opacity-20' : 'border-surface-600'
            }`}>
              <ApperIcon name="ArrowRight" className="w-6 h-6 mx-auto mb-2 text-accent" />
              <div className="text-xs font-racing text-surface-300">Turn Right</div>
              <div className="text-xs text-surface-500">D / →</div>
            </div>
          </div>
        </div>

        {/* Exit Race */}
        <div className="text-center mt-6">
          <button
            onClick={resetToMenu}
            className="racing-button bg-surface-700 hover:bg-surface-600"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Exit Race
          </button>
        </div>
      </motion.div>
    )
  }

  // Results Screen
  if (gameState === 'results') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <ApperIcon name="Trophy" className="w-24 h-24 mx-auto text-accent" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-racing font-black neon-text mb-4">Race Complete!</h2>
          <p className="text-xl text-surface-300 font-racing">Congratulations on finishing the race</p>
        </div>

        <div className="racing-card mb-8">
          <h3 className="text-2xl font-racing font-bold text-white mb-6 text-center">Race Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="speedometer mb-4">
                <div className="text-center">
                  <div className="text-xl font-racing text-accent">1st</div>
                  <div className="text-xs text-surface-400">PLACE</div>
                </div>
              </div>
              <div className="text-surface-300 font-racing">Final Position</div>
            </div>
            <div className="text-center">
              <div className="speedometer mb-4">
                <div className="text-center">
                  <div className="text-xl font-racing text-primary">{raceData.raceTime.toFixed(1)}s</div>
                  <div className="text-xs text-surface-400">TIME</div>
                </div>
              </div>
              <div className="text-surface-300 font-racing">Total Time</div>
            </div>
            <div className="text-center">
              <div className="speedometer mb-4">
                <div className="text-center">
                  <div className="text-xl font-racing text-secondary">{selectedTrack.laps}</div>
                  <div className="text-xs text-surface-400">LAPS</div>
                </div>
              </div>
              <div className="text-surface-300 font-racing">Completed</div>
            </div>
            <div className="text-center">
              <div className="speedometer mb-4">
                <div className="text-center">
                  <div className="text-xl font-racing text-white">{Math.floor(selectedCar.speed * 0.8)}</div>
                  <div className="text-xs text-surface-400">AVG</div>
                </div>
              </div>
              <div className="text-surface-300 font-racing">Avg Speed</div>
            </div>
          </div>
        </div>

<div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={startRace}
            className="racing-button"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Race Again
          </button>
          <button
            onClick={resetToMenu}
            className="racing-button bg-surface-700 hover:bg-surface-600"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Main Menu
          </button>
        </div>
      </motion.div>
    )
  }

  return null
}