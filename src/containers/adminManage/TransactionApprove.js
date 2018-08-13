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
import ModalView from '../../components/adminManage/transaction/ModalView';
import Menu from '@/containers/adminManage/Menu';
import Top from '@/containers/adminManage/Top';
const store = new adminManageStore();
@observer
export default class TransactionApprove extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowsName: [{code:'id',name:'id',hidden:true},{code:'nickName',name:'用户名',hidden:true},{code:'myUserName',name:'用户名'}
                ,{code:'money',name:'金额'}  ,{code:'type',name:'交易类型' } ,{code:'recordCode',name:'交易金额',hidden:true},{code:'coinNum',name:'数量'},{code:'buyUserCode',name:'购买人标识',hidden:true}
                ,{code:'buyUserName',name:'购买人昵称',hidden:true},{code:'userName',name:'姓名',hidden:true}
                ,{code:'payType',name:'支付类型'},
                {code:'isDeleted',name:'交易状态'},
                {code:'gmtCreate',name:'交易时间'}
                ,{code:'gmtModified',name:'修改时间',hidden:true}
            ],
            show:false ,
            checkBuyCoinOptions:[{name:"未审核",code:0},{name:"审核通过",code:1},{name:"删除",code:2},{name:"审核不通过",code:3}],
            checkBuyInvitationOptions:[{name:"未审核",code:0},{name:"审核通过",code:1},{name:"删除",code:2},{name:"审核不通过",code:3}],
            checkWithdrawDepositOptions:[{name:"未审核",code:0},{name:"审核通过",code:1},{name:"删除",code:2},{name:"审核不通过",code:3}],
            options:[],
            operationData:{},
            tab:[{name:"能源币",code:[1]},/*{name:"邀请码",code:[5,6]},*/{name:"提现",code:[4]}],
            tabIndex:0,
            tableData:[],
            item:1,
            operationType:0   ,  //0 checkBuyCoin   1 checkBuyInvitation   2 checkWithdrawDeposit
            currentPage:1,
            pageSize:10,
            typeList:[
                {code:"",name:"--请选择交易类型--"},
                {code:1,name:"购买能源币"},{code:2,name:"转让余额"},{code:3,name:"奖励"},{code:4,name:"提现"},
                {code:5,name:"购买邀请码"},{code:6,name:"转让邀请码"},{code:7,name:"转入余额"},{code:8,name:"转入邀请码"}
            ],
            payTypeList:[
                {code:1,name:"余额"},{code:2,name:"银行卡"}
            ],
            isDeletedList:[
                {code:"",name:"--请选择交易状态--"},
                {code:0,name:"未审核"},{code:1,name:"审核通过"},{code:2,name:"删除"},{code:3,name:"审核不通过"}
            ],
            userName:"",
            selectObj:{
                isDeleted:'',
                type:''
            }

        }
    }

    componentDidMount(){
        this.getDataList();
    }

    getDataList=()=>{
        let param ={
            currentPage	:this.state.currentPage ,
            pageSize:100,
            userName:this.state.userName,
            type:this.state.selectObj["type"],
            isDeleted:this.state.selectObj["isDeleted"]

        }
        store.getTransactionRecord(param,(data)=>{
            this.filterData(this.state.tab[this.state.tabIndex]["code"],data);
        })


    }

    dataFormat = (type,rows,cell)=>{

        if(type =="isDeleted"){
            let result = this.commonFilter(cell.isDeleted , this.state.isDeletedList);
            return (
                <span title={result}>{result}</span>
            )

        }else if(type == "type"){
            let result = this.commonFilter(cell.type , this.state.typeList);
            return (
                <span title={result}>{result}</span>
            )
        }else if(type=='payType'){
            let result = this.commonFilter(cell.payType , this.state.payTypeList);
            return (
                <span title={result}>{result}</span>
            )
        }
        else{
            return (
                <span title={rows}>{rows}</span>
            )

        }



    }
    checkBuyCoin = (rows,isDeleted)=>{
       /* let options = this.state.checkBuyCoinOptions
        this.setState({
            show:true ,
            operationType:0,
            operationData:rows,
            options
        })*/
        //let isDeleted  = ( rows.isDeleted == 1 ? 3 : (rows.isDeleted ==3 ? 1 :""));
        this.setState({
            operationType:0,
        },()=> {
            this.saveModal("", {id: rows.id, isDeleted: isDeleted})
        })

    }
    checkBuyInvitation =(rows,isDeleted)=>{
      /*  let options = this.state.checkBuyInvitationOptions
        this.setState({
            show:true ,
            operationData:rows,
            operationType:1,
            options
        })*/
       // let isDeleted  = ( rows.isDeleted == 1 ? 3 : (rows.isDeleted ==3 ? 1 :""));
        this.setState({
            operationType:1,
        },()=> {
            this.saveModal("", {id: rows.id, isDeleted: isDeleted})
        })
    }
    checkWithdrawDeposit =(rows,isDeleted)=>{
        // let options = this.state.checkWithdrawDepositOptions
        // this.setState({
        //     show:true ,
        //     operationType:2,
        //     operationData:rows,
        //     options
        // })
       // let isDeleted  = ( rows.isDeleted == 1 ? 3 : (rows.isDeleted ==3 ? 1 :""));
        this.setState({
            operationType:2,
        },()=> {
            this.saveModal("", {id: rows.id, isDeleted: isDeleted})
        })
    }
    closeModal=()=>{
        this.setState({
            show:false
        })
    }
    saveModal =(data,obj)=>{
        let  operationType = this.state.operationType , operationData = this.state.operationData ;
        let param ={
            id:operationData.id,
            isDeleted:data
        }
        let params = obj ? obj : param ;
        store.checkTransaction(operationType,params,()=>{
            this.getDataList();
            if(this.state.show)
                this.closeModal();
        })

    }

    setTab =(list , index)=>{

        //this.filterData(list);
        this.setState({
            tabIndex:index,
        },()=>{
            this.getDataList();
        })

    }

    filterData = (list,tabData)=>{
        let result  =[] ;
        //this.getDataList();
        const data= tabData||store.transactionRecordList ;
        if(!list || list.length <=0 ){
            result = data ;  //查询全部
        }else{
            list.map((m,n)=>{
                let  d = _.remove(data,(x,y)=>{
                    return x.type == m ;
                })

                result = d  ;
            })
        }
        this.setState({
            tableData : result
        })
    }


    commonFilter =( param , list) =>{
        let result = "";
        list.map((m)=>{
            if(param == m.code ){
                result = m.name ;
                return ;
            }
        })
        return result ;

    }

    onPageChange =()=>{

    }

    optionDom = ()=>{
        return (
            <TableHeaderColumn width='150px' dataFormat = {
                (cell,row)=>{
                  /*  return(
                        <div className="a-tab-button">
                            { ( row.type =="1")?(<span className="mr5" title="审核能源币" onClick={this.checkBuyCoin.bind(this,row)}>{row.isDeleted == 1 ? "不通过" : "通过"}</span>) :''}
                            {row.type =="5"||row.type =="6" ?(<span className="mr5" title="审核邀请码" onClick={this.checkBuyInvitation.bind(this,row)}>{row.isDeleted == 1 ? "不通过" : (row.isDeleted == 3 ? "通过":"" )}</span>):""}
                            {row.type =="4" ? (<span title="审核提现" onClick={this.checkWithdrawDeposit.bind(this,row)}>审核</span>):""}
                        </div>
                    )*/

                    if(row.type == "1"){
                        return (
                            <div className="a-tab-button">
                                <span className="mr5" title="通过" onClick={this.checkBuyCoin.bind(this,row,1)}> 通过</span>
                                <span className="mr5" title="不通过" onClick={this.checkBuyCoin.bind(this,row,3)}> 不通过</span>
                            </div>
                        )
                    }
                    if(row.type == 4){
                        return (
                            <div className="a-tab-button">
                                <span title="通过" className="mr5" onClick={this.checkWithdrawDeposit.bind(this,row,1)}>通过</span>
                                <span title="不通过" className="mr5" onClick={this.checkWithdrawDeposit.bind(this,row,3)}>不通过</span>
                            </div>
                        )
                    }

                }
            }>操作</TableHeaderColumn>
        )
    }

    setInput = (e) =>{
        this.setState({
            userName : e.target.value
        })
    }

    setSelect = ( type , e ) =>{
        let selectObj = this.state.selectObj ;
        selectObj[type ]= e.target.value  ;
        this.setState({
            selectObj
        })
    }

    queryData = () =>{
        this.getDataList((data)=>{
            this.setState({
                tableData:data
            })
        });
    }

    render(){
        const  options ={
            noDataText:"暂无数据",
            dataTotalSize:store.pageInfo.count,
            onPageChange:this.onPageChange
        }
        return(
            <div className="a-box">
                <Top />
                <Menu tag="transactionApprove"/>
                <div className="a-container">
                    <h3>交易记录审批列表</h3>
                    <form className="form-inline mt10 mb10">
                        <input type="text" className="form-control fl mr15" onChange={this.setInput} value={this.state.userName} placeholder="请输入用户名"/>

                        <select className="form-control fl mr15" placeholder="交易类型" onChange={this.setSelect.bind(this,"type")}>
                            {this.state.typeList.map((m,n)=>{
                                return(
                                    <option key={n} value={m.code}>{m.name}</option>
                                )
                            })}
                        </select>
                        <select className="form-control fl mr15" placeholder="交易状态" onChange={this.setSelect.bind(this,"isDeleted")}>
                            {this.state.isDeletedList.map((m,n)=>{
                                return(
                                    <option key={n}  value={m.code}>{m.name}</option>
                                )
                            })}
                        </select>
                        <button className="btn btn-info" onClick={this.queryData}><i className="glyphicon glyphicon-search mr5"></i>查询</button>
                    </form>


                    <ul className="a-nav-ul mt10 mb10">
                        {this.state.tab.map((m,n)=>{
                            return (
                                <li key={n} className={n== this.state.tabIndex?"active":""} onClick={this.setTab.bind(this,m.code,n)}>{m.name}</li>
                            )
                        })}

                    </ul>

                    <BootstrapTable data={this.state.tableData} striped hover options={options} pagination >
                        <TableHeaderColumn isKey dataField='id' hidden>Product ID</TableHeaderColumn>
                        {this.state.rowsName.map((m,n)=>{
                            if(!m.hidden ){
                                return (
                                    <TableHeaderColumn dataField={m.code} dataFormat={this.dataFormat.bind(this,m.code)}>{m.name}</TableHeaderColumn>
                                )
                            }
                        })}

                        {this.optionDom()}

                    </BootstrapTable>
                </div>
                <ModalView show={this.state.show} options={this.state.options} closeModal={this.closeModal} saveModal={this.saveModal}/>
            </div>
        )
    }
}