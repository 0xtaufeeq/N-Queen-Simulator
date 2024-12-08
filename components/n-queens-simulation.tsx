'use client'

import { useState, useEffect, useRef } from 'react'
import { DiamondIcon as ChessQueen } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface NQueensSimulationProps {
    boardSize: number
    simulationSpeed: number
}

export function NQueensSimulation({ boardSize, simulationSpeed }: NQueensSimulationProps) {
    const [board, setBoard] = useState<number[]>(Array(boardSize).fill(-1))
    const [step, setStep] = useState(0)
    const [analysis, setAnalysis] = useState<string[]>([])
    const [solution, setSolution] = useState<string[]>([])
    const analysisRef = useRef<HTMLUListElement>(null)

    useEffect(() => {
        const simulate = async () => {
            const result = await solveNQueens(boardSize)
            if (result) {
                setBoard(result)
                const solutionCoordinates = result.map((col, row) =>
                    `Queen ${row + 1} - (${row + 1},${col + 1})`
                )
                setSolution(solutionCoordinates)
            }
        }
        simulate()
    }, [boardSize])

    useEffect(() => {
        if (analysisRef.current) {
            analysisRef.current.scrollTop = analysisRef.current.scrollHeight
        }
    }, [analysis])

    async function solveNQueens(n: number): Promise<number[] | null> {
        const board = Array(n).fill(-1)
        const solve = async (row: number): Promise<boolean> => {
            if (row === n) {
                return true
            }
            for (let col = 0; col < n; col++) {
                if (await isSafe(board, row, col)) {
                    board[row] = col
                    setBoard([...board])
                    setStep((prevStep) => prevStep + 1)
                    setAnalysis((prevAnalysis) => [...prevAnalysis, `Placing queen at row ${row + 1}, column ${col + 1}`])
                    await new Promise(resolve => setTimeout(resolve, simulationSpeed))
                    if (await solve(row + 1)) {
                        return true
                    }
                    board[row] = -1
                    setBoard([...board])
                    setStep((prevStep) => prevStep + 1)
                    setAnalysis((prevAnalysis) => [...prevAnalysis, `Backtracking from row ${row + 1}, column ${col + 1}`])
                    await new Promise(resolve => setTimeout(resolve, simulationSpeed))
                }
            }
            return false
        }

        const isSafe = async (board: number[], row: number, col: number): Promise<boolean> => {
            for (let i = 0; i < row; i++) {
                if (board[i] === col || Math.abs(board[i] - col) === Math.abs(i - row)) {
                    setAnalysis((prevAnalysis) => [...prevAnalysis, `Cannot place queen at row ${row + 1}, column ${col + 1} due to conflict`])
                    await new Promise(resolve => setTimeout(resolve, simulationSpeed))
                    return false
                }
            }
            return true
        }

        if (await solve(0)) {
            return board
        }
        return null
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>N-Queens Board</CardTitle>
                    <CardDescription>Step: {step}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid" style={{ gridTemplateColumns: `repeat(${boardSize + 1}, minmax(0, 1fr))` }}>
                        {[...Array(boardSize + 1)].map((_, rowIndex) =>
                            [...Array(boardSize + 1)].map((_, colIndex) => {
                                if (rowIndex === 0 && colIndex === 0) {
                                    return <div key={`${rowIndex}-${colIndex}`} className="w-12 h-12 flex items-center justify-center" />
                                }
                                if (rowIndex === 0) {
                                    return (
                                        <div key={`${rowIndex}-${colIndex}`} className="w-12 h-12 flex items-center justify-center font-bold">
                                            {colIndex}
                                        </div>
                                    )
                                }
                                if (colIndex === 0) {
                                    return (
                                        <div key={`${rowIndex}-${colIndex}`} className="w-12 h-12 flex items-center justify-center font-bold">
                                            {rowIndex}
                                        </div>
                                    )
                                }
                                return (
                                    <motion.div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`w-12 h-12 border border-gray-600 flex items-center justify-center ${(rowIndex + colIndex) % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'
                                            }`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {board[rowIndex - 1] === colIndex - 1 && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            >
                                                <ChessQueen className="text-primary w-8 h-8" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Step-by-Step Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul ref={analysisRef} className="space-y-2 max-h-60 overflow-y-auto">
                            {analysis.map((step, index) => (
                                <motion.li
                                    key={index}
                                    className="text-sm"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {step}
                                </motion.li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                {solution.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Final Queen Positions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {solution.map((position, index) => (
                                    <motion.li
                                        key={index}
                                        className="text-sm"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        {position}
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

