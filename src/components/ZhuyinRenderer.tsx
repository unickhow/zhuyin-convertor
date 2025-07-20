import { ZhuyinItem } from '@/hooks/useTextConverter'

interface ZhuyinRendererProps {
  items: ZhuyinItem[]
  textScale: number
  textColor: string
  isEditable: boolean
}

export const ZhuyinRenderer = ({
  items,
  textScale,
  textColor,
  isEditable
}: ZhuyinRendererProps) => {
  return (
    <div className="flex flex-wrap gap-2" style={{ scale: textScale }}>
      {items.map((item, index) => (
        <div key={`zhuyin-item-${index}-${item.char}`} className="flex items-center min-w-[30px] w-[80px]" style={{ color: textColor }}>
          <div className={`text-[3rem] min-h-[2rem] transition-opacity ${isEditable && 'opacity-30'}`}>
            {item.char}
          </div>
          <div className="flex items-center">
            <div className="flex flex-col items-center justify-center">
              <div
                contentEditable={isEditable}
                className="text-[1rem] font-bold min-h-[2px]"
                style={{
                  lineHeight: '1px'
                }}
              >
                {item.tone === '0' ? item.symbol : ''}
              </div>
              <div
                contentEditable={isEditable}
                className={`font-bold transition-[text] ${isEditable ? 'text-[1.2rem]' : 'text-[1rem]'}`}
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright'
                }}
              >
                {item.zhuyin}
              </div>
            </div>
            <div
              contentEditable={isEditable}
              className="text-[1rem] font-bold min-w-[2px]"
              style={{
                lineHeight: '3rem'
              }}
            >
              {item.tone === '0' ? '' : item.symbol}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
