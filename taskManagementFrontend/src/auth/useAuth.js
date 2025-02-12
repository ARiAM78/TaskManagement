/*import { useAuth0 } from "@auth0/auth0-react";

export const useAuth = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const getAccessToken = async () => {
    try {
        const token = await getAccessTokenSilently();
        console.log("Token:", token); // Ensure token is printed
        return token;
    } catch (error) {
        console.error("Error getting token:", error);
        return null;
    }
  };

  return {
    login: loginWithRedirect,
    logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
    user,
    isAuthenticated,
    getAccessToken,
  };
};*/