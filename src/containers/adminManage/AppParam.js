/** APP
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
export default class AppParam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowsName: [{code:'id',name:'id',hidden:true},
                {code:'realName',name:'账户姓名',add:true },
                {code:'bankOfDeposit',name:'开户行',add:true },
                {code:'todayPrice',name:"今日单价",add:true},
                {code:'invitationPrice',name:'邀请码价格',add:true,hidden:true },
                {code:'earningsRatio',name:'收益比例',add:true ,hidden:true},{code:'serviceCharge',name:'提现手续费比例',add:true,hidden:true },
                {code:'energyScoreRatio',name:'提现转换积分比例',add:true ,hidden:true},{code:'toAccount',name:'实际到账比例',add:true,hidden:true },
                {code:'outMultiple',name:'出局占总投资倍数',add:true ,hidden:true},{code:'firstGrade',name:'一级收益',add:true,hidden:true },
                {code:'secondGrade',name:'二级收益',add:true ,hidden:true},{code:'totalUsers',name:'当前在线总人数',add:true },
                {code:'publicBankNumber',name:'对公账户',add:true },{code:'realName',name:'账户姓名',add:true },
                {code:'bankOfDeposit',name:'开户行',add:true },{code:'remarks',name:'备注',add:true },
                {code:'isDeleted',name:'删除状态',hidden:true},
                {code:'gmtCreate',name:'创建时间',type:"date",hidden:true},{code:'gmtModified',name:'修改时间',type:"date",hidden:true},
            ],
            show:false ,
            operationData:{},
            item:1,
            operationType:'preview'   ,  // preview 预览  edit 编辑  add 新增

        }
    }

    componentWillMount(){
        this.getDataList();
    }

    getDataList=()=>{

        store.getAppList();


    }

    dataFormat = (type,rows,cell)=>{
        if(type=="type"){

        }else{
            return (
                <span>{rows}</span>
            )
        }

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
                this.getDataList();
            })
        }else{
            delete data.isDeleted ;
            delete data.gmtCreate ;
            delete data.gmtModified ;
            store.updateApp(data,()=>{
                this.closeModal();
                this.getDataList();
            })
        }


    }
    render(){
        const  options ={
            noDataText:"暂无数据"
        }
        let data = store.appList.length>0 ?  store.appList[0]:[];
        return(
            <div className="a-box">
                <Top />
                <Menu tag="app"/>
                <div className="a-container">
                    <h3>App运营参数</h3>

                    <div className="fr mb10">
                        <Button bsStyle="info" onClick={this.editRows.bind(this,data)}>编辑</Button>
                    </div>
                    <div className="row a-preview fl">
                        {this.state.rowsName.map((m,n)=>{
                            return(
                                <div className={ m.code !="img" ? "col-md-6 a-preview-col":"col-md-12"} key={n}>
                                    <label>{m.name}:</label>
                                    {m.code =="img"?(<img src={data[m.code]} style={{width:"200px"}}/>):(<span>{data[m.code]}</span>)}
                                </div>
                            )

                        })}
                    </div>



                    {/*
                    <BootstrapTable data={store.appList} striped hover options={options}>
                        <TableHeaderColumn isKey dataField='id' hidden>Product ID</TableHeaderColumn>
                        {this.state.rowsName.map((m,n)=>{
                            if(!m.hidden ){
                                return (
                                    <TableHeaderColumn dataField={m.code} dataFormat={this.dataFormat.bind(this,m.code)}>{m.name}</TableHeaderColumn>
                                )
                            }
                        })}

                        <TableHeaderColumn dataFormat = {
                            (cell,row)=>{
                                return(
                                    <div className="a-operation-box">
                                        <span className="mr10 glyphicon glyphicon-eye-open" onClick={this.previewRows.bind(this,row)} title="查看"></span>
                                        <span className="mr10 glyphicon glyphicon-edit" onClick={this.editRows.bind(this,row)} title="编辑"></span>
                                    </div>
                                )
                            }
                        }>操作</TableHeaderColumn>
                    </BootstrapTable>
                     */}
                </div>

                <ModalView show= {this.state.show} saveModal = {this.saveModal} closeModal={this.closeModal} rowsName ={this.state.rowsName} data={this.state.operationData} type={this.state.operationType}/>

            </div>
        )
    }
}