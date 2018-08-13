/** 素材
 * */
import React from 'react';
import {observer} from 'mobx-react';
import globalStore from '../../stores/GlobalStore';
import _ from  'lodash';
import Util from '../../common/utils';
import {Button,Modal} from 'react-bootstrap';
import adminManageStore from '../../stores/adminManage/adminManageStore';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ModalView from '../../components/adminManage/material/ModalView';
import Menu from '@/containers/adminManage/Menu';
import Top from '@/containers/adminManage/Top';

const store = new adminManageStore();
@observer
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           data:{}

        }
    }

    componentWillMount(){
        this.getDataList();
    }

    getDataList=()=>{

        store.getIndex((data)=>{
            this.setState({data})
        })


    }

    render(){
        let data = this.state.data;
        return(
            <div className="a-box">
                <Top/>
                <Menu tag="home"/>
                <div className="a-container row">
                    <div className={"a-total-num col-md-5"}>
                        <h2>平台总人数</h2>
                        <p>{data.countAppUser}</p>
                    </div>
                    <div className="a-total-money col-md-5 fr">
                        <h2>平台结余总金额</h2>
                        <p>{data.countRemainingSum}</p>
                    </div>
                    <div className="a-total-invest col-md-5">
                        <h2>平台总投资</h2>
                        <p>{data.countInvestMoney}</p>
                    </div>
                    <div className="a-total-cash col-md-5 fr">
                        <h2>平台总提现</h2>
                        <p>{data.countWithdrawMoney}</p>
                    </div>

                </div>
            </div>
        )
    }
}