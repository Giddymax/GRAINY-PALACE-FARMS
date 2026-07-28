"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/require-role";
import { articleSchema } from "@/lib/validations/article";
import { computeReadingTime } from "@/lib/format";
import { broadcastPush } from "@/lib/push/send";

export type ArticleActionState = { error?: string; success?: boolean } | null;

export async function saveArticleAction(
  _prevState: ArticleActionState,
  formData: FormData
): Promise<ArticleActionState> {
  const profile = await requireStaff();

  const parsed = articleSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId") || "",
    tags: formData.get("tags") || "",
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    authorName: formData.get("authorName"),
    featured: formData.get("featured") === "on",
    seoTitle: formData.get("seoTitle") || "",
    seoDescription: formData.get("seoDescription") || "",
    coverImageUrl: formData.get("coverImageUrl") || "",
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  const supabase = await createClient();
  const tags = parsed.data.tags
    ? parsed.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const readingTime = computeReadingTime(parsed.data.body);

  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    category_id: parsed.data.categoryId || null,
    tags,
    excerpt: parsed.data.excerpt,
    body: parsed.data.body,
    author_id: profile.id,
    author_name: parsed.data.authorName,
    featured: parsed.data.featured ?? false,
    seo_title: parsed.data.seoTitle || null,
    seo_description: parsed.data.seoDescription || null,
    cover_image: parsed.data.coverImageUrl || null,
    status: parsed.data.status,
    reading_time: readingTime,
  };

  let articleId = parsed.data.id;
  let isNewlyPublished = false;

  if (articleId) {
    const updatePayload: typeof payload & { published_at?: string } = { ...payload };
    if (parsed.data.status === "published") {
      const { data: existing } = await supabase
        .from("articles")
        .select("published_at")
        .eq("id", articleId)
        .maybeSingle();
      if (!existing?.published_at) {
        updatePayload.published_at = new Date().toISOString();
        isNewlyPublished = true;
      }
    }
    const { error } = await supabase.from("articles").update(updatePayload).eq("id", articleId);
    if (error) return { error: "Could not save the article. The slug may already be in use." };
  } else {
    isNewlyPublished = parsed.data.status === "published";
    const insertPayload = {
      ...payload,
      published_at: isNewlyPublished ? new Date().toISOString() : null,
    };
    const { data, error } = await supabase
      .from("articles")
      .insert(insertPayload)
      .select("id")
      .single();
    if (error || !data) return { error: "Could not create the article. The slug may already be in use." };
    articleId = data.id;
  }

  if (isNewlyPublished) {
    await broadcastPush({
      title: "New article on Grainy Palace Farm",
      body: parsed.data.title,
      url: `/articles/${parsed.data.slug}`,
    }).catch((err) => console.error("New-article push notification failed:", err));
  }

  revalidatePath("/articles");
  revalidatePath(`/articles/${parsed.data.slug}`);
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${articleId}/edit?saved=1`);
}

export async function deleteArticleAction(id: string, slug: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/articles");
  revalidatePath(`/articles/${slug}`);
  revalidatePath("/admin/articles");
}

export async function toggleArticleStatusAction(id: string, nextStatus: "draft" | "published") {
  await requireStaff();
  const supabase = await createClient();

  const update: { status: "draft" | "published"; published_at?: string } = { status: nextStatus };
  let isNewlyPublished = false;
  if (nextStatus === "published") {
    const { data: existing } = await supabase
      .from("articles")
      .select("published_at, title, slug")
      .eq("id", id)
      .maybeSingle();
    if (!existing?.published_at) {
      update.published_at = new Date().toISOString();
      isNewlyPublished = true;
    }
    if (isNewlyPublished && existing) {
      await broadcastPush({
        title: "New article on Grainy Palace Farm",
        body: existing.title,
        url: `/articles/${existing.slug}`,
      }).catch((err) => console.error("New-article push notification failed:", err));
    }
  }

  await supabase.from("articles").update(update).eq("id", id);
  revalidatePath("/articles");
  revalidatePath("/admin/articles");
}

export async function saveArticleCategoryAction(formData: FormData) {
  await requireStaff();
  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const name = String(formData.get("name") ?? "").trim();
  const slug = formData.get("slug") as string;
  const description = (formData.get("description") as string) || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (id) {
    await supabase
      .from("article_categories")
      .update({ name, slug, description, sort_order: sortOrder })
      .eq("id", id);
  } else {
    await supabase.from("article_categories").insert({ name, slug, description, sort_order: sortOrder });
  }

  revalidatePath("/articles");
  revalidatePath("/admin/articles");
}

export async function deleteArticleCategoryAction(id: string) {
  await requireStaff();
  const supabase = await createClient();
  await supabase.from("article_categories").delete().eq("id", id);
  revalidatePath("/articles");
  revalidatePath("/admin/articles");
}
