import React from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button } from 'antd';
import Link from 'umi/link';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/index">
      <Button size="large">
        <FormattedMessage id="app.register-result.back-home" />
      </Button>
    </Link>
  </div>
);

const RegisterResult = () => {
};

export default RegisterResult;
