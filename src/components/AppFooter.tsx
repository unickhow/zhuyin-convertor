import * as React from 'react'
import { cn } from '@/lib/utils'
import { Github } from 'lucide-react'

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const AppFooter = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(
          "app-footer",
          className
        )}
        {...props}
      >
        <div className="container mx-auto p-2 text-center text-sm text-muted-foreground max-w-5xl fog-container">
          <a
            href="https://github.com/unickhow/zhuyin-convertor"
            target="_blank"
            className="inline-block text-gray-300 hover:text-gray-400 transition-colors"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </footer>
    )
  }
)
AppFooter.displayName = 'AppFooter'

export { AppFooter }
