import { Skeleton } from "./ui/skeleton";

export const LoadingMessage = () => (
  <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

type LoadingImageProps = {
  className?: string;
};

export const LoadingImage = ({ className = "flex-1" }: LoadingImageProps) => (
  <div className={className}>
    <Skeleton className="aspect-square" />
  </div>
);
