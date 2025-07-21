import React, { useEffect, useRef, useMemo } from 'react'

// 所有注音符號
const ZHUYIN_SYMBOLS = [
  'ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ',
  'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ',
  'ㄧ', 'ㄨ', 'ㄩ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ',
  'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ'
]

interface ZhuyinCanvasBackgroundProps {
  backgroundColor?: string
  symbolColor?: string
  activeColor?: string
  minDistance?: number
  animationDuration?: number
  activeSymbolCount?: number
  symbolSize?: number
  spacing?: number
  className?: string
  children?: React.ReactNode
}

interface Symbol {
  char: string
  x: number
  y: number
  isActive: boolean
  animationStart: number
}

const ZhuyinCanvasBackground: React.FC<ZhuyinCanvasBackgroundProps> = ({
  backgroundColor = '#ffffff',
  symbolColor = 'rgba(0, 0, 0, 0.7)',
  activeColor = 'rgba(0, 0, 0, 0.8)',
  minDistance = 1,
  animationDuration = 3000,
  activeSymbolCount = 5,
  symbolSize = 16,
  spacing = 30,
  className = '',
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(30)
  const symbolsRef = useRef<Symbol[]>([])
  const lastAnimationTime = useRef<number>(0)

  // 解析顏色並返回 RGBA 值
  const parseColor = (color: string): { r: number; g: number; b: number; a: number } => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = color
    const computedColor = ctx.fillStyle

    // 處理 hex 顏色
    if (computedColor.startsWith('#')) {
      const hex = computedColor.slice(1)
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return { r, g, b, a: 1 }
    }

    // 處理 rgba 顏色
    const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
    if (match) {
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: match[4] ? parseFloat(match[4]) : 1
      }
    }

    return { r: 0, g: 0, b: 0, a: 1 }
  }

  const symbolColorParsed = useMemo(() => parseColor(symbolColor), [symbolColor])
  const activeColorParsed = useMemo(() => parseColor(activeColor), [activeColor])

  // 生成不重複的符號網格
  const generateGrid = (rows: number, cols: number): Symbol[] => {
    const grid: string[][] = []
    const symbols: Symbol[] = []

    for (let i = 0; i < rows; i++) {
      grid[i] = []
      for (let j = 0; j < cols; j++) {
        const forbidden = new Set<string>()

        // 檢查指定距離內的所有位置
        for (let di = -minDistance; di <= minDistance; di++) {
          for (let dj = -minDistance; dj <= minDistance; dj++) {
            if (di === 0 && dj === 0) continue

            const ni = i + di
            const nj = j + dj

            if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && grid[ni]?.[nj]) {
              forbidden.add(grid[ni][nj])
            }
          }
        }

        // 從可用符號中隨機選擇
        const available = ZHUYIN_SYMBOLS.filter(s => !forbidden.has(s))
        const symbol = available.length > 0
          ? available[Math.floor(Math.random() * available.length)]
          : ZHUYIN_SYMBOLS[Math.floor(Math.random() * ZHUYIN_SYMBOLS.length)]

        grid[i][j] = symbol
        symbols.push({
          char: symbol,
          x: j * spacing,
          y: i * spacing,
          isActive: false,
          animationStart: 0
        })
      }
    }

    return symbols
  }

  // 繪製函數
  const draw = (ctx: CanvasRenderingContext2D, currentTime: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // 清除畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 設置字體
    ctx.font = `${symbolSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang TC", "Microsoft JhengHei", sans-serif`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    // 繪製所有符號
    symbolsRef.current.forEach(symbol => {
      let alpha = symbolColorParsed.a * 0.15
      let scale = 1

      if (symbol.isActive) {
        const elapsed = currentTime - symbol.animationStart
        const progress = (elapsed % animationDuration) / animationDuration
        const ease = 0.5 - 0.5 * Math.cos(2 * Math.PI * progress)

        // 計算透明度和縮放
        const baseAlpha = symbolColorParsed.a * 0.15
        const targetAlpha = activeColorParsed.a * 0.8
        alpha = baseAlpha + (targetAlpha - baseAlpha) * ease
        scale = 1 + 0.05 * ease

        // 混合顏色
        const r = Math.round(symbolColorParsed.r + (activeColorParsed.r - symbolColorParsed.r) * ease)
        const g = Math.round(symbolColorParsed.g + (activeColorParsed.g - symbolColorParsed.g) * ease)
        const b = Math.round(symbolColorParsed.b + (activeColorParsed.b - symbolColorParsed.b) * ease)

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      } else {
        ctx.fillStyle = `rgba(${symbolColorParsed.r}, ${symbolColorParsed.g}, ${symbolColorParsed.b}, ${alpha})`
      }

      // 保存狀態並應用縮放
      ctx.save()
      ctx.translate(symbol.x + symbolSize / 2, symbol.y + symbolSize / 2)
      ctx.scale(scale, scale)
      ctx.translate(-symbolSize / 2, -symbolSize / 2)
      ctx.fillText(symbol.char, 0, 0)
      ctx.restore()
    })
  }

  // 動畫循環
  const animate = (currentTime: number) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // 更新活躍符號
    if (currentTime - lastAnimationTime.current >= animationDuration) {
      // 重置所有符號
      symbolsRef.current.forEach(symbol => {
        symbol.isActive = false
      })

      // 隨機選擇新的活躍符號
      const indices = new Set<number>()
      while (indices.size < activeSymbolCount && indices.size < symbolsRef.current.length) {
        indices.add(Math.floor(Math.random() * symbolsRef.current.length))
      }

      indices.forEach(index => {
        symbolsRef.current[index].isActive = true
        symbolsRef.current[index].animationStart = currentTime
      })

      lastAnimationTime.current = currentTime
    }

    draw(ctx, currentTime)
    animationRef.current = requestAnimationFrame(animate)
  }

  // 處理 resize
  useEffect(() => {
    const updateCanvas = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      // 設置 canvas 尺寸
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      // 設置縮放
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }

      // 生成符號
      const cols = Math.ceil(rect.width / spacing) + 1
      const rows = Math.ceil(rect.height / spacing) + 1
      symbolsRef.current = generateGrid(rows, cols)
    }

    updateCanvas()

    const resizeObserver = new ResizeObserver(updateCanvas)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // 啟動動畫
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      resizeObserver.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [spacing, symbolSize, minDistance, animationDuration, activeSymbolCount])

  return (
    <div
      ref={containerRef}
      className={`zhuyin-canvas-background ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />

      {children && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default ZhuyinCanvasBackground
