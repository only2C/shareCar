import React from 'react';
import {Modal, Button,Pagination} from 'react-bootstrap';
import _ from 'lodash';
import Config from '@/config';
import globalStore from '@/stores/GlobalStore';
import FileUpload from '../material/Upload';

import {DatePicker2} from 'ssc-grid';
// 订单信息模块

export default class ModalView extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            modalObj:{}
        }
    }


    componentWillReceiveProps(props){
        this.setState({
            modalObj:props.data
        })

    }

    setInput =(obj,e)=>{
        let modalObj = this.state.modalObj;
        modalObj[obj] = e.target.value ;
        this.setState({
            modalObj
        })

    }

    setTime =(obj,value, formattedValue)=>{
        let modalObj = this.state.modalObj;
        modalObj[obj] = formattedValue ;
        this.setState({
            modalObj
        })
    }

    close =()=>{
        this.props.closeModal();
    }

    uploadSuccess =(obj ,data )=>{
        let modalObj = this.state.modalObj;
        modalObj[obj] = data.data ;
        this.setState({
            modalObj
        })

    }

    saveModal =()=>{
        this.props.saveModal(this.state.modalObj)
    }

    render(){
        const {data} = this.props ;
        return(
            <Modal show={this.props.show} bsSize="large" onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.type == "add"?"新增":(this.props.type =="edit"?"编辑":"查看")}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {this.props.type == "preview"?(
                        <div className="row a-preview">
                            {this.props.rowsName.map((m,n)=>{
                                return(
                                    <div className={ m.code !="img" ? "col-md-6 a-preview-col":"col-md-12"} key={n}>
                                        <label>{m.name}:</label>
                                        {m.code =="img"?(<img src={data[m.code]} style={{width:"200px"}}/>):(<span>{data[m.code]}</span>)}
                                    </div>
                                )

                            })}
                        </div>
                    ):""}

                    {this.props.type == "edit"?(
                        <div className="row">
                            {this.props.rowsName.map((m,n)=>{
                                if(m.add){
                                    return(
                                        <div className={  m.code !="img" ? "col-md-6 form-group":"col-md-12"} key={n}>
                                            <label>{m.name}:</label>
                                            {m.code =="img"?(
                                                <div>
                                                    <FileUpload successCallBack={this.uploadSuccess.bind(this,m.code)}/>
                                                    {this.state.modalObj[m.code] ? <img src={this.state.modalObj[m.code]} style={{width:"200px"}}/>:""}
                                                </div>
                                            ):(
                                                <input type="text" className={"form-control"} onChange={this.setInput.bind(this,m.code)} value={this.state.modalObj[m.code]}/>
                                            )}
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    ):""}
                    {this.props.type == "add"?(
                        <div className="row">
                            {this.props.rowsName.map((m,n)=>{
                                if(m.add){
                                    return(
                                        <div className="col-md-6 form-group" key={n}>
                                            <label>{m.name}:</label>
                                            {m.code =="img"?(
                                            <div>
                                                <FileUpload successCallBack={this.uploadSuccess.bind(this,m.code)}/>
                                                {this.state.modalObj[m.code] ? <img src={this.state.modalObj[m.code]} style={{width:"200px"}}/>:""}
                                            </div>
                                            ):(
                                                <input type="text" className={"form-control"} onChange={this.setInput.bind(this,m.code)} value={this.state.modalObj[m.code]}/>
                                            )}
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    ):""}

                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.close}>取消</Button>
                    {this.props.type == "preview"?"":(
                        <Button bsStyle="primary" onClick={this.saveModal}>保存</Button>
                    )}
                </Modal.Footer>

            </Modal>
        )
    }
}