import { OutputText, ConvertType } from '@/hooks/useTextConverter'
import { ZhuyinRenderer } from './ZhuyinRenderer'

interface OutputDisplayProps {
  outputText: OutputText
  convertType: ConvertType
  textScale: number
  textColor: string
  bgColor: string
  isEditing: boolean
}

export const OutputDisplay = ({
  outputText,
  convertType,
  textScale,
  textColor,
  bgColor,
  isEditing
}: OutputDisplayProps) => {
  const renderOutput = () => {
    if (convertType === 'zhuyin' && Array.isArray(outputText)) {
      return (
        <ZhuyinRenderer
          items={outputText}
          textScale={textScale}
          textColor={textColor}
          isEditing={isEditing}
        />
      )
    }
    return typeof outputText === 'string' ? outputText : '轉換結果會顯示在這裡...'
  }

  return (
    <div
      id="output-block"
      className={`min-h-40 p-4 border rounded-md ${isEditing && 'editing-mode'}`}
      style={{ backgroundColor: bgColor }}
    >
      {renderOutput()}
    </div>
  )
}
