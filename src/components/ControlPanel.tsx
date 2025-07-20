import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ZoomIn, ZoomOut, ScanSearch, Camera, BrushCleaning, PencilRuler } from 'lucide-react'
import { OutputText } from '@/hooks/useTextConverter'
import { CONSTANTS } from '@/lib/utils'

interface ControlPanelProps {
  textColor: string
  bgColor: string
  textScale: number
  isEditing: boolean
  outputText: OutputText
  onTextColorChange: (color: string) => void
  onBgColorChange: (color: string) => void
  onTextScaleChange: (scale: number) => void
  onEditableToggle: () => void
  onColorReset: () => void
  onSaveAsImage: () => void
}

export const ControlPanel = ({
  textColor,
  bgColor,
  textScale,
  isEditing,
  outputText,
  onTextColorChange,
  onBgColorChange,
  onTextScaleChange,
  onEditableToggle,
  onColorReset,
  onSaveAsImage
}: ControlPanelProps) => {
  return (
    <div className="flex flex-col items-center sm:flex-row gap-2 sticky top-0 z-10 py-4 bg-white">
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <input
              type="color"
              value={textColor}
              disabled={isEditing}
              onChange={(e) => onTextColorChange(e.target.value)}
              className={`w-8 h-8 border rounded-sm cursor-pointer ${isEditing && 'opacity-50'}`}
            />
          </TooltipTrigger>
          <TooltipContent>文字顏色</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <input
              type="color"
              value={bgColor}
              disabled={isEditing}
              onChange={(e) => onBgColorChange(e.target.value)}
              className={`w-8 h-8 border rounded-sm cursor-pointer ${isEditing && 'opacity-50'}`}
            />
          </TooltipTrigger>
          <TooltipContent>背景顏色</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isEditing}
              onClick={onColorReset}
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
              className={isEditing ? 'bg-gray-600 text-white' : ''}
              onClick={onEditableToggle}
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
              onClick={() => onTextScaleChange(1)}
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
              disabled={textScale <= CONSTANTS.MIN_TEXT_SCALE}
              onClick={() => onTextScaleChange(Math.max(textScale - CONSTANTS.STEP_TEXT_SCALE, CONSTANTS.MIN_TEXT_SCALE))}
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
              disabled={textScale >= CONSTANTS.MAX_TEXT_SCALE}
              onClick={() => onTextScaleChange(Math.min(textScale + CONSTANTS.STEP_TEXT_SCALE, CONSTANTS.MAX_TEXT_SCALE))}
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
              disabled={!outputText || typeof outputText !== 'object' || isEditing}
              onClick={onSaveAsImage}
            >
              <Camera className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>儲存為圖片</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}