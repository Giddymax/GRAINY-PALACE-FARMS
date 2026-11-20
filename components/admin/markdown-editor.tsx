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
import { uploadMediaAction } from "@/lib/actions/admin/media";
import { toast } from "sonner";

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
  const [uploading, setUploading] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

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

  async function handleImageUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    let result: Awaited<ReturnType<typeof uploadMediaAction>>;
    try {
      result = await uploadMediaAction("articles", file);
    } catch {
      setUploading(false);
      toast.error("Image upload failed. Please try again.");
      return;
    }
    setUploading(false);
    if (result.error || !result.url) {
      toast.error(result.error ?? "Could not upload this image.");
      return;
    }

    const textarea = textareaRef.current;
    const alt =
      file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/[\[\]\\\n]+/g, " ")
        .trim() || "Article image";
    const markdown = `![${alt}](${result.url})`;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const separatorBefore = before && !before.endsWith("\n\n") ? "\n\n" : "";
    const separatorAfter = after && !after.startsWith("\n\n") ? "\n\n" : "";
    const insertion = `${separatorBefore}${markdown}${separatorAfter}`;
    const next = before + insertion + after;
    setValue(next);

    requestAnimationFrame(() => {
      const cursor = before.length + insertion.length;
      textarea?.focus();
      textarea?.setSelectionRange(cursor, cursor);
    });
    toast.success("Image uploaded and inserted. You can edit its alt text in the Markdown.");
  }

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Tabs defaultValue="write">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Upload image"}
            </Button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] ?? null;
                event.currentTarget.value = "";
                void handleImageUpload(file);
              }}
            />
          </div>
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="write">
          <p className="mb-2 text-xs text-muted-foreground">
            Place the cursor where the image should appear, then upload it. Images are inserted at that point in the article.
          </p>
          <Textarea
            ref={textareaRef}
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
    </>
  );
}
