
import React from 'react';

interface FilterContainerProps {
  title: string;
  children: React.ReactNode;
}

const FilterContainer: React.FC<FilterContainerProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FilterContainer;
