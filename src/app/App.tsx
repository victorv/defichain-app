import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import store from "./rootStore";
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./App.scss";
import Sidebar from "../components/Sidebar/Sidebar";
import SyncStatus from "../components/SyncStatus/SyncStatus";
import WalletPage from "../containers/WalletPage/WalletPage";
import SendPage from "../containers/WalletPage/SendPage";
import ReceivePage from "../containers/WalletPage/ReceivePage";
import PaymentRequestPage from "../containers/WalletPage/PaymentRequestPage";
import MasternodesPage from "../containers/MasternodesPage/MasternodesPage";
import BlockchainPage from "../containers/BlockchainPage/BlockchainPage";
import BlockPage from "../containers/BlockchainPage/BlockPage";
import MinerPage from "../containers/BlockchainPage/MinerPage";
import ExchangePage from "../containers/ExchangePage/ExchangePage";
import HelpPage from "../containers/HelpPage/HelpPage";
import Error404Page from "../containers/Errors/Error404Page";
import SettingsPage from "../containers/SettingsPage/SettingsPage";

class App extends Component<RouteComponentProps, { prevDepth: Function }> {
  getPathDepth = (location: any) => {
    return (location || {}).pathname.split("/").length;
  };

  state = {
    prevDepth: this.getPathDepth(this.props.location)
  };

  determineTransition = () => {
    const depth = this.getPathDepth(this.props.location) - this.state.prevDepth;
    if (depth < 0) {
      return ["transit-pop", 300];
    } else if (depth > 0) {
      return ["transit-push", 300];
    } else {
      return ["transit-fade", 30];
    }
  };

  componentWillReceiveProps() {
    console.log(this.props.location);
    this.setState({
      prevDepth: this.getPathDepth(this.props.location)
    });
  }

  render() {
    return (
      <Provider store={store}>
        <div id="app">
          <Helmet>
            <title>DeFi Blockchain Client</title>
          </Helmet>
          <Sidebar />
          <main>
            <SyncStatus />
            <TransitionGroup
              className="transition-group"
              childFactory={child =>
                React.cloneElement(child, {
                  classNames: this.determineTransition()[0],
                  timeout: this.determineTransition()[1]
                })
              }
            >
              <CSSTransition timeout={300} key={this.props.location.key}>
                <Switch location={this.props.location}>
                  <Route exact path="/" component={WalletPage} />
                  <Route exact path="/wallet/send" component={SendPage} />
                  <Route exact path="/wallet/receive" component={ReceivePage} />
                  <Route
                    exact
                    path="/wallet/paymentrequest/:id"
                    component={PaymentRequestPage}
                  />
                  <Route
                    exact
                    path="/masternodes"
                    component={MasternodesPage}
                  />
                  <Route exact path="/blockchain" component={BlockchainPage} />
                  <Route
                    exact
                    path="/blockchain/block/:height"
                    component={BlockPage}
                  />
                  <Route
                    exact
                    path="/blockchain/miner/:id"
                    component={MinerPage}
                  />
                  <Route exact path="/exchange" component={ExchangePage} />
                  <Route exact path="/help" component={HelpPage} />
                  <Route exact path="/settings" component={SettingsPage} />
                  <Route exact component={Error404Page} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </main>
        </div>
      </Provider>
    );
  }
}

export default withRouter(App);