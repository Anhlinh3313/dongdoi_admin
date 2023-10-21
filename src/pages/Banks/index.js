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
  Image,
  Upload,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  deleteBank,
  getPagingBank,
  insertBank,
  updateBank,
} from "../../helpers/helper";
import moment from "moment";
import BreadCrumb from "../../common/BreadCrumb";
import { api } from "../../config";
import { deleteImageBunny, uploadFileToBunny } from "../../helpers/api_bunny";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
});

const Banks = () => {
  document.title = "Management Banks";

  const [form] = Form.useForm();
  const [formSearch] = Form.useForm();
  const [listBank, setListBank] = useState([]);
  const [visibleForm, setVisibleForm] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);


  useEffect(() => {
    async function fetchData() {
      const dataRes = await getAllData();
      setListBank(dataRes);
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
    const dataRes = await getPagingBank(params);

    const data =
      dataRes?.data &&
      dataRes?.data.length > 0 &&
      dataRes?.data.map((item) => {
        return {
          key: item?._id,
          name: item?.name,
          code: item?.code,
          bin: item?.bin,
          logo: item?.logo,
          createdTime: moment(new Date(item?.createdTime)).format("DD/MM/YYYY"),
        };
      });
    return dataRes?.data ? data : [];
  };

  const onFinish = async (data) => {
    const dataReq = {
      name: data.name,
      code: data.code,
      bin: data.bin,
      logo: previewTitle,
    };

    if (!data.id) {
      //Save
      const dataRes = await insertBank(dataReq);
      dataRes.status === 1
        ? message.success(`Save Success! ${dataRes.message}`)
        : message.error(`Save Failed! ${dataRes.message}`);
    } else {
      //Update
      const dataRes = await updateBank(data.id, dataReq);
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
    setListBank(dataRes);
  };

  const handleSearch = async () => {
    const dataForm = formSearch.getFieldsValue();
    const params = {
      pageIndex: 1,
      pageSize: 1000,
      search: dataForm.name ? dataForm.name : "",
    };
    const dataRes = await getAllData(params);
    setListBank(dataRes);
  };

  const onEdit = (key) => {
    const dataEdit = listBank.filter((item) => item.key === key);

    form.setFieldsValue({
      id: dataEdit[0]?.key,
      name: dataEdit[0]?.name,
      code: dataEdit[0]?.code,
      bin: dataEdit[0]?.bin,
      logo: dataEdit[0]?.logo,
    });

    setPreviewImage(`${api.API_URL_BUNNY}/${dataEdit[0]?.logo}`);
    setPreviewTitle(dataEdit[0]?.logo);
    setFileList([
      {
        url: `${api.API_URL_BUNNY}/${dataEdit[0]?.logo}`,
        name: dataEdit[0]?.logo,
      },
    ]);

    setDrawerTitle("Edit Bank");
    showDrawer();
  };

  const onDelete = async (key) => {
    const dataRes = await deleteBank(key);
    dataRes.status === 1
      ? message.success(`Delete Success! ${dataRes.message}`)
      : message.error(`Delete Failed! ${dataRes.message}`);

    handleRefresh();
  };

  const props = {
    onRemove: async (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      const resDelete = await deleteImageBunny(file.name);
      if (resDelete.HttpCode === 200) {
        message.success("Delete file to Bunny successfully!");
        setPreviewImage("");
      } else {
        message.error("Delete file to Bunny failed!");
      }
    },
    beforeUpload: async (file) => {
      setFileList([file]);
      const resUpload = await uploadFileToBunny(file);
      if (resUpload.HttpCode === 201) {
        message.success("Upload file to Bunny successfully!");
        setPreviewImage(`${api.API_URL_BUNNY}`/file.name);
        setPreviewTitle(file.name);
        return false;
      } else {
        message.error("Upload file to Bunny failed!");
        deleteImageBunny(file.name);
        setPreviewImage("");
        setFileList([]);
        return false;
      }
      // return false;
    },

    fileList,
  };
  const handleChangeImage = ({ fileList: newFileList }) =>setFileList(newFileList);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewVisible(false);

  const columns = [
    {
      title: "Bank Name",
      dataIndex: "name",
    },
    {
      title: "Bank Code",
      dataIndex: "code",
    },
    {
      title: "Bin",
      dataIndex: "bin",
    },
    {
      title: "Logo",
      dataIndex: "logo",
      render: (img, record) => {
        return (
          img ? 
          <Image width={150} src={`${api.API_URL_BUNNY}/${img}`} />
          :
          ""
        )
      },
    },
    {
      title: "Bank",
      dataIndex: "",
      render: (_, record) =>
      listBank.length >= 1 ? (
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
    setDrawerTitle("Add Bank");
    showDrawer();
    form.resetFields();
    setFileList([]);
    setPreviewImage("");
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
          <BreadCrumb title="Bank" pageTitle="Management Banks" />

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
                      label="Search by bank name:"
                      rules={[
                        {
                          required: false,
                          message: "Please input bank name!",
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
                      name="name"
                      label="Bank Name"
                      rules={[
                        {
                          required: true,
                          message: "Please input bank name!",
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
                      name="code"
                      label="Bank Code"
                      rules={[
                        {
                          required: true,
                          message: "Please input bank code!",
                        },
                        {
                          type: "code",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter code"
                        name="namcodee"
                        allowClear={true}
                      />
                    </Form.Item>

                    <Form.Item
                      name="bin"
                      label="Bank Bin"
                      rules={[
                        {
                          required: true,
                          message: "Please input bank bin!",
                        },
                        {
                          type: "bin",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter bin"
                        name="bin"
                        allowClear={true}
                      />
                    </Form.Item>

                    <Form.Item name="logo" label="Logo" className="">
                      <Space align="start">
                        <Upload
                          {...props}
                          listType="picture-card"
                          fileList={fileList}
                          onChange={handleChangeImage}
                          onPreview={handlePreview}
                        >
                          <div>
                            <PlusOutlined />
                            <div
                              style={{
                                marginTop: 8,
                              }}
                            >
                              Upload
                            </div>
                          </div>
                        </Upload>
                        {previewImage && (
                          <>
                            <Modal
                              visible={previewVisible}
                              title={previewTitle}
                              footer={null}
                              onCancel={handleCancel}
                            >
                              <img
                                alt={previewTitle}
                                style={{ width: "100%" }}
                                src={previewImage}
                              />
                            </Modal>
                          </>
                        )}
                      </Space>
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
            <Table columns={columns} dataSource={listBank} />
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Banks;