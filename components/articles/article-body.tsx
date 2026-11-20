import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

const markdownComponents: Components = {
  img: ({ src, alt }) => {
    if (typeof src !== "string" || !src) return null;

    return (
      <figure className="not-prose my-10 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          className="mx-auto max-h-[42rem] w-full object-contain"
        />
        {alt && (
          <figcaption className="border-t border-border px-4 py-3 text-center text-sm text-muted-foreground sm:px-6">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="not-prose my-10 rounded-r-2xl border-l-4 border-gold-500 bg-forest-50 px-6 py-5 font-heading text-xl leading-relaxed text-forest-950 dark:bg-forest-950/40 dark:text-forest-100">
      {children}
    </blockquote>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-14 border-b border-border pb-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
      {children}
    </h2>
  ),
};

export function ArticleBody({ body, className }: { body: string; className?: string }) {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none dark:prose-invert",
        "prose-headings:font-heading prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-p:leading-8 prose-li:leading-8 prose-strong:text-foreground",
        "prose-a:text-forest-700 dark:prose-a:text-forest-300",
        "prose-blockquote:border-l-gold-500 prose-blockquote:text-muted-foreground",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={markdownComponents}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
