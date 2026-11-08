import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'demo-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-03-01',
  useCdn: true,
  token: import.meta.env.VITE_SANITY_API_TOKEN || undefined
};

export const isSanityConfigured = Boolean(
  import.meta.env.VITE_SANITY_PROJECT_ID && 
  import.meta.env.VITE_SANITY_PROJECT_ID !== 'demo-project-id'
);

export const sanityClient = createClient(sanityConfig);

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
