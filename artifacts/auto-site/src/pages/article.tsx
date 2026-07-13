import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Newspaper } from "lucide-react";
import { marked } from "marked";
import { useGetArticles } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/i18n";

marked.setOptions({ breaks: true });

type Lang = "en" | "pl" | "ru" | "lt";

function localizedField(article: Record<string, unknown>, field: string, lang: Lang): string {
  if (lang !== "en") {
    const key = `${field}${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
    const val = article[key];
    if (typeof val === "string" && val.trim()) return val;
  }
  return (article[field] as string) ?? "";
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-white/5 rounded w-2/3" />
      <div className="h-4 bg-white/5 rounded w-1/4" />
      <div className="h-64 bg-white/5 rounded-xl" />
      {[1, 2, 3, 4].map((i) => <div key={i} className="h-4 bg-white/5 rounded" />)}
    </div>
  );
}

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { t, lang } = useLanguage();
  const { data: articles = [], isLoading } = useGetArticles();
  const [html, setHtml] = useState("");

  const article = articles.find((a) => a.slug === slug);
  const a = article as unknown as Record<string, unknown> | undefined;

  const title   = a ? localizedField(a, "title",   lang as Lang) : "";
  const excerpt = a ? localizedField(a, "excerpt", lang as Lang) : "";
  const content = a ? localizedField(a, "content", lang as Lang) : "";

  useEffect(() => {
    if (content) {
      const result = marked.parse(content);
      if (typeof result === "string") setHtml(result);
      else result.then(setHtml);
    } else {
      setHtml("");
    }
  }, [content]);

  useEffect(() => {
    if (title) {
      document.title = `${title} | BOVAJA`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", excerpt || title);
    }
  }, [title, excerpt]);

  if (isLoading) {
    return (
      <div className="pt-12 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <ArticleSkeleton />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-12 pb-24 text-center">
        <div className="container mx-auto px-4">
          <Newspaper size={48} className="mx-auto mb-4 opacity-20 text-white" />
          <h1 className="text-2xl font-bold text-white mb-2">{t("articles.notFound")}</h1>
          <Link href="/articles" className="text-primary hover:underline">← {t("articles.backToAll")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/articles" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft size={14} /> {t("articles.backToAll")}
          </Link>

          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">{title}</h1>

          {article.publishedAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Calendar size={14} />
              {t("articles.published")}: {formatDate(article.publishedAt)}
            </div>
          )}

          {article.coverImage && (
            <div className="rounded-2xl overflow-hidden mb-10 border border-border/50">
              <img
                src={article.coverImage}
                alt={title}
                loading="lazy"
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          )}

          {excerpt && (
            <p className="text-lg text-muted-foreground mb-8 border-l-2 border-primary/50 pl-4 italic">
              {excerpt}
            </p>
          )}

          {html ? (
            <div
              className="prose prose-invert prose-sm md:prose-base max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-slate-300 prose-p:leading-relaxed
                prose-strong:text-white
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-ul:text-slate-300 prose-ol:text-slate-300
                prose-li:marker:text-primary
                prose-blockquote:border-primary/50 prose-blockquote:text-muted-foreground
                prose-img:rounded-xl prose-img:border prose-img:border-border/50"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <p className="text-muted-foreground italic">{t("articles.noContentLang")}</p>
          )}

          <div className="mt-12 pt-8 border-t border-border/50">
            <Link href="/articles" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              <ArrowLeft size={16} /> {t("articles.backToAll")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
