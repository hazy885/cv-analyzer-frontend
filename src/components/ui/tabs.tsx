import * as React from "react";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ 
  value, 
  onValueChange, 
  children,
  className = ""
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ 
  children,
  className = ""
}) => {
  return (
    <div className={`inline-flex items-center justify-center rounded-md bg-gray-100 p-1 dark:bg-gray-800 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
  activeValue?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  children,
  className = "",
  onValueChange,
  activeValue
}) => {
  const isActive = activeValue === value;
  
  const handleClick = () => {
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={handleClick}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50 ${className}`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  activeValue?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ 
  value, 
  children,
  className = "",
  activeValue
}) => {
  const isActive = activeValue === value;
  
  if (!isActive) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 ${className}`}
    >
      {children}
    </div>
  );
};