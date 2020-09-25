import React from "react";
import {
  Container,
  Dimmer,
  Header,
  Image,
  Label,
  Loader,
  Table,
  Message,
  Segment,
  Button,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authAxios } from "../utils";
import { refundSummary } from "../constants";

class RefundSummary extends React.Component {
  state = {
    data: [],
    error: null,
    loading: false,
  };

  componentDidMount() {
    this.handleFetchOrder();
  }

  handleFetchOrder = () => {
    this.setState({ loading: true });
    authAxios
      .get(refundSummary)
      .then((res) => {
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          this.setState({
            error: "You currently do not have an order",
            loading: false,
          });
        } else {
          this.setState({ error: err, loading: false });
        }
      });
  };

  renderVariations = (orderItem) => {
    let text = "";
    orderItem.item_variations.forEach((iv) => {
      text += `${iv.variation.name}: ${iv.value}, `;
    });
    return text;
  };

  render() {
    const { data, error, loading } = this.state;
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return (
      <Container>
        <Header>Refund Summary for returned items</Header>
        {error && (
          <Message
            error
            header="There was an error"
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Segment>
        )}

        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Item name</Table.HeaderCell>
              <Table.HeaderCell>Item price</Table.HeaderCell>
              <Table.HeaderCell>Item quantity</Table.HeaderCell>
              <Table.HeaderCell>Total item price</Table.HeaderCell>
              <Table.HeaderCell>Current status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {data.map((o) => {
            return (
              <Table.Body>
                {data.map((orderItem) => {
                  return (
                    <Table.Row key={orderItem.id}>
                      <Table.Cell>
                        {orderItem.item.title} -{" "}
                        {this.renderVariations(orderItem)}
                      </Table.Cell>
                      <Table.Cell>₹{orderItem.item.price}</Table.Cell>
                      <Table.Cell textAlign="center">
                        {orderItem.quantity}
                      </Table.Cell>
                      <Table.Cell>
                        {orderItem.item.discount_price && (
                          <Label color="green" ribbon>
                            ON DISCOUNT
                          </Label>
                        )}
                        ₹{orderItem.final_price}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Button color="green" size="medium">
                          Refunded
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            );
          })}
        </Table>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(RefundSummary);
