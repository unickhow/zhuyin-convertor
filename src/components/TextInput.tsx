import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ConvertType } from '@/hooks/useTextConverter'

interface TextInputProps {
  inputText: string
  setInputText: (text: string) => void
  convertType: ConvertType
  onConvert: () => void
  onClear: () => void
}

export const TextInput = ({
  inputText,
  setInputText,
  convertType,
  onConvert,
  onClear
}: TextInputProps) => {
  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <Textarea
          value={inputText}
          placeholder="請輸入中文文字..."
          maxLength={1000}
          className="w-full min-h-40 p-4 bg-white border rounded-md"
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <Button
          variant="outline"
          disabled={!inputText.trim()}
          onClick={onClear}
        >
          清除
        </Button>
        <Button onClick={onConvert}>
          {convertType === 'zhuyin' ? '轉換為注音' : '轉換為拼音'}
        </Button>
      </div>
    </>
  )
}
