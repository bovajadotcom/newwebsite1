import { motion } from "framer-motion";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { Link } from "wouter";
import { useGetArticles } from "@workspace/api-client-react";
import { useLanguage } from "@/lib/i18n";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

type Lang = "en" | "pl" | "ru" | "lt";

function localizedField(article: Record<string, unknown>, field: string, lang: Lang): string {
  if (lang !== "en") {
    const key = `${field}${lang.charAt(0).toUpperCase() + lang.slice(1)}`;
    const val = article[key];
    if (typeof val === "string" && val.trim()) return val;
  }
  return (article[field] as string) ?? "";
}

export default function Articles() {
  const { t, lang } = useLanguage();
  const { data: articles = [], isLoading } = useGetArticles();

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-5">
            <Newspaper size={14} /> {t("nav.articles")}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{t("articles.heading")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("articles.sub")}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-card border border-border/50 overflow-hidden animate-pulse">
                <div className="h-48 bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-1/3" />
                  <div className="h-6 bg-white/5 rounded" />
                  <div className="h-4 bg-white/5 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Newspaper size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">{t("articles.empty")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {articles.map((article, i) => {
              const a = article as unknown as Record<string, unknown>;
              const title = localizedField(a, "title", lang as Lang);
              const excerpt = localizedField(a, "excerpt", lang as Lang);
              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-2xl bg-card border border-border/50 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] flex flex-col"
                >
                  <Link href={`/articles/${article.slug}`} className="block">
                    <div className="relative overflow-hidden h-48 bg-secondary/30">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper size={40} className="text-white/10" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    {article.publishedAt && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Calendar size={12} />
                        {formatDate(article.publishedAt)}
                      </div>
                    )}
                    <Link href={`/articles/${article.slug}`} className="block">
                      <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {title}
                      </h2>
                    </Link>
                    {excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">{excerpt}</p>
                    )}
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all"
                    >
                      {t("articles.readMore")} <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
