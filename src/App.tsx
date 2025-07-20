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
    handleClear
  } = useTextConverter('很久很久以前，在一座被銀色月光輕輕撫摸的古老森林裡，住著一隻小狐狸。小狐狸有著柔軟的火紅尾巴和一雙像星星般閃亮的眼睛…')

  const [textColor, setTextColor] = useState<string>(CONSTANTS.DEFAULT_TEXT_COLOR)
  const handleTextColorChange = (color: string) => !isEditing && setTextColor(color)

  const [bgColor, setBgColor] = useState<string>(CONSTANTS.DEFAULT_BG_COLOR)
  const handleBgColorChange = (color: string) => !isEditing && setBgColor(color)
  const handleColorReset = () => {
    if (isEditing) return
    setTextColor(CONSTANTS.DEFAULT_TEXT_COLOR)
    setBgColor(CONSTANTS.DEFAULT_BG_COLOR)
  }
  const [textFont, setTextFont] = useState<typeof Fonts[keyof typeof Fonts]['key']>(CONSTANTS.DEFAULT_FONT)
  const handleTextFontChange = (font: string) => {
    if (isEditing) return
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
    if (!outputText || typeof outputText !== 'object' || isEditing) {
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
            <p className="text-center text-sm text-gray-500 mb-2">📝 現階段中文破音字不易維護，如有需求請開啟<u className="cursor-pointer transition hover:text-gray-900" onClick={handleEditableToggle}>編輯注音</u>模式，修正後再進行快照</p>
            <div>
              <ControlPanel
                textColor={textColor}
                bgColor={bgColor}
                textScale={textScale}
                textFont={textFont}
                isEditing={isEditing}
                outputText={outputText}
                onTextColorChange={handleTextColorChange}
                onBgColorChange={handleBgColorChange}
                onTextFontChange={handleTextFontChange}
                onTextScaleChange={handleTextScaleChange}
                onEditableToggle={handleEditableToggle}
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
