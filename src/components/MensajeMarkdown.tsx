import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MensajeMarkdown({ texto }: { texto: string }) {
  return (
    <div className="prose max-w-none text-tinta prose-p:text-tinta prose-li:text-tinta prose-strong:text-tinta prose-headings:text-tinta prose-code:text-tinta prose-a:text-violeta-texto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          ),
        }}
      >
        {texto}
      </ReactMarkdown>
    </div>
  );
}