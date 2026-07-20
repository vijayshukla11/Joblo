import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  schema?: Record<string, any>;
  h1Text?: string;
}

export default function SEO({ title, description, canonical, schema, h1Text }: SEOProps) {
  const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Log tracking metric for Data Analyst
    console.log(`[Analytics] SEO Pageview tracked: ${title}`);
  }, [title]);

  return (
    <>
      {/* React 19 automatically hoists title, meta, and link elements to the document <head> */}
      <title>{`${title} | JOB Lo India`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="jobs, hiring, careers, India jobs, corporate vacancies, n8n automated jobs, government exams" />
      <meta property="og:title" content={`${title} | JOB Lo India`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | JOB Lo India`} />
      <meta name="twitter:description" content={description} />
      
      <link rel="canonical" href={currentUrl} />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}

      {/* Accessibly hidden H1 for screen readers if requested */}
      {h1Text && (
        <h1 className="sr-only" aria-live="polite">
          {h1Text}
        </h1>
      )}
    </>
  );
}
