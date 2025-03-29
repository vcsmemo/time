import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, BookOpen, Calendar, Clock, Share2, Bookmark, ThumbsUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

// Blog article data - in a real application, this would come from a database
const blogArticles = [
  {
    id: "understanding-time-zones",
    title: "Understanding Time Zones: A Complete Guide",
    excerpt: "Learn about the history, purpose, and structure of global time zones. This comprehensive guide explains how time zones work and why they are essential for global coordination.",
    date: "March 25, 2025",
    readTime: "8 min read",
    category: "Education",
    author: "Time Zone Team",
    content: `
      <h2>What Are Time Zones?</h2>
      <p>Time zones are regions of the globe that observe a uniform standard time for legal, commercial, and social purposes. These zones generally follow the boundaries of countries and their subdivisions because it is convenient for areas in close commercial or other communication to keep the same time.</p>
      
      <p>Most of the time zones on land are offset from Coordinated Universal Time (UTC) by a whole number of hours, although a few zones are offset by 30 or 45 minutes. Some higher-latitude and island countries use half-hour or quarter-hour deviations from standard time.</p>
      
      <h2>The History of Time Zones</h2>
      <p>Before the late 19th century, time was often determined locally based on the sun's position, meaning different towns and cities kept slightly different times. This wasn't a significant problem until the development of railways and telecommunications, which made the coordination of times between distant locations important.</p>
      
      <p>In 1884, the International Meridian Conference was held in Washington, D.C., where the concept of a global system of time zones was proposed and the Greenwich Meridian was established as the Prime Meridian (0° longitude). This created the basis for the system of time zones we use today.</p>
      
      <h2>How Time Zones Work</h2>
      <p>The Earth rotates 15 degrees longitude each hour. Based on this, the world is divided into 24 standard time zones, each approximately 15 degrees of longitude wide. However, the actual boundaries of time zones are often modified to follow country borders or regional preferences.</p>
      
      <p>The reference point for all time zones is Coordinated Universal Time (UTC), which is the modern successor to Greenwich Mean Time (GMT). Time zones are defined as positive or negative offsets from UTC. For example, Eastern Standard Time (EST) is UTC−5, meaning it is 5 hours behind UTC.</p>
      
      <h2>Daylight Saving Time</h2>
      <p>Many time zones observe Daylight Saving Time (DST), which involves advancing clocks by one hour during summer months so that evening daylight lasts longer. The implementation of DST varies by country and region, with some places not observing it at all.</p>
      
      <p>The transition to and from DST can cause confusion in international scheduling and can even impact health by disrupting sleep patterns. Some areas of the world are considering abolishing the practice due to these issues.</p>
      
      <h2>The International Date Line</h2>
      <p>The International Date Line (IDL) is an imaginary line that runs from the North Pole to the South Pole through the Pacific Ocean. When you cross the IDL from east to west, you add a day; when you cross from west to east, you subtract a day.</p>
      
      <p>The IDL is not straight but zigzags to avoid dividing countries into different days. This creates some interesting situations, such as the possibility of experiencing the same calendar day twice when traveling or being able to step from one day into the next.</p>
      
      <h2>Time Zones in the Digital Age</h2>
      <p>In our interconnected digital world, time zones continue to play a crucial role in global communication, commerce, and travel. Software applications often need to handle complex time zone calculations to ensure accurate scheduling across different regions.</p>
      
      <p>Various standards, such as ISO 8601, have been developed to represent dates and times in a consistent format globally, reducing confusion in international communications.</p>
      
      <h2>Conclusion</h2>
      <p>Time zones are a fundamental aspect of our modern global society, enabling coordination across vast distances while respecting local solar time. Understanding how they work is essential for anyone involved in international business, travel, or communication.</p>
      
      <p>While time zones can sometimes seem complicated, especially with variations like DST and half-hour offsets, they serve an important purpose in helping us organize our increasingly interconnected world.</p>
    `,
    relatedArticles: ["daylight-saving-time", "international-date-line", "history-of-timekeeping"]
  },
  {
    id: "daylight-saving-time",
    title: "Daylight Saving Time Explained: History, Purpose, and Controversies",
    excerpt: "Explore the origins of daylight saving time, how it affects different regions of the world, and the ongoing debates about its utility in modern society.",
    date: "March 22, 2025",
    readTime: "6 min read",
    category: "History",
    author: "Time Zone Team",
    content: `
      <h2>The Origins of Daylight Saving Time</h2>
      <p>Daylight Saving Time (DST) is the practice of advancing clocks by one hour during summer months so that darkness falls later in the day. The modern idea of daylight saving was first proposed in 1895 by George Vernon Hudson, a New Zealand entomologist who valued after-work daylight hours to collect insects.</p>
      
      <p>However, it was not until World War I that DST was first implemented on a national scale, with Germany and its allies adopting it in 1916 as a way to conserve coal during wartime. The United States followed in 1918, but national daylight saving laws were repealed after the war ended.</p>
      
      <h2>Purpose and Benefits</h2>
      <p>The primary purpose of DST is to make better use of daylight during the longer days of summer by shifting an hour of daylight from the morning to the evening. Proponents argue that DST:</p>
      
      <ul>
        <li>Saves energy by reducing the need for artificial lighting in the evening</li>
        <li>Promotes outdoor leisure activities in the evenings</li>
        <li>Reduces traffic accidents by providing more daylight during evening rush hours</li>
        <li>Boosts economic activity with longer evening daylight encouraging shopping and other commercial activities</li>
      </ul>
      
      <h2>Global Implementation</h2>
      <p>DST is not uniformly observed around the world. Many countries near the equator do not use it because day lengths are relatively constant throughout the year. Currently, about 40% of countries worldwide use DST in some form.</p>
      
      <p>In the United States, DST begins on the second Sunday in March and ends on the first Sunday in November. The European Union observes DST from the last Sunday in March to the last Sunday in October. However, the EU has voted to abolish mandatory seasonal time changes, with implementation delayed due to the COVID-19 pandemic.</p>
      
      <h2>Controversies and Criticisms</h2>
      <p>Despite its widespread use, DST remains controversial. Critics argue that:</p>
      
      <ul>
        <li>The energy savings are minimal or non-existent with modern energy usage patterns</li>
        <li>The time changes disrupt sleep patterns and can lead to health issues, including increased heart attacks and strokes</li>
        <li>It causes inconvenience by requiring clock changes twice a year</li>
        <li>It complicates international business and travel scheduling</li>
        <li>Modern society with 24/7 operations makes the original purposes less relevant</li>
      </ul>
      
      <h2>Recent Movements and Changes</h2>
      <p>In recent years, there has been growing momentum to end the practice of changing clocks twice a year. Some advocates propose permanent standard time, while others favor permanent daylight saving time.</p>
      
      <p>Several U.S. states, including Arizona and Hawaii, do not observe DST. Others, like Florida and California, have passed legislation to adopt permanent DST, but federal approval is required for such changes to take effect.</p>
      
      <h2>The Science and Health Impacts</h2>
      <p>Scientific research has increasingly focused on the health impacts of the biannual time shifts. Studies have shown a correlation between the time change and increased rates of heart attacks, workplace injuries, and traffic accidents in the days following the shift, particularly in spring when an hour of sleep is lost.</p>
      
      <p>Chronobiologists, who study the body's internal clock, generally advocate for permanent standard time rather than permanent daylight saving time, arguing that it better aligns with human circadian rhythms.</p>
      
      <h2>Conclusion</h2>
      <p>Daylight Saving Time remains a practice steeped in both practical considerations and ongoing controversy. While it was implemented with energy conservation and better daylight utilization in mind, modern research and changing societal needs have raised questions about its continued relevance.</p>
      
      <p>As debates continue and more regions consider permanent solutions, it's important to understand both the historical context and current arguments surrounding this biannual time adjustment that affects billions of people worldwide.</p>
    `,
    relatedArticles: ["understanding-time-zones", "history-of-timekeeping", "business-across-time-zones"]
  },
  {
    id: "business-across-time-zones",
    title: "Managing Business Across Time Zones: Best Practices",
    excerpt: "Discover effective strategies for scheduling meetings, maintaining productivity, and fostering communication in globally distributed teams spanning multiple time zones.",
    date: "March 18, 2025",
    readTime: "7 min read",
    category: "Business",
    author: "Time Zone Team",
    content: `
      <h2>The Global Workplace Challenge</h2>
      <p>In today's interconnected world, businesses increasingly operate across borders, with team members, clients, and partners spread around the globe. While this global reach offers tremendous advantages in terms of talent access and market opportunities, it also presents unique challenges, particularly when it comes to managing time zone differences.</p>
      
      <h2>Understanding Your Team's Time Zone Distribution</h2>
      <p>The first step in effectively managing across time zones is to develop a clear understanding of where your team members are located and the time differences between them. Creating a visual time zone map can be tremendously helpful, showing at a glance when work hours overlap (or don't) between different locations.</p>
      
      <h2>Effective Meeting Strategies</h2>
      <p>Meetings are often where time zone challenges become most apparent. Some strategies include rotating meeting times, establishing "golden hours" for essential meetings during overlapping work hours, and recording meetings for asynchronous review.</p>
      
      <h2>Asynchronous Communication</h2>
      <p>For globally distributed teams, asynchronous communication becomes essential. This means exchanging information in ways that don't require immediate responses, allowing team members to engage when it fits their schedule. Clear documentation and context are critical for this approach.</p>
      
      <h2>Managing Project Handoffs</h2>
      <p>One advantage of global teams is the potential for "follow-the-sun" workflows, where tasks pass between team members in different time zones, allowing work to continue around the clock. Effective handoff protocols and transparent project management tools are key.</p>
      
      <h2>Technological Solutions</h2>
      <p>Several tools and technologies can help manage time zone challenges, including world time zone meeting planners, collaboration platforms with asynchronous features, and automated scheduling assistants.</p>
      
      <h2>Conclusion</h2>
      <p>While managing business across multiple time zones presents real challenges, with thoughtful practices and the right tools, these challenges can be transformed into competitive advantages.</p>
    `,
    relatedArticles: ["understanding-time-zones", "daylight-saving-time", "jet-lag-prevention"]
  },
  {
    id: "jet-lag-prevention",
    title: "How to Prevent and Manage Jet Lag When Traveling",
    excerpt: "Scientific approaches to minimizing the effects of jet lag when crossing multiple time zones. Learn practical tips for adjusting your sleep schedule before, during, and after travel.",
    date: "March 15, 2025",
    readTime: "5 min read",
    category: "Travel",
    author: "Time Zone Team",
    content: `
      <h2>Understanding Jet Lag</h2>
      <p>Jet lag occurs when your body's internal clock (circadian rhythm) is out of sync with the local time at your destination. It typically happens when you cross multiple time zones rapidly, as during air travel. The severity depends on the number of time zones crossed, direction of travel, and individual factors.</p>
      
      <h2>Before Your Trip: Preparation Strategies</h2>
      <p>Managing jet lag begins before you even board the plane. Gradually adjust your sleep schedule before departure, optimize sleep quality, and stay well-hydrated and nutritionally balanced.</p>
      
      <h2>During Your Flight: In-Transit Techniques</h2>
      <p>Set your watch to your destination's time zone immediately, manage light exposure based on destination time, stay hydrated, avoid alcohol, use caffeine strategically, and keep moving regularly during the flight.</p>
      
      <h2>After Arrival: Adaptation Techniques</h2>
      <p>Get appropriate sunlight exposure based on travel direction, time your meals according to local schedule, exercise strategically during daylight hours, consider melatonin supplements if appropriate, and limit naps to 20-30 minutes.</p>
      
      <h2>Special Considerations</h2>
      <p>Short business trips may warrant staying on home time. Older travelers may need more adjustment time. Those on medications should consult healthcare providers about adjusting medication schedules when crossing time zones.</p>
      
      <h2>Conclusion</h2>
      <p>While jet lag can't be completely avoided when crossing multiple time zones, these strategies can significantly reduce its impact on your travel experience, allowing you to enjoy your destination sooner.</p>
    `,
    relatedArticles: ["understanding-time-zones", "business-across-time-zones", "history-of-timekeeping"]
  },
  {
    id: "history-of-timekeeping",
    title: "The History of Timekeeping: From Sundials to Atomic Clocks",
    excerpt: "Trace the fascinating evolution of humanity's methods for measuring time, from ancient civilizations to the incredibly precise atomic clocks that coordinate global time today.",
    date: "March 10, 2025",
    readTime: "9 min read",
    category: "History",
    author: "Time Zone Team",
    content: `
      <h2>The Dawn of Timekeeping</h2>
      <p>Humans have observed natural cycles like sunrise and sunset since prehistoric times. The history of timekeeping reflects our fundamental need to understand and organize our existence within the flow of time.</p>
      
      <h2>Ancient Timekeeping Methods</h2>
      <p>Early civilizations used sundials (1500 BCE), which tracked the sun's shadow but were useless at night. Water clocks (clepsydrae) followed, measuring time through controlled water flow regardless of sunlight. By the 8th century CE, hourglasses provided portable timekeeping for specific durations.</p>
      
      <h2>Mechanical Revolution: The First Clocks</h2>
      <p>The 13th century saw Europe's first mechanical clocks in church towers, using weights and escapements. By the 16th century, spring mechanisms enabled portable watches as status symbols. Huygens' 1656 pendulum clock dramatically improved accuracy, making home clocks practical.</p>
      
      <h2>Maritime Navigation and the Quest for Precision</h2>
      <p>Accurate timekeeping became critical for determining longitude during sea voyages. John Harrison's 1761 marine chronometer revolutionized navigation by maintaining precise time during long sea journeys despite changing conditions.</p>
      
      <h2>Industrial Revolution and Time Standardization</h2>
      <p>Railways necessitated standardized time, with Britain adopting nationwide railway time in 1847. The 1884 International Meridian Conference established Greenwich as the prime meridian and created the global time zone system we use today.</p>
      
      <h2>Modern Precision: Quartz and Atomic Clocks</h2>
      <p>Quartz clocks (1927) offered millisecond-level accuracy. Atomic clocks followed in 1955, measuring time through atomic vibrations with accuracy to within one second over millions of years. Today's Coordinated Universal Time (UTC) synchronizes global timekeeping through a network of over 400 atomic clocks worldwide.</p>
    `,
    relatedArticles: ["understanding-time-zones", "daylight-saving-time", "international-date-line"]
  },
  {
    id: "international-date-line",
    title: "The International Date Line: Where Today Meets Tomorrow",
    excerpt: "Explore the concept, history, and quirks of the International Date Line - the imaginary line where crossing from east to west or west to east means jumping forward or backward by one calendar day.",
    date: "March 5, 2025",
    readTime: "6 min read",
    category: "Education",
    author: "Time Zone Team",
    content: `
      <h2>What Is the International Date Line?</h2>
      <p>The International Date Line (IDL) is an imaginary line running along the 180° longitude through the Pacific Ocean. It serves as the boundary between calendar days - when you cross westward, you subtract a day; eastward, you add a day.</p>
      
      <h2>Why We Need the International Date Line</h2>
      <p>Without the IDL, circumnavigating the globe would result in gaining or losing a day. This became apparent when Magellan's expedition completed the first global circumnavigation in 1522 and found themselves a day behind local time despite careful record-keeping.</p>
      
      <h2>History and Path</h2>
      <p>The date line concept emerged naturally with global time zones in the late 19th century. While it generally follows the 180° meridian, it zigzags to avoid dividing countries between different days, creating deviations around Russia, Alaska, Kiribati, Fiji, Tonga, and New Zealand.</p>
      
      <h2>Major Changes</h2>
      <p>Significant adjustments include the 1867 Alaska Purchase (moving Alaska to the American side), Samoa's 2011 day shift to align with Australian and New Zealand business days, and Kiribati's 1995 millennial adjustment that made it the first nation to welcome the year 2000.</p>
      
      <h2>Curious Consequences</h2>
      <p>Travelers can experience the same day twice when flying westward across the Pacific or lose a day entirely when traveling eastward. At the Diomede Islands in the Bering Strait, just 2.4 miles apart but on opposite sides of the IDL, there's a 21-hour time difference.</p>
      
      <h2>Practical Implications</h2>
      <p>The date line significantly impacts international business scheduling, travel planning, and legal document timing. Understanding its function is increasingly important in our interconnected global society.</p>
    `,
    relatedArticles: ["understanding-time-zones", "history-of-timekeeping", "daylight-saving-time"]
  }
];

// Get related articles based on IDs
function getRelatedArticles(relatedIds: string[]) {
  return blogArticles.filter(article => relatedIds.includes(article.id));
}

export default function BlogArticlePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [article, setArticle] = useState<typeof blogArticles[0] | null>(null);
  
  // Extract article ID from the URL
  const [, params] = useRoute('/blog/:articleId');
  const articleId = params?.articleId;
  
  // Find the article
  useEffect(() => {
    if (!articleId) return;
    
    const foundArticle = blogArticles.find(a => a.id === articleId);
    if (foundArticle) {
      setArticle(foundArticle);
    }
  }, [articleId]);
  
  // Toggle dark mode
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // If article not found, show error
  if (!article) {
    return (
      <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
        <Helmet>
          <title>Article Not Found - World Clock</title>
          <meta name="description" content="The requested article could not be found." />
        </Helmet>
        
        <Header 
          onToggleTheme={handleToggleTheme} 
          isDarkMode={isDarkMode}
          onToggleSettings={() => {}}
        />
        
        <main className="flex-grow container mx-auto px-4 py-6">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="flex flex-col items-center justify-center h-64">
            <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Sorry, we couldn't find the article you're looking for.
            </p>
            <Link href="/blog">
              <Button>Browse All Articles</Button>
            </Link>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  // Get related articles
  const relatedArticles = article.relatedArticles 
    ? getRelatedArticles(article.relatedArticles)
    : [];
  
  return (
    <div className={`flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900 ${isDarkMode ? 'dark' : ''}`}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{article.title} - World Clock Blog</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={`${article.category.toLowerCase()}, ${article.title.toLowerCase()}, time zones, world clock`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:site_name" content="World Time Zones" />
        <meta property="article:published_time" content={article.date} />
        <meta property="article:section" content={article.category} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": article.title,
            "description": article.excerpt,
            "datePublished": article.date,
            "author": {
              "@type": "Organization",
              "name": article.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "World Time Zones",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            }
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
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </section>
        
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              {article.category}
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
              {article.title}
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-4 max-w-3xl mx-auto">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                {article.date}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                {article.readTime}
              </span>
              <span>By {article.author}</span>
            </div>
          </header>
          
          {/* Article Content */}
          <div className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-8">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
            
            {/* Article Footer */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="text-neutral-500 mr-2">Category:</span>
                  <Link href={`/blog?category=${article.category.toLowerCase()}`}>
                    <span className="text-primary hover:underline">{article.category}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map(relatedArticle => (
                  <Link key={relatedArticle.id} href={`/blog/${relatedArticle.id}`}>
                    <div className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow border border-transparent hover:border-primary/20">
                      <div className="p-4 flex-grow">
                        <div className="text-xs text-neutral-500 mb-2">
                          <span className="inline-flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {relatedArticle.category}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                          {relatedArticle.title}
                        </h3>
                        
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          

        </article>
      </main>
      
      <Footer />
    </div>
  );
}