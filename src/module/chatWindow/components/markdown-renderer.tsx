import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

export const MarkdownRenderer = ({ 
  children,
  className = ""
}: MarkdownRendererProps) => {
  return (
    <div className={className}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          // Using any type to bypass TypeScript restrictions with 'inline' property
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4 text-sm"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code 
                className={`${className || ''} bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono`} 
                {...props}
              >
                {children}
              </code>
            );
          },
          // Headings
          h1: (props) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
          h2: (props) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
          h3: (props) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
          h4: (props) => <h4 className="text-base font-bold mt-3 mb-2" {...props} />,
          h5: (props) => <h5 className="text-sm font-bold mt-3 mb-1" {...props} />,
          h6: (props) => <h6 className="text-sm font-bold mt-3 mb-1" {...props} />,
          
          // Paragraphs
          p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
          
          // Lists
          ul: (props) => <ul className="list-disc pl-8 mb-4 space-y-1" {...props} />,
          ol: (props) => <ol className="list-decimal pl-8 mb-4 space-y-1" {...props} />,
          li: (props) => <li className="mb-1" {...props} />,
          
          // Blockquotes
          blockquote: (props) => (
            <blockquote 
              className="border-l-4 border-muted-foreground pl-4 py-1 my-4 italic text-muted-foreground"
              {...props} 
            />
          ),
          
          // Links
          a: (props) => (
            <a 
              className="text-primary underline hover:text-primary/80 transition-colors" 
              target="_blank"
              rel="noopener noreferrer"
              {...props} 
            />
          ),
          
          // Table
          table: (props) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse" {...props} />
            </div>
          ),
          thead: (props) => <thead className="bg-muted" {...props} />,
          tbody: (props) => <tbody className="divide-y divide-border" {...props} />,
          tr: (props) => <tr className="border-b border-border" {...props} />,
          th: (props) => (
            <th 
              className="px-3 py-2 text-left text-sm font-medium" 
              {...props} 
            />
          ),
          td: (props) => <td className="px-3 py-2 text-sm" {...props} />,
          
          // Horizontal rule
          hr: (props) => <hr className="my-6 border-t border-border" {...props} />,
          
          // Images
          img: (props) => (
            <img 
              className="max-w-full h-auto rounded-md my-4" 
              alt={props.alt || 'Image'} 
              {...props} 
            />
          ),
          
          // Strong/bold text
          strong: (props) => <strong className="font-bold" {...props} />,
          
          // Emphasis/italic text
          em: (props) => <em className="italic" {...props} />,
          
          // Preformatted text
          pre: ({ children, ...props }) => (
            <pre className="bg-muted rounded-md p-4 overflow-x-auto my-4 text-sm" {...props}>
              {children}
            </pre>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}; 