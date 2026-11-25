import { useEffect } from 'react';

// Sets document.title for a page: "Now · Jason Chin", or just "Jason Chin".
export default function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Jason Chin` : 'Jason Chin';
  }, [title]);
}
