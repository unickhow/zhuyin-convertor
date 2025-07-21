import React, { useEffect, useState, useMemo, useRef } from 'react'

// 所有注音符號
const ZHUYIN_SYMBOLS = [
  'ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ',
  'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ',
  'ㄧ', 'ㄨ', 'ㄩ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ',
  'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ'
]

interface ZhuyinBackgroundProps {
  /** 背景顏色 */
  backgroundColor?: string
  /** 符號預設顏色 */
  symbolColor?: string
  /** 符號活躍時的顏色 */
  activeColor?: string
  /** 最小重複距離（1 = 相鄰不重複，2 = 間隔一格不重複，以此類推） */
  minDistance?: number
  /** 動畫持續時間（毫秒） */
  animationDuration?: number
  /** 同時活躍的符號數量 */
  activeSymbolCount?: number
  /** 符號大小（像素） */
  symbolSize?: number
  /** 符號間距（像素） */
  spacing?: number
  /** 自定義類名 */
  className?: string
  /** 子元素 */
  children?: React.ReactNode
}

const ZhuyinBackground: React.FC<ZhuyinBackgroundProps> = ({
  backgroundColor = 'transparent',
  symbolColor = 'rgba(0, 0, 0, 0.15)',
  activeColor = 'rgba(0, 0, 0, 0.8)',
  minDistance = 1,
  animationDuration = 3000,
  activeSymbolCount = 5,
  symbolSize = 16,
  spacing = 30,
  className = '',
  children
}) => {
  const [grid, setGrid] = useState<string[][]>([])
  const [activeIndices, setActiveIndices] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>(30)
  const uniqueId = useRef(Math.random().toString(36).substr(2, 9))

  // 生成不重複的符號網格
  const generateGrid = useMemo(() => {
    return (rows: number, cols: number): string[][] => {
      const newGrid: string[][] = []

      for (let i = 0; i < rows; i++) {
        newGrid[i] = []
        for (let j = 0; j < cols; j++) {
          const forbidden = new Set<string>()

          // 檢查指定距離內的所有位置
          for (let di = -minDistance; di <= minDistance; di++) {
            for (let dj = -minDistance; dj <= minDistance; dj++) {
              if (di === 0 && dj === 0) continue

              const ni = i + di
              const nj = j + dj

              if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && newGrid[ni]?.[nj]) {
                forbidden.add(newGrid[ni][nj])
              }
            }
          }

          // 從可用符號中隨機選擇
          const available = ZHUYIN_SYMBOLS.filter(s => !forbidden.has(s))
          if (available.length === 0) {
            // 如果沒有可用符號，從所有符號中選擇（降級處理）
            newGrid[i][j] = ZHUYIN_SYMBOLS[Math.floor(Math.random() * ZHUYIN_SYMBOLS.length)]
          } else {
            newGrid[i][j] = available[Math.floor(Math.random() * available.length)]
          }
        }
      }

      return newGrid
    }
  }, [minDistance])

  // 初始化網格
  useEffect(() => {
    const updateGrid = () => {
      if (!containerRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      const cols = Math.ceil(width / spacing) + 1
      const rows = Math.ceil(height / spacing) + 1

      setGrid(generateGrid(rows, cols))
    }

    updateGrid()

    const resizeObserver = new ResizeObserver(updateGrid)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [generateGrid, spacing])

  // 動畫循環
  useEffect(() => {
    let lastTime = 0
    const indices = new Set<string>()

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= animationDuration) {
        // 清除舊的活躍符號
        indices.clear()

        // 隨機選擇新的活躍符號
        const totalSymbols = grid.length * (grid[0]?.length || 0)
        if (totalSymbols > 0) {
          for (let i = 0; i < activeSymbolCount; i++) {
            const row = Math.floor(Math.random() * grid.length)
            const col = Math.floor(Math.random() * (grid[0]?.length || 0))
            indices.add(`${row}-${col}`)
          }
        }

        setActiveIndices(new Set(indices))
        lastTime = currentTime
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [grid, animationDuration, activeSymbolCount])

  return (
    <div
      ref={containerRef}
      className={`zhuyin-background ${className}`}
      style={{
        backgroundColor,
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes zhuyin-breathe-${uniqueId.current} {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        .zhuyin-symbol-${uniqueId.current} {
          position: absolute;
          transition: none;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang TC", "Microsoft JhengHei", sans-serif;
          user-select: none;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .zhuyin-symbol-${uniqueId.current}.active {
          animation: zhuyin-breathe-${uniqueId.current} ${animationDuration}ms ease-in-out;
        }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {grid.map((row, rowIndex) =>
          row.map((symbol, colIndex) => {
            const key = `${rowIndex}-${colIndex}`
            const isActive = activeIndices.has(key)

            return (
              <span
                key={key}
                className={`zhuyin-symbol-${uniqueId.current} ${isActive ? 'active' : ''}`}
                style={{
                  left: `${colIndex * spacing}px`,
                  top: `${rowIndex * spacing}px`,
                  fontSize: `${symbolSize}px`,
                  color: isActive ? activeColor : symbolColor,
                }}
              >
                {symbol}
              </span>
            )
          })
        )}
      </div>

      {children && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default ZhuyinBackground
