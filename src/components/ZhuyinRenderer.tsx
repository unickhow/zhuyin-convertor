import { ZhuyinItem } from '@/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

interface ZhuyinRendererProps {
  items: ZhuyinItem[]
  textScale: number
  textColor: string
  isEditing: boolean
  onZhuyinChange?: (index: number, newZhuyin: string, newTone: string, newSymbol: string) => void
}

export const ZhuyinRenderer = ({
  items,
  textScale,
  textColor,
  isEditing,
  onZhuyinChange
}: ZhuyinRendererProps) => {
  const isEditable = (item: ZhuyinItem) => isEditing && item.zhuyin !== ''

  const handleHeteronymClick = (itemIndex: number, heteronym: Pick<ZhuyinItem, 'zhuyin' | 'tone' | 'symbol'>) => {
    if (onZhuyinChange) {
      onZhuyinChange(itemIndex, heteronym.zhuyin, heteronym.tone, heteronym.symbol)
    }
  }

  return (
    <div className="zhuyin-renderer flex flex-wrap gap-x-2" style={{ scale: textScale }}>
      {items.map((item, index) => (
        item.char === '\n'
          ? <div key={`zhuyin-item-${index}-${item.char}`} className="hr-breaker"></div>
          : <div key={`zhuyin-item-${index}-${item.char}`} className="flex items-center min-w-[30px] w-[80px]" style={{ color: textColor }}>
              <Popover>
                <PopoverTrigger className="w-full h-full">
                  <div className={`text-[3rem] min-h-[2rem] transition-opacity ${isEditing && 'opacity-30'}`}>
                    {item.char}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-bold mb-2">注音符號</div>
                    <div className="text-center text-sm">
                      {item.zhuyin} {item.symbol}
                    </div>
                    {item.heteronym && item.heteronym.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        所有讀音:
                        {item.heteronym.map((h, hIndex) => (
                          <span
                            key={hIndex}
                            className="ml-1 cursor-pointer border border-gray-300 hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
                            onClick={() => handleHeteronymClick(index, h)}
                          >
                            {h.zhuyin} {h.symbol}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
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
