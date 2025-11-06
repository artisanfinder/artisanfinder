import React, { FC, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Post, NavigationState } from '../types';
import { mockPosts } from '../services';
import { PostCard } from '../components';

const DiscoverPage: FC<{ setNavigation: Dispatch<SetStateAction<NavigationState>> }> = ({ setNavigation }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6">
       <h2 className="text-2xl font-bold text-primary dark:text-secondary text-center mb-6">Discover</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {posts.map(post => <PostCard key={post.id} post={post} setNavigation={setNavigation} />)}
       </div>
    </div>
  );
};

export default DiscoverPage;