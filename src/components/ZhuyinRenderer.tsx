import type { ZhuyinItem, ZhuyinRendererProps } from '@/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export const ZhuyinRenderer = ({
  items,
  textScale,
  textColor,
  onZhuyinChange,
  renderSize
}: ZhuyinRendererProps) => {

  const handleHeteronymClick = (itemIndex: number, heteronym: Pick<ZhuyinItem, 'zhuyin' | 'tone' | 'symbol'>) => {
    if (onZhuyinChange) {
      onZhuyinChange(itemIndex, heteronym.zhuyin, heteronym.tone, heteronym.symbol)
    }
  }

  return (
    <div
      className={cn(
        renderSize,
        "zhuyin-renderer flex flex-wrap gap-x-2"
      )}
      style={{ scale: textScale }}
    >
      {items.map((item, index) => (
        item.char === '\n'
          ? <div key={`zhuyin-item-${index}-${item.char}`} className="hr-breaker"></div>
          : <div key={`zhuyin-item-${index}-${item.char}`} className="zhuyin-wrapper flex items-center" style={{ color: textColor }}>
              <Popover>
                <PopoverTrigger className="w-full h-full">
                  <div className="zhuyin-wrapper__char">{item.char}</div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="flex flex-col items-center">
                    <div className="text-lg font-bold mb-2">注音符號</div>
                    <div className="text-center text-sm">{item.zhuyin} {item.symbol}</div>
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
                  <div className="zhuyin-wrapper__tone zhuyin-wrapper__tone--top">
                    {item.tone === '0' ? item.symbol : ''}
                  </div>
                  <div className="zhuyin-wrapper__zhuyin">{item.zhuyin}</div>
                </div>
                <div className="zhuyin-wrapper__tone zhuyin-wrapper__tone--right">
                  {item.tone === '0' ? '' : item.symbol}
                </div>
              </div>
            </div>
      ))}
    </div>
  )
}
