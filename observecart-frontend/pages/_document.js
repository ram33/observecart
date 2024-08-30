// pages/_document.tsx
const newrelic = require("newrelic");
import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

class RootDocument extends Document {
  static async getInitialProps(context) {
    const initialProps = await Document.getInitialProps(context)

    if (newrelic.agent.collector.isConnected() === false) {
      await new Promise((resolve) => {
        newrelic.agent.on("connected", resolve)
      })
    }

    const browserTimingHeader = newrelic.getBrowserTimingHeader({
      hasToRemoveScriptWrapper: true,
      allowTransactionlessInjection: true,
    })

    return {
      ...initialProps,
      browserTimingHeader,
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{ __html: this.props.browserTimingHeader }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default RootDocument;