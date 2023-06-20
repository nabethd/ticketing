import buildClient from "../api/nuild-client";
import { currentUserRouteUrl } from "../constant";

const LandingPage = ({ currentUser }) => {
  const landingPageTitle = currentUser
    ? "You are signed in"
    : "You are NOT signed in";
  return <h1>{landingPageTitle}</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get(currentUserRouteUrl);
  return data;
};

export default LandingPage;
