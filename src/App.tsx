import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { saveAs } from 'file-saver'
import { toPng } from 'html-to-image'
import { AppFooter } from '@/components/AppFooter'
import { useTextConverter } from '@/hooks/useTextConverter'
import { TextInput } from '@/components/TextInput'
import { OutputDisplay } from '@/components/OutputDisplay'
import { ControlPanel } from '@/components/ControlPanel'
import { CONSTANTS } from '@/lib/utils'
import { Fonts, RenderSizes } from '@/types'
import ZuhyinCanvasBackground from '@/components/ZhuyinCanvasBackground'
import { cn } from '@/lib/utils'

function App () {
  const {
    inputText,
    setInputText,
    outputText,
    convertType,
    handleConvert,
    handleModeChange,
    handleClear,
    handleZhuyinItemUpdate
  } = useTextConverter()

  const [textColor, setTextColor] = useState<string>(CONSTANTS.DEFAULT_TEXT_COLOR)
  const handleTextColorChange = (color: string) => setTextColor(color)

  const [bgColor, setBgColor] = useState<string>(CONSTANTS.DEFAULT_BG_COLOR)
  const handleBgColorChange = (color: string) => setBgColor(color)
  const handleColorReset = () => {
    setTextColor(CONSTANTS.DEFAULT_TEXT_COLOR)
    setBgColor(CONSTANTS.DEFAULT_BG_COLOR)
  }
  const [textFont, setTextFont] = useState<typeof Fonts[keyof typeof Fonts]['key']>(CONSTANTS.DEFAULT_FONT)
  const handleTextFontChange = (font: string) => {
    setTextFont(font as typeof Fonts[keyof typeof Fonts]['key'])
  }

  const [textScale, setTextScale] = useState<number>(CONSTANTS.MAX_TEXT_SCALE)
  const handleTextScaleChange = (scale: number) => {
    if (scale < CONSTANTS.MIN_TEXT_SCALE || scale > CONSTANTS.MAX_TEXT_SCALE) return
    setTextScale(scale)
  }

  const handleClearWithEditMode = () => {
    handleClear()
  }

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const handleSaveAsImage = () => {
    if (!outputText || typeof outputText !== 'object') {
      console.error('No valid output to save as image')
      return
    }
    if (isSaving) return
    setIsSaving(true)
    const element = document.getElementById('output-block')
    if (element) {
      toPng(element)
        .then((dataUrl) => {
          saveAs(dataUrl, 'zhuyin-output.png')
        })
        .catch((error) => {
          console.error('Error generating image:', error)
        })
        .finally(() => {
          setIsSaving(false)
        })
    }
  }

  const [isWideMode, setIsWideMode] = useState<boolean>(false)
  const handleWideModeToggle = () => {
    setIsWideMode(!isWideMode)
  }

  const [renderSize, setRenderSize] = useState<typeof RenderSizes[keyof typeof RenderSizes]>(CONSTANTS.DEFAULT_RENDER_SIZE)
  const renderSizes = Object.values(RenderSizes)
  const handleRenderSizeChange = () => {
    const currentIndex = renderSizes.indexOf(renderSize)
    const nextIndex = (currentIndex + 1) % renderSizes.length
    setRenderSize(renderSizes[nextIndex])
  }

  return (
    <ZuhyinCanvasBackground spacing={32} activeSymbolCount={20} animationDuration={5000}>
      <div className="min-h-screen flex flex-col">
        <main className="app-main flex-1">
          <div className={cn(
            "container mx-auto pt-20 pb-20 px-4 min-h-[calc(100dvh-41px)] fog-container",
            isWideMode ? 'max-w-full' : 'max-w-5xl'
          )}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold">ㄅㄆㄇㄈ注音小幫手</h1>
              <p className="text-center mt-4 text-gray-500 text-sm">👀 請使用電腦版開啟以獲得更好的操作體驗</p>
            </div>

            <div className="card">
              <RadioGroup defaultValue="zhuyin" className="hidden" onValueChange={handleModeChange}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="zhuyin" id="zhuyin" />
                    <Label htmlFor="zhuyin">標記注音符號</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pinyin" id="pinyin" />
                    <Label htmlFor="pinyin">標記拼音</Label>
                  </div>
                </div>
              </RadioGroup>

              <TextInput
                inputText={inputText}
                setInputText={setInputText}
                convertType={convertType}
                onConvert={handleConvert}
                onClear={handleClearWithEditMode}
              />
              <hr className="block my-8" />
              <div>
                <ControlPanel
                  textColor={textColor}
                  onTextColorChange={handleTextColorChange}
                  bgColor={bgColor}
                  onBgColorChange={handleBgColorChange}
                  onColorReset={handleColorReset}
                  textScale={textScale}
                  onTextScaleChange={handleTextScaleChange}
                  textFont={textFont}
                  onTextFontChange={handleTextFontChange}
                  outputText={outputText}
                  isWideMode={isWideMode}
                  onWideModeToggle={handleWideModeToggle}
                  onSaveAsImage={handleSaveAsImage}
                  onRenderSizeChange={handleRenderSizeChange}
                />
                <OutputDisplay
                  outputText={outputText}
                  convertType={convertType}
                  textScale={textScale}
                  textColor={textColor}
                  textFont={textFont}
                  bgColor={bgColor}
                  onZhuyinChange={handleZhuyinItemUpdate}
                  renderSize={renderSize}
                />
                <p className="text-center text-gray-500 text-sm mt-4">
                  如有破音字不完整或其他問題，請<a className="underline" href="https://github.com/unickhow/zhuyin-convertor/issues" target="_blank" rel="noopener noreferrer">協助回報</a>，謝謝！
                </p>
              </div>
            </div>
          </div>
        </main>
        <AppFooter className="mt-auto" />
      </div>
    </ZuhyinCanvasBackground>
  )
}

export default App
