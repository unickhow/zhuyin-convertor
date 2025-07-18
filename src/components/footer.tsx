import * as React from 'react'
import { cn } from '@/lib/utils'
import { Github } from 'lucide-react'

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <a
            href="https://github.com/unickhow/zhuyin-convertor"
            target="_blank"
            className="inline-block"
            rel="noopener noreferrer"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </footer>
    )
  }
)
Footer.displayName = "Footer"

export { Footer }