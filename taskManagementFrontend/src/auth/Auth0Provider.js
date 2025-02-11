/*import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = "dev-ybtd1lnmgfq4net6.us.auth0.com";
const clientId = "QeEU3Dkc0UzZ2W3sfi2u14dkVk2vpK2Y";
const audience = "https://taskmanagement.api";

const AuthProvider = ({ children }) => {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: audience,
        redirect_uri: window.location.origin,
        scope: "read:tasks write:tasks delete:tasks"
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;*/
