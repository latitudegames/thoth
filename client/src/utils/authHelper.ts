export const setAuthHeader = (authData) => {
  const authHeader = {
    Authorization: "Basic " + authData,
  };
  window.localStorage.setItem("authHeader", JSON.stringify(authHeader));
};

export const getAuthHeader = () => {
  const header = window.localStorage.getItem("authHeader");
  return JSON.parse(header || "{}");
};
