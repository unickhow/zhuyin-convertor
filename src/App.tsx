import { useState } from 'react'
import '@/App.css'
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
import { Fonts } from '@/types'

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

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const handleEditableToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleClearWithEditMode = () => {
    handleClear()
    setIsEditing(false)
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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="app-main flex-1">
        <div className="container mx-auto pt-20 pb-20 px-4">
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
                bgColor={bgColor}
                textScale={textScale}
                textFont={textFont}
                outputText={outputText}
                onTextColorChange={handleTextColorChange}
                onBgColorChange={handleBgColorChange}
                onTextFontChange={handleTextFontChange}
                onTextScaleChange={handleTextScaleChange}
                onColorReset={handleColorReset}
                onSaveAsImage={handleSaveAsImage}
              />
              <OutputDisplay
                outputText={outputText}
                convertType={convertType}
                textScale={textScale}
                textColor={textColor}
                textFont={textFont}
                bgColor={bgColor}
                isEditing={isEditing}
                onZhuyinChange={handleZhuyinItemUpdate}
              />
            </div>
          </div>
        </div>
      </main>
      <AppFooter className="mt-auto" />
    </div>
  )
}

export default App
