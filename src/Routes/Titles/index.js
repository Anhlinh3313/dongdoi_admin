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
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  deleteTitle,
  getPagingTitle,
  insertTitle,
  updateTitle,
} from "../../helpers/helper";
import moment from "moment";
import BreadCrumb from "../../common/BreadCrumb";

const Titles = () => {
  document.title = "Management Titles";

  const [form] = Form.useForm();
  const [formSearch] = Form.useForm();
  const [listTitle, setListTitle] = useState([]);
  const [visibleForm, setVisibleForm] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");

  useEffect(() => {
    async function fetchData() {
      const dataRes = await getAllData();
      setListTitle(dataRes);
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
    const dataRes = await getPagingTitle(params);

    const data =
      dataRes?.data &&
      dataRes?.data.length > 0 &&
      dataRes?.data.map((item) => {
        return {
          key: item?._id,
          name: item?.name,
          description: item?.description,
          createdTime: moment(new Date(item?.createdTime)).format("DD/MM/YYYY"),
        };
      });
    return dataRes?.data ? data : [];
  };

  const onFinish = async (data) => {
    const dataReq = {
      name: data.name,
      description: data.description,
    };

    if (!data.id) {
      //Save
      const dataRes = await insertTitle(dataReq);
      dataRes.status === 1
        ? message.success(`Save Success! ${dataRes.message}`)
        : message.error(`Save Failed! ${dataRes.message}`);
    } else {
      //Update
      const dataRes = await updateTitle(data.id, dataReq);
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
    setListTitle(dataRes);
  };

  const handleSearch = async () => {
    const dataForm = formSearch.getFieldsValue();
    const params = {
      pageIndex: 1,
      pageSize: 10,
      search: dataForm.name ? dataForm.name : "",
    };
    const dataRes = await getAllData(params);
    setListTitle(dataRes);
  };

  const onEdit = (key) => {
    const dataEdit = listTitle.filter((item) => item.key === key);

    form.setFieldsValue({
      name: dataEdit[0].name,
      id: dataEdit[0].key,
      description: dataEdit[0].description,
    });
    setDrawerTitle("Edit Title");
    showDrawer();
  };

  const onDelete = async (key) => {
    const dataRes = await deleteTitle(key);
    dataRes.status === 1
      ? message.success(`Delete Success! ${dataRes.message}`)
      : message.error(`Delete Failed! ${dataRes.message}`);

    handleRefresh();
  };

  const columns = [
    {
      title: "Title Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
    },
    {
      title: "Title",
      dataIndex: "",
      render: (_, record) =>
        listTitle.length >= 1 ? (
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

  const handleNewTitle = () => {
    setDrawerTitle("Add Title");
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
          <BreadCrumb title="Title" pageTitle="Management titles" />

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
                      name="name"
                      label="Search by level name:"
                      rules={[
                        {
                          required: false,
                          message: "Please input level name!",
                        },
                        {
                          type: "name",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter name"
                        name="name"
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
                    <Button type="primary" onClick={handleNewTitle}>
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
                      name="name"
                      label="Title name"
                      rules={[
                        {
                          required: true,
                          message: "Please input title name!",
                        },
                        {
                          type: "name",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter name"
                        name="name"
                        allowClear={true}
                      />
                    </Form.Item>
                    <Form.Item
                      name="description"
                      label="Title description"
                      rules={[
                        {
                          required: true,
                          message: "Please input title description!",
                        },
                        {
                          type: "description",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter name"
                        name="description"
                        allowClear={true}
                      />
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
            <Table columns={columns} dataSource={listTitle} />
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Titles;