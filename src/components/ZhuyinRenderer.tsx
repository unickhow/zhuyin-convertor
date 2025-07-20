import { ZhuyinItem } from '@/hooks/useTextConverter'

interface ZhuyinRendererProps {
  items: ZhuyinItem[]
  textScale: number
  textColor: string
  isEditing: boolean
}

export const ZhuyinRenderer = ({
  items,
  textScale,
  textColor,
  isEditing
}: ZhuyinRendererProps) => {
  const isEditable = (item: ZhuyinItem) => isEditing && item.zhuyin !== ''

  return (
    <div className="zhuyin-renderer flex flex-wrap gap-x-2" style={{ scale: textScale }}>
      {items.map((item, index) => (
        item.char === '\n'
          ? <div key={`zhuyin-item-${index}-${item.char}`} className="hr-breaker"></div>
          : <div key={`zhuyin-item-${index}-${item.char}`} className="flex items-center min-w-[30px] w-[80px]" style={{ color: textColor }}>
              <div className={`text-[3rem] min-h-[2rem] transition-opacity ${isEditing && 'opacity-30'}`}>
                {item.char}
              </div>
              <div className="flex items-center">
                <div className="flex flex-col items-center justify-center">
                  <div
                    contentEditable={isEditable(item)}
                    suppressContentEditableWarning
                    className={`text-[1rem] font-bold min-h-[2px] ${isEditable(item) ? 'border border-solid border-1 border-red-300 h-[1rem] w-[1rem]' : 'leading-[1px]'}`}
                  >
                    {item.tone === '0' ? item.symbol : ''}
                  </div>
                  <div
                    contentEditable={isEditable(item)}
                    suppressContentEditableWarning
                    className={`font-bold transition-[text] ${isEditable(item) ? 'text-[1.2rem] border border-solid border-1 border-red-300' : 'text-[1rem]'}`}
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'upright'
                    }}
                  >
                    {item.zhuyin}
                  </div>
                </div>
                <div
                  contentEditable={isEditable(item)}
                  suppressContentEditableWarning
                  className={`text-[1rem] font-bold min-w-[2px] ${isEditable(item) ? 'border border-solid border-1 border-red-300 w-[.5rem]' : ''}`}
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
