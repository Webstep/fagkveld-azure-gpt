import { Skeleton } from "./ui/skeleton";

export const Loading = () => (
  <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>
);

export const LoadingImage = () => (
  <div className="flex-1">
    <Skeleton className=" aspect-square" />
  </div>
);
