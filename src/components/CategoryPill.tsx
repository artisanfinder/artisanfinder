import React, { FC } from 'react';

export const CategoryPill: FC<{ category: string }> = ({ category }) => {
    return (
        <button className="flex-shrink-0 bg-secondary/20 text-secondary dark:bg-accent/20 dark:text-accent font-semibold py-2 px-5 rounded-full hover:bg-secondary/30 dark:hover:bg-accent/30 transition-colors">
            {category}
        </button>
    );
};

export default CategoryPill;