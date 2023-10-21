/* eslint-disable no-debugger */
import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import {
  message,
  Input,
  Button,
  Form,
  Space,
  Tooltip,
  Table,
  Drawer,
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  deleteAccountBank,
  deleteAction,
  getAllBank,
  getPagingAccountBank,
  insertAccountBank,
  updateAccountBank,
} from "../../helpers/helper";
import moment from "moment";
import BreadCrumb from "../../common/BreadCrumb";
const { Option } = Select;

const AccountBanks = () => {
  document.title = "Management AccountBanks";

  const [form] = Form.useForm();
  const [formSearch] = Form.useForm();
  const [listAccountBank, setListAccountBank] = useState([]);
  const [visibleForm, setVisibleForm] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [listBank, setListBank] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const dataRes = await getAllData();
      const dataBankRes = await getAllBank();
      setListAccountBank(dataRes);
      setListBank(dataBankRes)
    }
    fetchData();
  }, []);

  const getAllData = async (_prams) => {
    const params = _prams
      ? _prams
      : {
          pageIndex: 1,
          pageSize: 100000,
          search: "",
        };
    const dataRes = await getPagingAccountBank(params);

    const data =
      dataRes?.data &&
      dataRes?.data.length > 0 &&
      dataRes?.data.map((item) => {
        return {
          key: item?._id,
          accountName: item?.accountName,
          accountNo: item?.accountNo,
          bank: item?.bank,
          createdTime: moment(new Date(item?.createdTime)).format("DD/MM/YYYY"),
        };
      });
    return dataRes?.data ? data : [];
  };

  const onFinish = async (data) => {
    const dataReq = {
      accountName: data.accountName,
      accountNo: data.accountNo,
      bank: data.bank,
    };

    if (!data.id) {
      //Save
      const dataRes = await insertAccountBank(dataReq);
      dataRes.status === 1
        ? message.success(`Save Success! ${dataRes.message}`)
        : message.error(`Save Failed! ${dataRes.message}`);
    } else {
      //Update
      const dataRes = await updateAccountBank(data.id, dataReq);
      dataRes.status === 1
        ? message.success(`Update Success! ${dataRes.message}`)
        : message.error(`Update Failed! ${dataRes.message}`);
    }
    formSearch.resetFields();
    form.resetFields();
    handleCloseDrawer();
    handleRefresh();
  };

  const handleRefreshCreate = () => {
    form.resetFields();
  };

  const handleRefresh = async () => {
    form.resetFields();
    formSearch.resetFields();
    const dataRes = await getAllData();
    setListAccountBank(dataRes);
  };

  const handleSearch = async () => {
    const dataForm = formSearch.getFieldsValue();
    const params = {
      pageIndex: 1,
      pageSize: 1000,
      search: dataForm.accountName ? dataForm.accountName : "",
    };
    const dataRes = await getAllData(params);
    setListAccountBank(dataRes);
  };

  const onEdit = (key) => {
    const dataEdit = listAccountBank.filter((item) => item.key === key);

    form.setFieldsValue({
      accountName: dataEdit[0]?.accountName,
      accountNo: dataEdit[0]?.accountNo,
      bank: dataEdit[0]?.bank?._id,
      id: dataEdit[0]?.key,
    });
    setDrawerTitle("Edit Action");
    showDrawer();
  };

  const onDelete = async (key) => {
    const dataRes = await deleteAccountBank(key);
    dataRes.status === 1
      ? message.success(`Delete Success! ${dataRes.message}`)
      : message.error(`Delete Failed! ${dataRes.message}`);

    handleRefresh();
  };

  const columns = [
    {
      title: "Account Name",
      dataIndex: "accountName",
    },
    {
      title: "Account No",
      dataIndex: "accountNo",
    },
    {
      title: "Bank",
      dataIndex: "bank",
      render: (_, record) => {
        return (
          <>
            { record?.bank != null ?  (record?.bank?.code != null ? record?.bank?.code : "") : ""}
          </>
        );
      },
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
    },
    {
      title: "AccountBank",
      dataIndex: "",
      render: (_, record) =>
      listAccountBank.length >= 1 ? (
          <Space>
            <Tooltip title="Edit">
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(record.key)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                type="danger"
                shape="circle"
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => onDelete(record.key)}
              />
            </Tooltip>
          </Space>
        ) : null,
    },
  ];

  const onClose = () => {
    setVisibleForm(false);
  };

  const showDrawer = () => {
    setVisibleForm(true);
  };

  const handleNewAction = () => {
    setDrawerTitle("Add action");
    showDrawer();
    form.resetFields();
  };
  
  const handleCloseDrawer = () => {
    setDrawerTitle("");
    setVisibleForm(false);
    form.resetFields();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="AccountBank" pageTitle="Management AccountBanks" />

          <Row>
            <Col xs={12}>
              <Form
                form={formSearch}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Row>
                  <Col hidden={true}>
                    <Form.Item name="id" label="Id">
                      <Input name="id" />
                    </Form.Item>
                  </Col>
                  <Col sm={3}>
                    <Form.Item
                      name="accountName"
                      label="Search by account name:"
                      rules={[
                        {
                          required: false,
                          message: "Please input account name!",
                        },
                        {
                          type: "accountName",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter name"
                        name="accountName"
                        allowClear={true}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item className="mt-3">
                  <Space>
                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={() => handleSearch()}
                    >
                      Search
                    </Button>
                    <Button type="primary" onClick={handleNewAction}>
                      Create
                    </Button>
                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={() => handleRefresh()}
                    >
                      Refresh
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <div>
            <Col>
              <Drawer
                title={drawerTitle}
                placement={"right"}
                width={"30%"}
                onClose={onClose}
                visible={visibleForm}
                bodyStyle={{
                  paddingBottom: 80,
                }}
                style={{ marginTop: "70px" }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Row>
                    <Col hidden={true}>
                      <Form.Item name="id" label="Id">
                        <Input name="id" />
                      </Form.Item>
                    </Col>
                    <Form.Item
                      name="accountName"
                      label="Account Name"
                      rules={[
                        {
                          required: true,
                          message: "Please input account name!",
                        },
                        {
                          type: "accountName",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter account name"
                        name="accountName"
                        allowClear={true}
                      />
                    </Form.Item>
                    <Form.Item
                      name="accountNo"
                      label="Account No"
                      rules={[
                        {
                          required: true,
                          message: "Please input account no!",
                        },
                        {
                          type: "accountNo",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter account no"
                        name="accountNo"
                        allowClear={true}
                      />
                    </Form.Item>
                    <Form.Item 
                      name="bank" 
                      label="Bank"
                      rules={[
                        {
                          required: true,
                          message: "Please select bank!",
                        },
                      ]}
                      >
                        <Select
                          name="bank"
                          placeholder="Select a bank!"
                        >
                          {listBank.length > 0 &&
                            listBank.map((item, index) => {
                              return (
                                <Option key={item?._id} value={item?._id}>
                                  {item?.code}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                  </Row>
                  <Form.Item className="mt-3">
                    <Space>
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>
                      <Button
                        type="primary"
                        htmlType="button"
                        onClick={() => handleRefreshCreate()}
                      >
                        Refresh
                      </Button>
                      <Button type="danger" onClick={handleCloseDrawer}>
                        Close
                      </Button>
                    </Space>
                  </Form.Item>
                  
                </Form>
              </Drawer>
            </Col>
          </div>
          <div>
            <Table columns={columns} dataSource={listAccountBank} />
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AccountBanks;