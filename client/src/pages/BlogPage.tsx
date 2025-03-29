import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, BookOpen, Clock, Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

// Blog article data
const blogArticles = [
  {
    id: "understanding-time-zones",
    title: "Understanding Time Zones: A Complete Guide",
    excerpt: "Learn about the history, purpose, and structure of global time zones. This comprehensive guide explains how time zones work and why they are essential for global coordination.",
    date: "March 25, 2025",
    readTime: "8 min read",
    category: "Education",
    imagePath: null
  },
  {
    id: "daylight-saving-time",
    title: "Daylight Saving Time Explained: History, Purpose, and Controversies",
    excerpt: "Explore the origins of daylight saving time, how it affects different regions of the world, and the ongoing debates about its utility in modern society.",
    date: "March 22, 2025",
    readTime: "6 min read",
    category: "History",
    imagePath: null
  },
  {
    id: "business-across-time-zones",
    title: "Managing Business Across Time Zones: Best Practices",
    excerpt: "Discover effective strategies for scheduling meetings, maintaining productivity, and fostering communication in globally distributed teams spanning multiple time zones.",
    date: "March 18, 2025",
    readTime: "7 min read",
    category: "Business",
    imagePath: null
  },
  {
    id: "jet-lag-prevention",
    title: "How to Prevent and Manage Jet Lag When Traveling",
    excerpt: "Scientific approaches to minimizing the effects of jet lag when crossing multiple time zones. Learn practical tips for adjusting your sleep schedule before, during, and after travel.",
    date: "March 15, 2025",
    readTime: "5 min read",
    category: "Travel",
    imagePath: null
  },
  {
    id: "history-of-timekeeping",
    title: "The History of Timekeeping: From Sundials to Atomic Clocks",
    excerpt: "Trace the fascinating evolution of humanity's methods for measuring time, from ancient civilizations to the incredibly precise atomic clocks that coordinate global time today.",
    date: "March 10, 2025",
    readTime: "9 min read",
    category: "History",
    imagePath: null
  },
  {
    id: "international-date-line",
    title: "The International Date Line: Where Today Meets Tomorrow",
    excerpt: "Explore the concept, history, and quirks of the International Date Line - the imaginary line where crossing from east to west or west to east means jumping forward or backward by one calendar day.",
    date: "March 5, 2025",
    readTime: "6 min read",
    category: "Education",
    imagePath: null
  }
];

// Helper function to get unique categories
function getUniqueCategories() {
  return Array.from(new Set(blogArticles.map(article => article.category)));
}

export default function BlogPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // App title and description
  const pageTitle = "Time Zone Blog - Articles About Time, Timekeeping, and Travel - World Clock";
  const pageDescription = "Educational articles about time zones, international travel, global business coordination, and the science of timekeeping. Learn about daylight saving time, jet lag, and more.";
  
  // Toggle dark mode
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Filter articles by category
  const getFilteredArticles = () => {
    if (!activeCategory) return blogArticles;
    return blogArticles.filter(article => article.category === activeCategory);
  };
  
  const filteredArticles = getFilteredArticles();
  const categories = getUniqueCategories();
  
  return (
    <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="time zones, blog, articles, daylight saving time, jet lag, international business, travel, time difference" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:site_name" content="World Time Zones" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Time Zone Blog",
            "description": pageDescription,
            "url": window.location.href,
            "blogPost": blogArticles.map(article => ({
              "@type": "BlogPosting",
              "headline": article.title,
              "description": article.excerpt,
              "datePublished": article.date,
              "author": {
                "@type": "Organization",
                "name": "World Time Zones"
              },
              "url": `${window.location.origin}/blog/${article.id}`
            }))
          })}
        </script>
      </Helmet>
      
      <Header 
        onToggleTheme={handleToggleTheme} 
        isDarkMode={isDarkMode}
        onToggleSettings={() => {}}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <section className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to World Clock
            </Button>
          </Link>
          
          <header className="mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <BookOpen className="h-4 w-4 mr-1.5" />
              Educational Content
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
              Time Zone Blog
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Learn about time zones, international travel, time differences, and more with our educational articles.
            </p>
          </header>
        </section>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button 
            variant={activeCategory === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveCategory(null)}
          >
            All Categories
          </Button>
          
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Blog Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredArticles.map(article => (
            <Link key={article.id} href={`/blog/${article.id}`}>
              <article className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow border border-transparent hover:border-primary/20">
                <div className="p-6 flex-grow">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                    <span className="inline-flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {article.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {article.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                </div>
                
                <div className="px-6 pb-6 mt-auto">
                  <Button variant="ghost" size="sm" className="w-full">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        {filteredArticles.length === 0 && (
          <div className="bg-white dark:bg-card rounded-lg shadow-sm p-8 text-center mb-8">
            <h2 className="text-xl font-semibold mb-2">No articles found</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              No articles match the selected category. Try a different category or view all articles.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setActiveCategory(null)}>
              View All Articles
            </Button>
          </div>
        )}
        
        {/* Newsletter Signup */}
        <section className="bg-primary/5 dark:bg-primary/10 rounded-lg p-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-3">Stay Updated on Time Zone News</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Subscribe to our newsletter to receive updates on daylight saving time changes, 
              time zone adjustments, and new articles about global time coordination.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 flex-grow"
              />
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-neutral-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>
        
        {/* Blog Information */}
        <section className="bg-white dark:bg-card rounded-lg shadow-sm p-6 prose prose-sm dark:prose-invert max-w-none">
          <h2 className="flex items-center text-lg font-medium mb-3">
            <BookOpen className="h-5 w-5 text-primary mr-2" />
            About Our Time Zone Blog
          </h2>
          
          <p>
            Our blog provides educational content about time zones, time differences, and related topics. 
            We cover practical advice for travelers and international business professionals, as well as 
            historical and scientific information about timekeeping across cultures and eras.
          </p>
          
          <h3 className="text-base font-medium mt-4">Topics We Cover</h3>
          <ul>
            <li>Time zone changes and updates around the world</li>
            <li>Daylight saving time policies by country</li>
            <li>Managing jet lag and travel across time zones</li>
            <li>Historical development of timekeeping and time standardization</li>
            <li>Business strategies for global teams working across time zones</li>
          </ul>
          
          <p className="text-sm text-neutral-500 mt-4">
            Have a suggestion for a blog topic or want to contribute? Contact us with your ideas.
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}