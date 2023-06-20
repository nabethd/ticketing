import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/nuild-client";
import { currentUserRouteUrl } from "../constant";
import Header from "../components/header";

export const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (apContext) => {
  const client = buildClient(apContext.ctx);
  const { data } = await client.get(currentUserRouteUrl);
  let pageProps = {};
  if (apContext.Component.getInitialProps) {
    pageProps = await apContext.Component.getInitialProps(apContext.ctx);
  }
  return { pageProps, ...data };
};

export default AppComponent;
