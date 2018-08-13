import React from 'react';
import {observer} from 'mobx-react';
@observer
export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu:[{name:"首页",code:"home"},{name:"能源币",code:"coinPrice"},{name:"素材",code:"material"},{name:"交易凭证列表",code:"source"}
            ,{name:"用户列表",code:"userList"},{name:"审批列表",code:"transactionApprove"},{name:"交易记录列表",code:"transactionRecord"},{name:"APP运营参数",code:"app"}]
        }
    }

    componentWillReceiveProps(props){

    }

    render(){
        const {tag }= this.props;
        return(
            <div className="menu">

                <ul>
                    {this.state.menu.map((m,n)=>{
                        return (
                            <li key={n} className={tag ? ( tag==m.code ?"active":"") : (n==0?"active":"")}><a href={ "#/"+m.code}><span className="glyphicon glyphicon-list mr5"></span>{m.name}</a></li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}