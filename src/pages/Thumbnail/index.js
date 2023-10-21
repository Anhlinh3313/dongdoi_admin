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
  deleteThubnail,
  getPagingThubnail,
  insertThubnail,
  updateThubnail,
  getAllMenu
} from "../../helpers/helper";
import moment from "moment";
import { deleteImageBunny, uploadFileToBunny } from "../../helpers/api_bunny";
import { Drawer } from "antd";
import { api } from "../../config";
import toSlug from "../../common/function";

const { Option } = Select;
const { TextArea } = Input;

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
  const [previewTitle, setPreviewTitle] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [visibleForm, setVisibleForm] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [listMenu, setListMenu] = useState([]);
  const [thumbnailSlug, setThumbnailSlug] = useState("");

  useEffect(() => {
    async function fetchData() {
      const resListMenu = await getAllMenu({ pageSize: 100000 });
      const dataRes = await getAllData();
      setListSlide(dataRes);
      setListMenu(resListMenu.data);
    }
    fetchData();
  }, []);

  const handleChangeTitle = (value) => {
    form.setFieldsValue({
      slug: toSlug(value),
    });
  };

  const handleChangeImage = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const getAllData = async (_prams) => {
    const params = _prams
      ? _prams
      : {
        pageIndex: 1,
        pageSize: 100000,
        search: "",
      };
    const dataRes = await getPagingThubnail(params);
    const data =
      dataRes?.data &&
      dataRes?.data.length > 0 &&
      dataRes?.data.map((item) => {
        return {
          key: item?._id,
          title: item?.title,
          content: item?.content,
          image: item?.image,
          menu: item?.menu,
          slug: item?.slug,
          createdTime: moment(new Date(item?.createdTime)).format("DD/MM/YYYY"),
        };
      });
    return dataRes?.data ? data : [];
  };

  const onFinish = async (data) => {
    const dataReq = {
      image: previewTitle,
      title: data.title,
      content: data.content,
      slug: data.slug,
      menu: data.menu,
    };

    if (!data.id) {
      //Save
      const dataRes = await insertThubnail(dataReq);
      if (dataRes.status === 1) {
        message.success(`Save Success! ${dataRes.message}`);
        setVisibleForm(false);
        handleCloseDrawer();
      } else {
        message.error(`Save Failed! ${dataRes.message}`);
      }
    } else {
      //Update
      const dataRes = await updateThubnail(data.id, dataReq);

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
      menu: dataEdit[0]?.menu?._id,
      title: dataEdit[0]?.title,
      slug: dataEdit[0]?.slug,
      content: dataEdit[0]?.content,
    });

    const previewImages = dataEdit[0].image.map((item) => {
      return {
        url: `${api.API_URL_BUNNY}/${item}`,
        name: item,
      };
    });

    setPreviewImage(previewImages[0]?.url || "");
    setPreviewTitle(dataEdit[0]?.image || []);
    setFileList(previewImages);
    setDrawerTitle("Edit Thumbnail");
    showDrawer();
  };



  const onDelete = async (key) => {
    const dataRes = await deleteThubnail(key);
    dataRes.status === 1
      ? message.success(`Delete Success! ${dataRes.message}`)
      : message.error(`Delete Failed! ${dataRes.message}`);

    handleRefresh();
  };

  const handleCancel = () => setPreviewVisible(false);

  const handleNewSlide = () => {
    setDrawerTitle("Add Thumbnail");
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
      const resDelete = await deleteImageBunny(file.name);
      if (resDelete.HttpCode === 200) {
        message.success("Delete file to Bunny successfully!");
        setPreviewImage("");
        setPreviewTitle((prevTitles) =>
          prevTitles.filter((title) => title !== file.name)
        );
        setFileList(fileList.filter((f) => f.uid !== file.uid));
      } else {
        message.error("Delete file to Bunny failed!");
      }
    },
    beforeUpload: async (file) => {
      const uploadFile = async (f) => {
        const resUpload = await uploadFileToBunny(f);
        if (resUpload.HttpCode === 201) {
          message.success("Upload file to Bunny successfully!");
          setPreviewImage(`${api.API_URL_BUNNY}/${f.name}`);
          setPreviewTitle((prevTitles) => [...prevTitles, f.name]);
        } else {
          message.error("Upload file to Bunny failed!");
          await deleteImageBunny(f.name);
          setPreviewImage("");
          setFileList(fileList.filter((file) => file.uid !== f.uid));
        }
      };

      if (Array.isArray(file)) {
        setFileList((prevFileList) => [...prevFileList, ...file]);
        Promise.all(file.map((f) => uploadFile(f)));
        return false;
      } else {
        setFileList((prevFileList) => [...prevFileList, file]);
        await uploadFile(file);
        return false;
      }
    },
    fileList,
  };



  const columns = [
    {
      title: "Img",
      dataIndex: "image",
      render: (image, record) => {
        return (
          image ?
            <Image width={150} src={`${api.API_URL_BUNNY}/${image[0]}`} />
            :
            ""
        )
      },
    },
    {
      title: "Menu",
      dataIndex: "menu",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Content",
      dataIndex: "content",
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
          <BreadCrumb title="Thumbnail" pageTitle="Management Thumbnail" />

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
                    label="Thumbnail Menu"
                    rules={[
                      {
                        required: true,
                        message: "Please select thumbnai menu!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select a thumbnai menu!"
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

                  <Form.Item
                    name="title"
                    label="Thumbnail Title"
                    rules={[
                      {
                        required: true,
                        message: "Please input thumbnai title!",
                      },
                      {
                        type: "title",
                      },
                      {
                        type: "string",
                        min: 10,
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter title"
                      name="title"
                      allowClear={true}
                      onChange={(e) => handleChangeTitle(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    name="slug"
                    label="Thumbnail Slug"
                    rules={[
                      {
                        required: false,
                        message: "Please input thumbnail slug!",
                      },
                      {
                        type: "slug",
                      },
                      {
                        type: "string",
                        min: 1,
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter thumbnail slug"
                      name="slug"
                      allowClear={true}
                      onChange={(e) => setThumbnailSlug(e.target.value)}
                      value={thumbnailSlug}
                    />
                  </Form.Item>

                  <Form.Item name="link" label="Img thumbnail" className="">
                    <Space align="start">
                      <Upload
                        {...props}
                        listType="picture-card"
                        onChange={handleChangeImage}
                        onPreview={handlePreview}
                        multiple={true}
                      >
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
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

                  <Form.Item
                    name="content"
                    label="Thumbnail content"
                    rules={[
                      {
                        required: true,
                        message: "Please input Thumbnail content!",
                      },
                    ]}
                  >
                    <TextArea
                      placeholder="Enter content"
                      name="description"
                      allowClear={true}
                    // showCount
                    />
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