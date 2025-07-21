export interface ZhuyinItem {
  char: string
  zhuyin: string
  tone: string
  symbol: string
  heteronym?: Pick<ZhuyinItem, 'zhuyin' | 'tone' | 'symbol'>[]
}

export interface TextInputProps {
  inputText: string
  setInputText: (text: string) => void
  convertType: ConvertType
  onConvert: () => void
  onClear: () => void
}

export type ConvertType = 'zhuyin' | 'pinyin'
export type OutputText = ZhuyinItem[]

export interface ControlPanelProps {
  textColor: string
  bgColor: string
  textScale: number
  textFont: typeof Fonts[keyof typeof Fonts]['key']
  outputText: OutputText
  isWideMode: boolean
  onTextColorChange: (color: string) => void
  onBgColorChange: (color: string) => void
  onTextFontChange: (font: typeof Fonts[keyof typeof Fonts]['key']) => void
  onTextScaleChange: (scale: number) => void
  onColorReset: () => void
  onSaveAsImage: () => void
  onWideModeToggle: () => void
}

export interface OutputDisplayProps {
  outputText: OutputText
  convertType: ConvertType
  textScale: number
  textColor: string
  textFont: typeof Fonts[keyof typeof Fonts]['key']
  bgColor: string
  onZhuyinChange?: (index: number, newZhuyin: string, newTone: string, newSymbol: string) => void
}

export const Fonts = {
  DEFAULT: {
    key: 'default-font',
    value: '預設字體'
  },
  MICROSOFT_JHENGHEI: {
    key: 'microsoft-jhenghei',
    value: '微軟正黑體'
  },
  DFKAI_SB: {
    key: 'dfkai-sb',
    value: '標楷體'
  },
  HEITI_TC: {
    key: 'heiti-tc',
    value: '黑體'
  },
  NOTO_SANS: {
    key: 'noto-sans',
    value: 'Noto Sans'
  }
} as const
