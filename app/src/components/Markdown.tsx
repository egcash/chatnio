import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark as style } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { parseFile } from "./plugins/file.tsx";
import "../assets/markdown/all.less";
import { useEffect } from "react";

type MarkdownProps = {
  children: string;
  className?: string;
};

function Markdown({ children, className }: MarkdownProps) {
  useEffect(() => {
    document.querySelectorAll(".file-instance").forEach((el) => {
      const parent = el.parentElement as HTMLElement;
      if (!parent.classList.contains("file-block"))
        parent.classList.add("file-block");
    });
  }, [children]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      className={`markdown-body ${className}`}
      children={children}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          if (match && match[1] === "file")
            return parseFile(children.toString());
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              children={String(children).replace(/\n$/, "")}
              style={style}
              language={match[1]}
              PreTag="div"
              wrapLongLines={true}
              wrapLines={true}
              className={`code-block`}
              lang={match[1]}
            />
          ) : (
            <code className={`code-inline ${className}`} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
}

export default Markdown;