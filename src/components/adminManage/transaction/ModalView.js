import React from 'react';
import {Modal, Button,Pagination} from 'react-bootstrap';
import _ from 'lodash';
import Config from '@/config';
import globalStore from '@/stores/GlobalStore';

// 操作信息

export default class ModalView extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            modalObj: 0
        }
    }


    componentWillReceiveProps(props){
    }

    setSelect=(e)=>{
        this.setState({
            modalObj:e.target.value
        })

    }
    saveModal =()=>{
        this.props.saveModal(this.state.modalObj)
    }
    close =()=>{
        this.props.closeModal();
    }
    render(){
        const {options} = this.props ;
        return(
            <Modal show={this.props.show} bsSize="sm" onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>操作</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <select className="form-control" onChange={this.setSelect}>
                        {options.map((m,n)=>{
                            return (
                                <option key={n} value={m.code}>{m.name}</option>
                            )
                        })}


                    </select>

                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.close}>取消</Button>
                    {this.props.type == "preview"?"":(
                        <Button bsStyle="primary" onClick={this.saveModal}>确定</Button>
                    )}
                </Modal.Footer>

            </Modal>
        )
    }
}