import type { OutputDisplayProps } from '@/types'
import { ZhuyinRenderer } from './ZhuyinRenderer'

export const OutputDisplay = ({
  outputText,
  convertType,
  textScale,
  textColor,
  textFont,
  bgColor,
  onZhuyinChange
}: OutputDisplayProps) => {
  const renderOutput = () => {
    if (convertType === 'zhuyin' && Array.isArray(outputText)) {
      return (
        <ZhuyinRenderer
          items={outputText}
          textScale={textScale}
          textColor={textColor}
          onZhuyinChange={onZhuyinChange}
        />
      )
    }
    return typeof outputText === 'string' ? outputText : '標記結果會顯示在這裡...'
  }

  return (
    <div
      id="output-block"
      className={`min-h-40 p-4 border rounded-md ${textFont}`}
      style={{ backgroundColor: bgColor }}
    >
      {renderOutput()}
    </div>
  )
}
