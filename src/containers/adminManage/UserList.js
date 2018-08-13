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
export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //{code:'nickName',name:'昵称',hidden:true},{code:'inviterNickName',name:'邀请人昵称',hidden:true }
            rowsName: [{code:'id',name:'id',hidden:true},{code:'userCode',name:'用户标识',hidden:true},{code:'inviterUserName',name:'邀请人用户名'}
                ,,{code:'invitationCode',name:'邀请码' },
                {code:'phone',name:'电话' },{code:'userName',name:'用户名'},{code:'password',name:'密码',hidden:true},
                {code:'investment',name:'总投资'},{code:'remainingSum',name:'余额',hidden:true},{code:'earnings',name:'收益',hidden:true},
                {code:'coinNumber',name:'能源币个数',hidden:true},{code:'deductCoinNumber',name:'扣除能源币个数',hidden:true},{code:'invitationCodeNum',name:'邀请码个数',hidden:true},
                {code:'realName',name:'真实姓名',hidden:true},{code:'alipayNo',name:'支付宝账号'},{code:'transactionPassword',name:'交易密码',hidden:true},
                {code:'bankCardNumber',name:'银行卡号'},{code:'bankOfDeposit',name:'开户行'},
                {code:'headPortrait',name:'头像',hidden:true},{code:'score',name:'积分',hidden:true},{code:'token',name:'token',hidden:true},
                {code:'isDeleted',name:'删除状态',hidden:true},{code:'gmtCreate',name:'创建时间',hidden:true},{code:'gmtModified',name:'修改时间',hidden:true},
            ],
            show:false ,
            operationData:{},
            item:1,
            operationType:'preview'   ,  // preview 预览  edit 编辑  add 新增
            userName:"",
            currentPage:1,
            pageSize:100
        }
    }

    componentWillMount(){
        this.getDataList();
    }

    getDataList=()=>{
        let state= this.state ;
        let param ={
            currentPage	:state.currentPage ,
            pageSize:state.pageSize,
            userName:state.userName
        }
        store.getUserList(param,(data)=>{
        })


    }

    dataFormat = (type,rows,cell)=>{
        return (
            <span title={rows}>{rows}</span>
        )

    }

    addRows =()=>{
        this.setState({
            show:true,
            operationType:'add',
            data:{}
        })

    }
    previewRows = (rows)=>{
        this.setState({
            show:true ,
            operationData:rows,
            operationType:'preview'
        })

    }
    editRows = (rows)=>{
        this.setState({
            show:true ,
            operationData:rows,
            operationType:'edit'
        })
    }
    deleteRows =(rows)=>{
        globalStore.showTipsModal("是否删除","small",()=>{},()=>{
            store.deleteMaterial(rows,()=>{
                this.getMaterialList()
            });
        })

    }
    closeModal = ()=>{
        this.setState({
            show:false
        })
    }

    changeItem =( item )=>{
        this.setState({
            item
        },()=>{
            this.getMaterialList()
        })

    }

    saveModal = (data)=>{
        if(this.state.operationType =="add"){
            store.saveMaterial(data,()=>{
                this.closeModal();
                this.getMaterialList();
            })
        }else{
            store.updateMaterial(data,()=>{
                this.closeModal();
                this.getMaterialList();
            })
        }
    }


    getUserStatu =(rows)=>{
        //	0：解冻；1：冻结
        let param ={
            userCode:rows.userCode ,
            type:rows.isDeleted == 0 ? 1 :0
        };
        if(rows.isDeleted == 0){
            param.token = rows.token ;
        }
        globalStore.showTipsModal("是否" + (rows.isDeleted ==0 ? "冻结":"解冻") + "该用户?","small",()=>{},()=>{
            store.freezeUser(param,()=>{
                this.getDataList()
            })
        });

    }


    setUserName = (e)=>{
        this.setState({
            userName:e.target.value
        })
    }

    render(){
        console.log(store.ListMaterial)
        const  options ={
            noDataText:"暂无数据"
        }
        return(
            <div className="a-box">
                <Top />
                <Menu tag="userList"/>
                <div className="a-container">

                    <h3>用户列表</h3>
                    <form className="form-inline mt10 mb10">
                        <input type="text" className="form-control fl mr15" onChange={this.setUserName} value={this.state.userName} placeholder="请输入用户名"/>
                        <button className="btn btn-info" onClick={this.getDataList}><i className="glyphicon glyphicon-search mr5"></i>查询</button>
                    </form>
                    <BootstrapTable data={store.userList} striped hover options={options}>
                        <TableHeaderColumn isKey dataField='id' hidden>Product ID</TableHeaderColumn>
                        {this.state.rowsName.map((m,n)=>{
                            if(!m.hidden ){
                                return (
                                    <TableHeaderColumn dataField={m.code} dataFormat={this.dataFormat.bind(this,m.code)}>{m.name}</TableHeaderColumn>
                                )
                            }
                        })}
                        <TableHeaderColumn width="120px"  dataFormat = {
                            (cell,row)=>{
                                return(
                                    <div className="a-operation-box">
                                        <span className="mr10" onClick={this.previewRows.bind(this,row)} title="查看">查看</span>
                                        <span title={row.isDeleted == 0 ? "冻结" :"解冻"} onClick={this.getUserStatu.bind(this,row)}>{row.isDeleted == 0 ? "冻结" :"解冻"}</span>
                                    </div>
                                )
                            }
                        }>操作</TableHeaderColumn>

                    </BootstrapTable>
                    <ModalView show= {this.state.show} saveModal = {this.saveModal} closeModal={this.closeModal} rowsName ={this.state.rowsName} data={this.state.operationData} type={this.state.operationType}/>
                </div>

            </div>
        )
    }
}