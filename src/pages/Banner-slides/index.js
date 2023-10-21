import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../common/BreadCrumb";
import {
  message,
  Input,
  Button,
  Form,
  Space,
  Tooltip,
  Select,
  Table,
  Upload,
  Modal,
  Image,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  deleteBannerSlide,
  getPagingBannerSlide,
  insertBannerSlide,
  updateBannerSlide,
  getAllMenu
} from "../../helpers/helper";
import moment from "moment";
import { deleteImageBunny, uploadFileToBunny } from "../../helpers/api_bunny";
import { Drawer } from "antd";
import { api } from "../../config";

const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const Menus = () => {
  document.title = "Management Slide";

  const [form] = Form.useForm();
  const [listSlide, setListSlide] = useState([]);

  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [visibleForm, setVisibleForm] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [listMenu, setListMenu] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const resListMenu = await getAllMenu({ pageSize: 100000 });
      const dataRes = await getAllData();
      setListSlide(dataRes);
      setListMenu(resListMenu.data);
    }
    fetchData();
  }, []);

  const handleChangeImage = ({ fileList: newFileList }) => setFileList(newFileList);

  const getAllData = async (_prams) => {
    const params = _prams
      ? _prams
      : {
        pageIndex: 1,
        pageSize: 100000,
        search: "",
      };
    const dataRes = await getPagingBannerSlide(params);
    const data =
      dataRes?.data &&
      dataRes?.data.length > 0 &&
      dataRes?.data.map((item) => {
        return {
          key: item?._id,
          link: item?.link,
          menu: item?.menu,
          createdTime: moment(new Date(item?.createdTime)).format("DD/MM/YYYY"),
        };
      });
    console.log(data)
    return dataRes?.data ? data : [];
  };

  const onFinish = async (data) => {
    const dataReq = {
      link: previewTitle,
      menu: data.menu,
    };

    if (!data.id) {
      //Save
      const dataRes = await insertBannerSlide(dataReq);
      if (dataRes.status === 1) {
        message.success(`Save Success! ${dataRes.message}`);
        setVisibleForm(false);
        handleCloseDrawer();
      } else {
        message.error(`Save Failed! ${dataRes.message}`);
      }
    } else {
      //Update
      const dataRes = await updateBannerSlide(data.id, dataReq);

      if (dataRes.status === 1) {
        message.success(`Save Success! ${dataRes.message}`);
        handleCloseDrawer();
      } else {
        message.error(`Save Failed! ${dataRes.message}`);
      }
    }
    const dataRes = await getAllData();
    setListSlide(dataRes);
    form.resetFields();
    setPreviewImage("");
    setPreviewTitle("");
  };

  const handleRefresh = async () => {
    form.resetFields();
    const dataRes = await getAllData();
    setListSlide(dataRes);
    setPreviewImage("");
  };

  const onEdit = async (key) => {
    const dataEdit = listSlide.filter((item) => item.key === key);

    form.setFieldsValue({
      menuIcvon: dataEdit[0]?.link,
      id: dataEdit[0]?.key,
      menu: dataEdit[0]?.menu,
    });

    setPreviewImage(`${api.API_URL_BUNNY}/${dataEdit[0]?.link}`);
    setPreviewTitle(dataEdit[0]?.link);
    setFileList([
      {
        url: `${api.API_URL_BUNNY}/${dataEdit[0]?.link}`,
        name: dataEdit[0]?.link,
      },
    ]);
    setDrawerTitle("Edit Slide");
    showDrawer();
  };

  const onDelete = async (key) => {
    const dataRes = await deleteBannerSlide(key);
    dataRes.status === 1
      ? message.success(`Delete Success! ${dataRes.message}`)
      : message.error(`Delete Failed! ${dataRes.message}`);

    handleRefresh();
  };

  const handleCancel = () => setPreviewVisible(false);

  const handleNewSlide = () => {
    setDrawerTitle("Add Banner Slides");
    showDrawer();
    form.resetFields();
    setFileList([]);
    setPreviewImage("");
  };
  const onClose = () => {
    setVisibleForm(false);
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
        setPreviewImage(`${api.API_URL_BUNNY}` / file.name);
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

  const columns = [
    {
      title: "Img",
      dataIndex: "link",
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
      title: "Created Time",
      dataIndex: "createdTime",
    },
    {
      title: "Action",
      dataIndex: "",
      render: (_, record) =>
        listSlide.length >= 1 ? (
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

  const showDrawer = () => {
    setVisibleForm(true);
  };

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

  const handleCloseDrawer = () => {
    setVisibleForm(false);
    form.resetFields();
    setFileList([]);
    setPreviewImage("");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Slide" pageTitle="Management Banner Slides" />

          <div>
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
                    name="menu"
                    label="Slides Menu"
                    rules={[
                      {
                        required: true,
                        message: "Please select post menu!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select a post menu!"
                      allowClear
                      showSearch
                      name="menu"
                      filterOption={(input, option) =>
                        option.children.includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(optionB.children.toLowerCase())
                      }
                    >
                      {listMenu.length > 0 &&
                        listMenu.map((item) => {
                          return (
                            <Option key={item?._id} value={item?._id}>
                              {item?.menuName}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>

                  <Form.Item name="link" label="Img slide" className="">
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
                      type="info"
                      htmlType="button"
                      onClick={() => handleRefresh()}
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
          </div>
          <Row>
            <Col xs={12}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item className="mt-3">
                  <Space>
                    <Button type="primary" onClick={handleNewSlide}>
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
            <Table columns={columns} dataSource={listSlide} />
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Menus;