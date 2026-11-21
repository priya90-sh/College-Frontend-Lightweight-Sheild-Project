import { API_BASE_URL } from "../services/apiBase";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerkId = user?.id;
  const clerkEmail = user?.primaryEmailAddress?.emailAddress;
  const clerkRole = user?.publicMetadata?.role;
  const [permissions, setPermissions] = useState(null);
  const [loadingDb, setLoadingDb] = useState(true);

  useEffect(() => {
    let isMounted = true; // Prevents race conditions during multiple renders

    const syncAndFetchPermissions = async () => {
      setLoadingDb(true); 
      try {
        // 1. Send the Clerk ID, Email, AND CLERK ROLE to MongoDB
        await fetch(`${API_BASE_URL}/api/auth/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            clerk_id: clerkId, 
            email: clerkEmail,
            role: clerkRole 
          })
        });

        // 2. Fetch their specific MongoDB permissions
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_BASE_URL}/api/auth/permissions?clerk_id=${clerkId}&t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Only update state if the component is still mounted
          if (isMounted) setPermissions(data);
        } else {
          console.error("Failed to fetch permissions, status:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch DB permissions", error);
      } finally {
        if (isMounted) setLoadingDb(false);
      }
    };

    if (isLoaded) {
      if (isSignedIn && clerkId) {
        syncAndFetchPermissions();
      } else if (!isSignedIn) {
        if (isMounted) {
          setPermissions(null);
          setLoadingDb(false);
        }
      }
    }
    
    // Cleanup function blocks outdated network responses
    return () => {
      isMounted = false; 
    };
  }, [isLoaded, isSignedIn, clerkId, clerkEmail, clerkRole]); 

  return (
    <PermissionContext.Provider value={{ permissions, loadingDb }}>
      {children}
    </PermissionContext.Provider>
  );
};

// This hook is intentionally exported alongside its provider for a single context API.
// eslint-disable-next-line react-refresh/only-export-components
export const usePermissions = () => useContext(PermissionContext);