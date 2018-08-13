import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, Link, IndexRoute, hashHistory} from 'react-router';
import * as className from 'classnames';
import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';
import * as reactBootstrap from 'react-bootstrap';
import * as reactDatepicker from 'react-datepicker';
import * as sscGrid from 'ssc-grid';
import * as rcCheckbox from 'rc-checkbox';
import * as rcTree from 'rc-tree';
import * as sscRefer from 'ssc-refer';
import $ from 'jquery';
import Config from './config';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css'
import './less/adminManage.less';
import GlobalStore from './stores/GlobalStore';
import App from './containers/App';
import Bundle from './bundle.js';

import HomeContainer from 'bundle-loader?lazy&name=app-[name]!./containers/adminManage/Home';
import LoginContainer2 from 'bundle-loader?lazy&name=app-[name]!./containers/adminManage/Login';
import MaterialContainer from 'bundle-loader?lazy&name=app-[name]!./containers/adminManage/Material';
import CoinPriceContainer from 'bundle-loader?lazy&name=app-[name]!./containers/adminManage/CoinPrice';
import SourceContainer from 'bundle-loader?lazy&name=app-[name]!./containers/adminManage/Source';
import UserListContainer from 'bundle-loader?lazy&name=app-[name]!./containers/adminManage/UserList';
import TransactionRecordContainer from 'bundle-loader?lazy&name=app-[name]!./containers/adminManage/TransactionRecord';
import TransactionApproveContainer from 'bundle-loader?lazy&name=app-[name]!./containers/adminManage/TransactionApprove';
import AppParamContainer from 'bundle-loader?lazy&name=app-[name]!./containers/adminManage/AppParam';
const Home  = (props) => (<Bundle load={HomeContainer} {...props}>{ (Page) => <Page {...props} />}</Bundle>)
const Login2  = (props) => (<Bundle load={LoginContainer2} {...props}>{ (Page) => <Page {...props} />}</Bundle>)
const Material  = (props) => (<Bundle load={MaterialContainer} {...props}>{ (Page) => <Page {...props} />}</Bundle>)
const CoinPrice  = (props) => (<Bundle load={CoinPriceContainer} {...props}>{ (Page) => <Page {...props} />}</Bundle>)
const Source  = (props) => (<Bundle load={SourceContainer} {...props}>{ (Page) => <Page {...props} />}</Bundle>)
const User  = (props) => (<Bundle load={UserListContainer} {...props}>{ (Page) => <Page {...props} />}</Bundle>)
const TransactionRecord  = (props) => (<Bundle load={TransactionRecordContainer} {...props}>{ (Page) => <Page {...props} />}</Bundle>)
const TransactionApprove  = (props) => (<Bundle load={TransactionApproveContainer} {...props}>{ (Page) => <Page {...props} />}</Bundle>)
const AppParam  = (props) => (<Bundle load={AppParamContainer} {...props}>{ (Page) => <Page {...props} />}</Bundle>)

const requireAuth = (nextState, replace, next) => {
  //切换路由时初始化环境
  GlobalStore.hideAlert();
  // 本地调试环境不进行auth
  if (process.env.NODE_ENV === 'development' || process.env.PROD_SERVER === "1.1.1.1:8888") {
    next();
    return;
  }
  //验证权限
  $.ajax({
    type: "GET",
    url: Config.base.islogin,
    success: data => {
      if (data.success) {
        next();
      } else {
        window.location = Config.base.index;
      }
    }
  });
}

ReactDom.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Login2}/>
      <Route path="/home" component={Home}/>
      <Route path="/material" component={Material}/>
      <Route path="/coinPrice" component={CoinPrice}/>
      <Route path="/source" component={Source}/>
      <Route path="/userList" component={User}/>
      <Route path="/transactionRecord" component={TransactionRecord}/>
      <Route path="/transactionApprove" component={TransactionApprove}/>
      <Route path="/app" component={AppParam}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
