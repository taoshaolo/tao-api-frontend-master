import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
    const defaultMessage = 'TaoShao';
    const currentYear = new Date().getFullYear();
    return (
        <DefaultFooter
            style={{
                background: 'none',
            }}
            copyright={`${currentYear} ${defaultMessage}`}
            links={[
                {
                    key: 'Ant Design Pro',
                    title: 'Tao-API',
                    href: 'http://localhost:8000',
                    blankTarget: true,
                },
                {
                    key: 'github',
                    title: <GithubOutlined />,
                    href: 'https://github.com/taoshaolo/',
                    blankTarget: true,
                },
                {
                    key: 'Ant Design',
                    title: 'Ant Design',
                    href: 'https://ant.design',
                    blankTarget: true,
                },
            ]}
        />
    );
};
export default Footer;
