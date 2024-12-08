'use client'

import { useState } from 'react'
import { NQueensSimulation } from '@/components/n-queens-simulation'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { motion, MotionProps } from 'framer-motion'
import { Footer } from '@/components/footer'

// Create a custom motion.div component with proper typing
const MotionDiv = motion.div as React.FC<MotionProps & React.HTMLProps<HTMLDivElement>>

export default function Home() {
  const [boardSize, setBoardSize] = useState(4)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(500)

  const handleStart = () => {
    setIsSimulating(true)
  }

  const handleReset = () => {
    setIsSimulating(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <MotionDiv
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        N-Queens Backtracking Simulation
      </MotionDiv>
      <div className="space-y-6">
        <MotionDiv
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-2">Board Size</h2>
          <Select value={boardSize.toString()} onValueChange={(value) => setBoardSize(parseInt(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {[4, 5, 6, 7, 8].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} x {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </MotionDiv>

        <MotionDiv
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="space-x-4">
            <Button onClick={handleStart} disabled={isSimulating}>Start Simulation</Button>
            <Button onClick={handleReset} variant="outline">Reset</Button>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Simulation Speed</h2>
            <Slider
              min={100}
              max={1000}
              step={100}
              value={[1100 - simulationSpeed]}
              onValueChange={(value) => setSimulationSpeed(1100 - value[0])}
            />
            <p className="text-sm mt-2">Current speed: {Math.round(1000 / simulationSpeed * 100) / 100} steps/second</p>
          </div>
        </MotionDiv>

        {isSimulating && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NQueensSimulation boardSize={boardSize} simulationSpeed={simulationSpeed} />
          </MotionDiv>
        )}
      </div>
      <Footer />
    </div>
  )
}