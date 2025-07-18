import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import '@/App.css'
import pinyin from 'pinyin'
import zhuyinMap from '@/map/zhuyin.json'
import toneSymbols from '@/map/toneSymbols.json'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ZoomIn, ZoomOut, ScanSearch, Camera, BrushCleaning, PencilRuler } from 'lucide-react'
import { saveAs } from 'file-saver'
import { toPng } from 'html-to-image'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface ZhuyinItem {
  char: string
  zhuyin: string
  tone: string
  symbol: string
}

type ConvertType = 'zhuyin' | 'pinyin'
type OutputText = string | ZhuyinItem[]

function App() {
  const [inputText, setInputText] = useState<string>('很久很久以前，在一座被銀色月光輕輕撫摸的古老森林裡，住著一隻小狐狸。小狐狸有著柔軟的火紅尾巴和一雙像星星般閃亮的眼睛…')
  const [outputText, setOutputText] = useState<OutputText>('')

  const convertToPinyin = (text: string): string => {
    const pyArr = pinyin(text, {
      style: pinyin.STYLE_TONE2,
    })
    return pyArr.map(item => item[0]).join(' ')
  }

  const isChinese = (char: string): boolean => {
    return /[\u4e00-\u9fff]/.test(char)
  }

  const convertToZhuyin = (text: string): ZhuyinItem[] => {
    const pyArr = pinyin(text, {
      style: pinyin.STYLE_TONE2,
    })

    return text.split('').map((char, index) => {
      if (isChinese(char) && pyArr[index]) {
        const pinyinWithTone = pyArr[index][0]
        const toneNumber = pinyinWithTone.match(/\d/)?.[0] || '0'
        const pinyinWithoutTone = pinyinWithTone.replace(/\d/g, '')

        const zhuyinBase = (zhuyinMap as Record<string, string>)[pinyinWithoutTone] || pinyinWithoutTone
        const toneSymbol = (toneSymbols as unknown as Record<string, string>)[toneNumber] || ''

        return {
          char: char,
          zhuyin: zhuyinBase,
          tone: toneNumber,
          symbol: toneSymbol
        }
      }
      return {
        char: char,
        zhuyin: '',
        tone: '0',
        symbol: ''
      }
    })
  }

  // convert type state
  const [convertType, setConvertType] = useState<ConvertType>('zhuyin')
  const handleConvert = () => {
    if (!inputText.trim()) return

    if (convertType === 'pinyin') {
      setOutputText(convertToPinyin(inputText))
    } else {
      setOutputText(convertToZhuyin(inputText))
    }
  }
  // Initial conversion on mount
  useEffect(() => {
    handleConvert()
  }, [])

  const handleModeChange = (mode: ConvertType): void => {
    setConvertType(mode)
    setOutputText('')
  }

  const renderZhuyinOutput = (): ReactNode => {
    if (convertType === 'zhuyin' && Array.isArray(outputText)) {
      return (
        <div className="flex flex-wrap gap-2" style={{ scale: textScale }}>
          {outputText.map((item, index) => (
            <div key={index} className="flex items-center min-w-[30px] w-[80px]" style={{ color: textColor }}>
              <div className="text-[3rem] min-h-[2rem]">
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
                    className={`font-bold ${isEditable ? 'text-[1.2rem]' : 'text-[1rem]'}`}
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
    return typeof outputText === 'string' ? outputText : '轉換結果會顯示在這裡...'
  }

  // text scale
  const MAX_TEXT_SCALE = 1
  const MIN_TEXT_SCALE = 0.7
  const STEP_TEXT_SCALE = 0.1
  const [textScale, setTextScale] = useState<number>(MIN_TEXT_SCALE)
  const handleTextScaleChange = (scale: number) => {
    setTextScale(scale)
  }

  // color state
  const DEFAULT_COLORS = {
    text: '#000000',
    background: '#ffffff'
  }
  const [textColor, setTextColor] = useState<string>(DEFAULT_COLORS.text)
  const [bgColor, setBgColor] = useState<string>(DEFAULT_COLORS.background)
  const handleTextColorChange = (color: string) => !isEditable && setTextColor(color)
  const handleBgColorChange = (color: string) => !isEditable && setBgColor(color)
  const handleColorReset = () => {
    if (isEditable) return
    setTextColor(DEFAULT_COLORS.text)
    setBgColor(DEFAULT_COLORS.background)
  }

  // editable state
  const [isEditable, setIsEditable] = useState<boolean>(false)
  const handleEditableToggle = () => {
    setIsEditable(!isEditable)
  }

  // download image
  const handleSaveAsImage = () => {
    if (!outputText || typeof outputText !== 'object' || isEditable) {
      console.error('No valid output to save as image')
      return
    }
    const element = document.getElementById('output-block')
    if (element) {
      toPng(element)
        .then((dataUrl) => {
          saveAs(dataUrl, 'story_zhuyin.png')
        })
        .catch((error) => {
          console.error('Error generating image:', error)
        })
    }
  }

  return (
    <main className="app-main">
      <div className="container mx-auto pt-20 pb-20 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">ㄅㄆㄇㄈ注音小幫手</h1>
        </div>

        <div className="card">
          <RadioGroup defaultValue="zhuyin" className="hidden" onValueChange={handleModeChange}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zhuyin" id="zhuyin" />
                <Label htmlFor="zhuyin">轉換為注音符號</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pinyin" id="pinyin" />
                <Label htmlFor="pinyin">轉換為拼音</Label>
              </div>
            </div>
          </RadioGroup>

          <div style={{ marginBottom: '1rem' }}>
            <Textarea
              value={inputText}
              placeholder="請輸入中文文字..."
              className="w-full min-h-40 p-4 bg-white border rounded-md"
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-4 mb-4">
            <Button
              variant="outline"
              disabled={!inputText.trim()}
              onClick={() => {
                setInputText('')
                setOutputText('')
                setIsEditable(false)
              }}
            >
              清除
            </Button>
            <Button onClick={handleConvert}>
              {convertType === 'zhuyin' ? '轉換為注音' : '轉換為拼音'}
            </Button>
          </div>
          <hr className="block my-8" />
          <div>
            <div className="flex flex-col items-center sm:flex-row gap-2 mb-4 relative">
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <input
                      type="color"
                      value={textColor}
                      disabled={isEditable}
                      onChange={(e) => handleTextColorChange(e.target.value)}
                      className={`w-8 h-8 border rounded-sm cursor-pointer ${isEditable && 'opacity-50'}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>文字顏色</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <input
                      type="color"
                      value={bgColor}
                      disabled={isEditable}
                      onChange={(e) => handleBgColorChange(e.target.value)}
                      className={`w-8 h-8 border rounded-sm cursor-pointer ${isEditable && 'opacity-50'}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>背景顏色</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isEditable}
                      onClick={handleColorReset}
                    >
                      <BrushCleaning className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>重置顏色</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={isEditable ? 'bg-gray-600 text-white' : ''}
                      onClick={handleEditableToggle}
                    >
                      <PencilRuler className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>編輯注音</TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { handleTextScaleChange(1) }}
                    >
                      <ScanSearch className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>重置縮放</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={textScale <= MIN_TEXT_SCALE}
                      onClick={() => { handleTextScaleChange(Math.max(textScale - STEP_TEXT_SCALE, MIN_TEXT_SCALE)) }}
                    >
                      <ZoomOut className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>縮小</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={textScale >= MAX_TEXT_SCALE}
                      onClick={() => { handleTextScaleChange(Math.min(textScale + STEP_TEXT_SCALE, MAX_TEXT_SCALE)) }}
                    >
                      <ZoomIn className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>放大</TooltipContent>
                </Tooltip>
              </div>
              <div className="flex gap-2 sm:ml-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!outputText || typeof outputText !== 'object' || isEditable}
                      onClick={handleSaveAsImage}
                    >
                      <Camera className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>儲存為圖片</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div
              id="output-block"
              className={`min-h-40 p-4 border rounded-md ${isEditable && 'editing-mode'}`}
              style={{ backgroundColor: bgColor }}
            >
              {renderZhuyinOutput()}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
