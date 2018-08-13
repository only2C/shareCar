import React from 'react';
import {observer} from 'mobx-react';
import localforage from 'localforage';
@observer
export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            userName:""
        }
    }
    componentWillMount(){
        localforage.getItem("userName",(n,userName)=>{
            this.setState({
                userName
            })
        })
    }

    render(){
        return(
            <div className="top">
                <span className="fl top-title"><span className="glyphicon glyphicon-home mr15"></span>管理平台</span>
                <div className="fr top-user">
                    <span>欢迎您！{this.state.userName}</span>
                    <span><a href="#/" className="ml10 mr10" title="退出"><i className="glyphicon glyphicon-log-out"></i></a></span>
                </div>
            </div>
        )
    }
}