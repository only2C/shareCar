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
export default class Material extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowsName: [{code:'id',name:'id',hidden:true},{code:'type',name:'类型',add:true },
                {code:'sortNo',name:'排序',add:true },{code:'isDeleted',name:'删除状态'},{code:'gmtCreate',name:'创建时间',type:"date",hidden:true},{code:'gmtModified',name:'修改时间',type:"date",hidden:true},
                {code:'remarks',name:'备注',add:true },{code:'img',name:'路径',add:true }
            ],
            show:false ,
            operationData:{},
            indexImg:[{code:1,name:"首页轮播"},{code:2,name:"首页效果图"}], //material
            currentIndexImg:1,
            operationType:'preview'   ,  // preview 预览  edit 编辑  add 新增

        }
    }

    componentWillMount(){
        this.getMaterialList();
    }

    getMaterialList=()=>{

        store.getListMaterial(this.state.currentIndexImg,(data)=>{
            this.setState({
                materialList:data
            })
        })


    }

    dataFormat = (type,rows,cell)=>{
        if(type=="type"){
            let name ="首页轮播";
            if(cell.type == 2 ){
                name ="首页效果图"
            }else if(cell.type ==3 ){
                name = "提现规则"
            }
            return (
                <span>{name}</span>
            )
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
            operationData:{}
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
            currentIndexImg:item
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
    render(){
        console.log(store.ListMaterial)
        const  options ={
            noDataText:"暂无数据"
        }
        return(
            <div className="a-box">
                <Top />
                <Menu tag="material"/>
                <div className="a-container">

                    <h3>素材</h3>

                    <ul className="a-nav-ul">
                        {this.state.indexImg.map((m,n)=>{
                            return (
                                <li key={n} className={this.state.currentIndexImg == n+1 ? "active": ""}  onClick={this.changeItem.bind(this,m.code)}>{m.name}</li>
                            )
                        })}

                    </ul>

                    <div className="fr mb10">
                        <Button bsStyle="info" onClick={this.addRows}>新增</Button>
                    </div>

                    <BootstrapTable data={store.ListMaterial} striped hover options={options}>
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
                                        <span onClick={this.deleteRows.bind(this,row)} className="glyphicon glyphicon-trash" title="删除"></span>
                                    </div>
                                )
                            }
                        }>操作</TableHeaderColumn>
                    </BootstrapTable>
                </div>

                <ModalView show= {this.state.show} saveModal = {this.saveModal} closeModal={this.closeModal} rowsName ={this.state.rowsName} data={this.state.operationData} type={this.state.operationType}/>

            </div>
        )
    }
}