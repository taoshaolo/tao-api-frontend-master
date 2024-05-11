import Footer from '@/components/Footer';
import {userLoginUsingPOST, userRegisterUsingPOST} from '@/services/tao-api-backend/userController';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginFormPage, ProFormCheckbox, ProFormInstance, ProFormText,} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {message, Tabs} from 'antd';
import type {CSSProperties} from 'react';
import React, {useRef, useState} from 'react';
import background from '../../../../public/background.jpg';
import logo from '../../../../public/logo.svg';

type LoginType = 'account' | 'register' | 'forgetPassword';

const iconStyles: CSSProperties = {
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '18px',
    verticalAlign: 'middle',
    cursor: 'pointer',
};
const Login: React.FC = () => {
    const {initialState, setInitialState} = useModel('@@initialState');
    const [loginType, setLoginType] = useState<LoginType>('account');
    const formRef = useRef<ProFormInstance>();
    const handleSubmitText = loginType === 'account' ? '登录' : '注册';

    const handleSubmit = async (values: API.UserRegisterRequest) => {
        const {userPassword, checkPassword} = values;
        if (checkPassword) {
            // 注册
            if (userPassword !== checkPassword) {
                message.error('两次输入密码不一致！');
                return;
            }
            const res = await userRegisterUsingPOST(values);
            if (res.code === 0) {
                // 注册成功
                const defaultRegisterSuccessMessage = '注册成功！';
                message.success(defaultRegisterSuccessMessage)
                // 切换到登录
                setLoginType('account');
                // 重置表单
                formRef.current?.resetFields();
            }

        } else {
            // 登录
            const res = await userLoginUsingPOST({
                ...values,
            });
            if (res.data) {
                const defaultLoginSuccessMessage = '登录成功！';
                message.success(defaultLoginSuccessMessage);
                // 登录成功后处理
                const urlParams = new URL(window.location.href).searchParams;
                // 重定向到 redirect 参数所在的位置
                location.href = urlParams.get('redirect') || '/';
                // 保存登录状态
                setInitialState({
                    loginUser: res.data,
                });
            } else {
                message.error(res.message);
                console.log('res', res)
            }
        }
    };
    return (
        <div>
            <div
                style={{
                    backgroundColor: 'white',
                    // height: 'calc(100vh - 100px)',
                    height: '100vh',
                    margin: 0,
                }}
            >
                <LoginFormPage

                    submitter={{
                        searchConfig: {
                            submitText: handleSubmitText,
                        },
                    }}
                    backgroundImageUrl={background}
                    logo={logo}
                    title="Tao-API"
                    subTitle="史上最好用的免费API接口平台"
                    initialValues={{
                        autoLogin: true,
                    }}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.UserRegisterRequest);
                    }}
                >
                    {
                        <Tabs
                            centered
                            activeKey={loginType}
                            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                        >
                            <Tabs.TabPane key={'account'} tab={'登录'}/>
                            <Tabs.TabPane key={'register'} tab={'注册'}/>
                        </Tabs>
                    }
                    {loginType === 'account' && (
                        <>
                            <ProFormText
                                name="userAccount"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined/>,
                                }}
                                placeholder={'请输入用户名'}
                                rules={[
                                    {
                                        required: true,
                                        message: '用户名是必填项！',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="userPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined/>,
                                }}
                                placeholder={'请输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '密码是必填项！',
                                    },
                                ]}
                            />
                        </>
                    )}
                    {loginType === 'register' && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined/>,
                                }}
                                name="userAccount"
                                placeholder={'请输入用户名'}
                                rules={[
                                    {
                                        required: true,
                                        message: '用户名是必填项！',
                                    },
                                    {
                                        min: 4,
                                        message: '长度不能少于4位！',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined/>,
                                }}
                                name="userPassword"
                                placeholder={'请输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '密码是必填项！',
                                    },
                                    {
                                        min: 8,
                                        message: '长度不能少于8位！',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined/>,
                                }}
                                name="checkPassword"
                                placeholder={'请再次输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '密码是必填项！',
                                    },
                                    {
                                        min: 8,
                                        message: '长度不能少于8位！',
                                    },
                                ]}
                            />
                        </>
                    )}
                </LoginFormPage>
            </div>
            <Footer/>
        </div>
    );
};
export default Login;
