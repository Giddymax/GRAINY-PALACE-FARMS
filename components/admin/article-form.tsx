"use client";

import * as React from "react";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import { saveArticleAction, type ArticleActionState } from "@/lib/actions/admin/articles";
import { slugify } from "@/lib/validations/article";
import type { Article, ArticleCategory } from "@/lib/data/articles";

export function ArticleForm({
  article,
  categories,
}: {
  article?: Article | null;
  categories: ArticleCategory[];
}) {
  const [state, formAction, pending] = useActionState<ArticleActionState, FormData>(
    saveArticleAction,
    null
  );
  const [title, setTitle] = React.useState(article?.title ?? "");
  const [slug, setSlug] = React.useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(Boolean(article));
  const [status, setStatus] = React.useState<"draft" | "published">(article?.status ?? "draft");

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      {article?.id && <input type="hidden" name="id" value={article.id} />}
      <input type="hidden" name="status" value={status} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" name="excerpt" rows={2} required defaultValue={article?.excerpt} maxLength={300} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Body (Markdown)</Label>
          <MarkdownEditor name="body" defaultValue={article?.body ?? ""} />
        </div>

        <div className="rounded-lg border border-border p-4">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            SEO overrides (optional)
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seoTitle">SEO title</Label>
              <Input id="seoTitle" name="seoTitle" defaultValue={article?.seo_title ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seoDescription">SEO description</Label>
              <Textarea id="seoDescription" name="seoDescription" rows={2} defaultValue={article?.seo_description ?? ""} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-border p-4">
          <ImageUpload name="coverImageUrl" folder="articles" defaultValue={article?.cover_image} label="Cover image" />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="categoryId">Category</Label>
            <Select name="categoryId" defaultValue={article?.category_id ?? undefined}>
              <SelectTrigger id="categoryId" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" defaultValue={article?.tags?.join(", ") ?? ""} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="authorName">Author name</Label>
            <Input
              id="authorName"
              name="authorName"
              required
              defaultValue={article?.author_name ?? "Grainy Palace Farms Team"}
            />
          </div>

          <label className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Featured</span>
            <Switch name="featured" defaultChecked={article?.featured} />
          </label>
        </div>

        {state?.error && (
          <p role="alert" className="text-sm text-destructive">
            {state.error}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            variant="outline"
            disabled={pending}
            onClick={() => setStatus("draft")}
          >
            Save as draft
          </Button>
          <Button type="submit" disabled={pending} onClick={() => setStatus("published")}>
            {pending ? "Saving…" : "Publish"}
          </Button>
        </div>
      </div>
    </form>
  );
}
