import { Link } from "wouter";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { useGetArticles } from "@workspace/api-client-react";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

interface RelatedArticlesProps {
  title?: string;
  limit?: number;
  excludeSlug?: string;
}

export function RelatedArticles({
  title = "Latest News & Articles",
  limit = 3,
  excludeSlug,
}: RelatedArticlesProps) {
  const { data: allArticles = [], isLoading } = useGetArticles();

  const articles = allArticles
    .filter((a) => a.slug !== excludeSlug)
    .slice(0, limit);

  if (isLoading || articles.length === 0) return null;

  return (
    <section className="py-16 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-widest mb-2">
              <Newspaper size={12} /> Articles
            </span>
            <h2 className="text-2xl font-black text-white">{title}</h2>
          </div>
          <Link
            href="/articles"
            className="hidden sm:inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="block group">
              <div className="rounded-xl bg-card border border-border/50 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)] h-full flex flex-col">
                <div className="h-36 overflow-hidden bg-secondary/30">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper size={24} className="text-white/10" />
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  {article.publishedAt && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <Calendar size={10} />
                      {formatDate(article.publishedAt)}
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2 mb-2 flex-1">
                    {article.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold group-hover:gap-1.5 transition-all">
                    Read More <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/articles" className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold">
            View All Articles <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
