import App from 'next/app';
import Head from 'next/head';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/styles.css';

class Wrapper extends React.Component {
  state = { workaround: false };
  componentDidMount() {
    this.setState({ workaround: true });
  }
  render() {
    if (!this.state.workaround) {
      return <div>Loading...</div>;
    }
    const { children } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>Sample App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
        </Head>
        <AppProvider apiKey={API_KEY}>{children}</AppProvider>
      </React.Fragment>
    );
  }
}

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
    );
  }
}

export default MyApp;
