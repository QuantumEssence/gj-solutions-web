import { useState, useEffect } from 'react';
import { sanityClient, isSanityConfigured } from '../sanity/client';
import type { PageBlock } from '../sanity/types';
import { FALLBACK_HOME_BLOCKS } from '../sanity/fallbacks';
import { BlockRenderer } from '../components/modular/BlockRenderer';
import './Home.css';

const HOME_PAGE_QUERY = `*[_type == "page" && slug.current == "home"][0]{
  title,
  pageBuilder[]{
    ...,
    _type,
    _key
  }
}`;

const Home = () => {
  const [blocks, setBlocks] = useState<PageBlock[]>(FALLBACK_HOME_BLOCKS);
  const [isLoading, setIsLoading] = useState<boolean>(isSanityConfigured);

  useEffect(() => {
    if (!isSanityConfigured) {
      return;
    }

    let isMounted = true;
    async function fetchSanityPage() {
      try {
        const data = await sanityClient.fetch(HOME_PAGE_QUERY);
        if (isMounted && data?.pageBuilder && Array.isArray(data.pageBuilder) && data.pageBuilder.length > 0) {
          setBlocks(data.pageBuilder);
        }
      } catch (err) {
        console.warn('[Sanity] Could not fetch remote pageBuilder blocks, using default layout:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSanityPage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-container fade-in">
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#0D9488' }}>
          <p>Loading modular content...</p>
        </div>
      ) : (
        <BlockRenderer blocks={blocks} />
      )}
    </div>
  );
};

export default Home;
