import { EmptyState, Layout, Page, ResourcePicker } from '@shopify/polaris';
import store from 'store-js';
import ResourceListWithProducts from '../components/ResourceList';

class Index extends React.Component {
  state = { open: false };
  render() {
    return (
      <Page
        primaryAction={{
          content: 'Select products',
          onAction: () => this.setState({ open: true }),
        }}
      >
        <Layout>
          <ResourcePicker
            resourceType="Product"
            showVariants={false}
            open={this.state.open}
            onSelection={(resources) => this.handleSelection(resources)}
            onCancel={() => this.setState({ open: false })}
          />

          <EmptyState
            heading="Select products to start"
            action={{
              content: 'Select Products',
              onAction: () => this.setState({ open: true }),
            }}
            image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
          >
            <p>Select products and change their price temporarily.</p>
          </EmptyState>
          <ResourceListWithProducts />
        </Layout>
      </Page>
    );
  }
  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    store.set('ids', idsFromResources);
    this.setState({ open: false });
  };
}

export default Index;
