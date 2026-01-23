import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  console.log("Protected route startes working");

  if (isLoading) {
    console.log(isLoading, "Loading auth");
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  console.log(user, "User Login in");

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
