import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://desasukabanjar.vercel.app';
  const currentDate = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/profil',
    '/statistik',
    '/berita',
    '/galeri',
    '/umkm',
    '/wisata',
    '/peta',
    '/aspirasi',
    '/kkn',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency:
      route === '' || route === '/berita' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic article routes
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await prisma.article.findMany({
      where: { isDraft: false },
      select: { slug: true, updatedAt: true, createdAt: true },
      take: 100,
    });

    articleRoutes = articles.map((art) => ({
      url: `${baseUrl}/berita/${art.slug}`,
      lastModified: art.updatedAt || art.createdAt || currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.warn('Error fetching articles for sitemap:', err);
  }

  return [...staticRoutes, ...articleRoutes];
}
