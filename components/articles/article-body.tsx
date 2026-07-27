import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

export function ArticleBody({ body, className }: { body: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none dark:prose-invert",
        "prose-headings:font-heading prose-headings:font-semibold",
        "prose-a:text-forest-700 dark:prose-a:text-forest-300",
        "prose-blockquote:border-l-gold-500 prose-blockquote:text-muted-foreground",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
