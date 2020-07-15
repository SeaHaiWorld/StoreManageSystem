import React, { PureComponent } from 'react';
import {Col,Card} from 'antd';
import styles from './index.less';


export default class AdvancedCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  projectCardMap=(data,type)=>{
    const {getCardContent }=this.props;
    if (type === "top") {
      return data.map(item => (
        <Col key={item.id} span={8}>
          <div>
            <Card
              className={styles.projectCard}
            >
              {getCardContent(item,type)}
            </Card>
          </div>
        </Col>
      ));
    }
      return data.map(item => (
        <Col
          key={item.id}
          xs={{span:24}}
          sm={{span:24}}
          md={{span:12}}
          xl={{span:8}}
        >
          <div>
            <Card
              className={styles.projectCard}
            >
              {getCardContent(item,type)}
            </Card>
          </div>
        </Col>
      ));
    };

  render() {
    const {data,type} = this.props;
    return(
      <div>
        {this.projectCardMap(data,type)}
      </div>
    )
  }
}
