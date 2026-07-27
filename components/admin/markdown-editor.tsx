"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Link2,
  Quote,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleBody } from "@/components/articles/article-body";

type Wrap = { before: string; after?: string; placeholder?: string };

const toolbarActions: { label: string; icon: React.ReactNode; wrap: Wrap }[] = [
  { label: "Bold", icon: <Bold className="size-4" />, wrap: { before: "**", after: "**", placeholder: "bold text" } },
  { label: "Italic", icon: <Italic className="size-4" />, wrap: { before: "_", after: "_", placeholder: "italic text" } },
  { label: "Heading", icon: <Heading2 className="size-4" />, wrap: { before: "## ", placeholder: "Heading" } },
  { label: "Bulleted list", icon: <List className="size-4" />, wrap: { before: "- ", placeholder: "List item" } },
  { label: "Numbered list", icon: <ListOrdered className="size-4" />, wrap: { before: "1. ", placeholder: "List item" } },
  { label: "Quote", icon: <Quote className="size-4" />, wrap: { before: "> ", placeholder: "Quote" } },
  { label: "Link", icon: <Link2 className="size-4" />, wrap: { before: "[", after: "](https://)", placeholder: "link text" } },
  { label: "Image", icon: <ImageIcon className="size-4" />, wrap: { before: "![", after: "](https://)", placeholder: "alt text" } },
];

export function MarkdownEditor({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [value, setValue] = React.useState(defaultValue);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  function applyWrap(wrap: Wrap) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd) || wrap.placeholder || "";
    const after = wrap.after ?? "";
    const next = value.slice(0, selectionStart) + wrap.before + selected + after + value.slice(selectionEnd);
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = selectionStart + wrap.before.length + selected.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <Tabs defaultValue="write">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {toolbarActions.map((action) => (
            <Button
              key={action.label}
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={action.label}
              onClick={() => applyWrap(action.wrap)}
            >
              {action.icon}
            </Button>
          ))}
        </div>
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="write">
        <Textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={18}
          required
          className="font-mono text-sm"
          placeholder="Write your article in Markdown — headings with ##, **bold**, _italic_, - lists, > quotes, [links](url), ![images](url)."
        />
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-96 rounded-md border border-border p-4">
          {value.trim() ? (
            <ArticleBody body={value} />
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
