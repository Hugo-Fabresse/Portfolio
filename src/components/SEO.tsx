/**
 * SEO — Meta tags for search engines and social sharing.
 *
 * Sets Open Graph, Twitter Card, description, and lang.
 * Uses react-helmet-async to manage <head> tags.
 */

import { Helmet } from "react-helmet-async"

export default function SEO() {
  const title = "Hugo Fabresse — Portfolio"
  const description =
    "Portfolio de Hugo Fabresse — System Architect. C, Low-Level, Security, Architecture."
  const url = "https://hugo-fabresse.github.io/Portfolio/"

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
