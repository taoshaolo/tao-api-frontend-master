import {
    getInterfaceInfoVOByIdUsingGET,
    invokeInterfaceInfoUsingPOST,
} from '@/services/tao-api-backend/interfaceInfoController';
import { useParams } from '@@/exports';
import { PageContainer } from '@ant-design/pro-components';
import {Badge, Button, Card, Descriptions, Divider, Form, Input, message, Spin, Table} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Image } from 'antd';

const requestColumns: ColumnsType<API.RequestParamsRemarkVO> = [
    {
        title: '名称',
        dataIndex: 'name',
        width: '100px',
    },
    {
        title: '必填',
        key: 'isRequired',
        dataIndex: 'isRequired',
        width: '100px',
    },
    {
        title: '类型',
        dataIndex: 'type',
        width: '100px',
    },
    {
        title: '说明',
        dataIndex: 'remark',
    },
];
const responseColumns: ColumnsType<API.RequestParamsRemarkVO> = [
    {
        title: '名称',
        dataIndex: 'name',
        width: '100px',
    },
    {
        title: '类型',
        dataIndex: 'type',
        width: '100px',
    },
    {
        title: '说明',
        dataIndex: 'remark',
    },
];
const Index: React.FC = () => {
    const [invokeLoading, setInvokeLoading] = useState(false);
    const [data, setData] = useState<API.InterfaceInfoVO>();
    const params = useParams();
    const [invokeRes, setInvokeRes] = useState<any>();
    const [urlRes, setUrl] = useState<any>();
    const [imageLoad, setImageLoad] = useState(false);

    const loadData = async () => {
        try {
            const interfaceInfoRes = await getInterfaceInfoVOByIdUsingGET({
                id: Number(params.id),
            });

            const interfaceInfoData = interfaceInfoRes.data;
            console.log('接口信息数据：', interfaceInfoData)
            if (interfaceInfoData) {
                setData(interfaceInfoData);
            }
        } catch (error: any) {
            message.error('请求失败，' + error.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onFinish = async (values: any) => {
        console.log('values:', values);
        if (!params.id) {
            message.error('接口不存在');
            return;
        }
        setInvokeLoading(true);
        try {
            const res = await invokeInterfaceInfoUsingPOST({
                id: params.id,
                host: data?.host,
                ...values,
            });
            console.log('调用接口请求数据：', res);
            if (res.data) {
                res.data = res.data.replace(/\\/g, '');//匹配所有的反斜杠字符
                // const jsonData = JSON.stringify(res.data as unknown as string);
                setInvokeRes(res.data);
                message.success('接口请求成功');
            } else {
                const messageObj = JSON.parse(res.message as string);
                message.error(messageObj.message);
            }

            try {
                // @ts-ignore
                const responseObject = JSON.parse(res.data);
                console.log('responseObject:', responseObject)
                if (responseObject?.imgurl){
                    setUrl(responseObject.imgurl);
                    setImageLoad(true);
                    console.log(responseObject.imgurl)
                }
            } catch (error) {
            }
        } catch (error: any) {
            message.error('接口请求失败');
        }
        setInvokeLoading(false);
    };
    // 图片加载完成时触发的回调函数
    const handleImageLoad = () => {
        setImageLoad(false); // 图片加载完成后，设置loading为false，不再显示加载指示器
    };

    return (
        <PageContainer>
            <Card>
                {data ? (
                    <Descriptions title={data.name} column={4} layout={'vertical'}>
                        <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
                        <Descriptions.Item label="接口状态">
                            {data.status ? (
                                <Badge status="success" text={'开启'} />
                            ) : (
                                <Badge status="default" text={'关闭'} />
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="主机名">{data.host}</Descriptions.Item>
                        <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
                        <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
                        <Descriptions.Item label="请求参数示例" span={4}>
                            {data.requestParams}
                        </Descriptions.Item>
                        <Descriptions.Item label="请求参数说明" span={4}>
                            <Table
                                style={{ width: '100%' }}
                                pagination={{
                                    hideOnSinglePage: true,
                                }}
                                columns={requestColumns}
                                dataSource={data.requestParamsRemark}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="响应参数说明" span={4}>
                            <Table
                                style={{ width: '100%' }}
                                pagination={{
                                    hideOnSinglePage: true,
                                }}
                                columns={responseColumns}
                                dataSource={data.responseParamsRemark}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
                        <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">
                            {moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Descriptions.Item>
                        <Descriptions.Item label="更新时间">
                            {moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                        </Descriptions.Item>
                    </Descriptions>
                ) : (
                    <>接口不存在</>
                )}
            </Card>
            {data ? (
                <>
                    {' '}
                    <Divider />
                    <Card title={'在线测试'}>
                        <Form name="invoke" layout={'vertical'} onFinish={onFinish}>
                            <Form.Item
                                label={'请求参数'}
                                initialValue={data?.requestParams}
                                name={'requestParams'}
                            >
                                <Input.TextArea defaultValue={data?.requestParams} rows={6} />
                            </Form.Item>

                            <Form.Item wrapperCol={{ span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    调用
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                    <Divider />
                    <Card title={'返回结果'} loading={invokeLoading}>
                        <Input.TextArea value={invokeRes} rows={10} />
                    </Card>
                    <Card>
                        <Spin spinning={imageLoad}>

                            <Image
                                width={600}
                                src={urlRes}
                                onLoad={handleImageLoad} // 监听图片加载完成事件>
                            />
                        </Spin>
                        {imageLoad && (
                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <h1>图片加载中请耐心等待</h1>
                            </div>
                        )}
                    </Card>
                </>
            ) : null}
        </PageContainer>
    );
};

export default Index;
