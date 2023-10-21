import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../common/BreadCrumb";
import { Editor } from "@tinymce/tinymce-react";
import {
  PlusOutlined,
} from "@ant-design/icons";
import PostStatus from "../../../store/status/postStatus";
import {
  deleteImageBunny,
  uploadFileToBunny,
} from "../../../helpers/api_bunny";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Input,
  Button,
  Form,
  message,
  Space,
  Select,
  Modal,
  Upload,
  Checkbox
} from "antd";
import {
  getAllMenu,
  insertPosts,
  getPagingPostsV2,
  updatePosts,
  getPostById,
} from "../../../helpers/helper";
import { useHistory } from "react-router-dom";
import toSlug from "../../../common/function";
import { api } from "../../../config";


const { Option } = Select;
const { TextArea } = Input;

const user_id = JSON.parse(sessionStorage.getItem("authUser"))
  ? JSON.parse(sessionStorage.getItem("authUser")).user._id
  : null;

const getAllPagingPostsV2 = async (_params) => {
  const params = _params ? _params : {};
  const dataRes = await getPagingPostsV2(params);

  const dataListPost =
    dataRes?.data &&
    dataRes?.data.length > 0 &&
    dataRes?.data.map((item) => {
      return {
        key: item?._id,
        title: item?.title,
        slug: item?.slug,
        menu: item?.menu,
        description: item?.description,
        thumb: item?.thumb,
        content: item?.content,
        status: item?.status,
        numberOfReader: item?.numberOfReader,
      };
    });
  return dataRes?.data ? dataListPost : [];
};

function isEmpty(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

const getBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

export default function NewPost(props) {
  const history = useHistory();
  const [form] = Form.useForm();
  const [cacheSchemas, setCacheSchemas] = useState([]);
  const [post, setPost] = useState({});
  const [listStatus, setListStatus] = useState([]);
  const editorContentRef = useRef(null);
  const editorDescriptionRef = useRef(null);
  const [content, setContent] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [listMenu, setListMenu] = useState([]);
  const [description, setDescription] = useState("");
  const [descriptionData, setDescriptionData] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [listPost, setListPost] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [visibleForm, setVisibleForm] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const resListMenu = await getAllMenu({ pageSize: 100000 });
      const resListPost = await getAllPagingPostsV2({ pageSize: 100000 });
      setListMenu(resListMenu.data);
      setListPost(resListPost);
      setListStatus(PostStatus);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const value = props.match.params;
    const getPost = async () => {
      const post = await getPostById(value.id);
      setPost(post);
      form.setFieldsValue({
        id: post?._id,
        title: post?.title,
        slug: post?.slug,
        menu: post?.menu?._id || null,
        thumb: post?.thumb,
        status: post?.status,
        numberOfReader: post?.numberOfReader,
        description: post?.description,
        content: post?.content,
        highlight: post?.highlight
      });

      setFileList([
        {
          url: `${api.API_URL_BUNNY}/${post?.thumb}`,
          name: post?.thumb,
        },
      ]);
      setPreviewImage(`${api.API_URL_BUNNY}/${post?.thumb}`);
      setPreviewTitle(post?.thumb);
      setContent(post?.content);
      setDescription(post?.description);
      setDescriptionData(post?.description);
    };

    if (isEmpty(value) === false) {
      getPost();
    }
  }, [props.match.params]);

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

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (cacheSchemas.length !== 0) {
      cacheSchemas.map((item) => {
        if (item?.script?.image) {
          item.script.image[
            "url"
          ] = `${process.env.REACT_APP_IMAGE}${newFileList[0].name}`;
        } else {
          item.script.thumbnailUrl = [
            `${process.env.REACT_APP_IMAGE}${newFileList[0].name}`,
          ];
        }
      });
      setCacheSchemas(cacheSchemas);
    }
  };

  const onFinish = async (data) => {
    let content = "";
    let description = "";

    if (editorContentRef.current) {
      content = editorContentRef.current.getContent() || "";
    }
    if (editorDescriptionRef.current) {
      description = editorDescriptionRef.current.getContent() || "";
    }

    const dataReq = {
      title: data.title,
      slug: data.slug,
      description: description,
      thumb: previewTitle,
      content: content,
      menu: data.menu || null,
      user: user_id,
      numberOfReader: data.numberOfReader,
      status: data.id ? data.status : data.status.value,
      highlight: data.highlight
    };
    if (!data.id) {
      const dataRes = await insertPosts(dataReq);
      if (dataRes.status === 1) {
        message.success(`Save Success! ${dataRes.message}`);
        onClose();
        const dataAll = await getAllPagingPostsV2();
        setListPost(dataAll);
        handleRefresh();
      } else message.error(`Save Failed! ${dataRes.message}`);
    } else {
      const dataRes = await updatePosts(data.id, dataReq);
      if (dataRes.status === 1) {
        message.success(`Save Success! ${dataRes.message}`);
        onClose();
        const dataAll = await getAllPagingPostsV2();
        setListPost(dataAll);
        handleRefresh();
      } else {
        message.error(`Save Failed! ${dataRes.message}`);
      }
    }
    history.goBack()
  };

  const onClose = () => {
    setContent("");
    setVisibleForm(false);
  };

  const handleRefresh = async () => {
    form.resetFields();
    setFileList([]);
    setPreviewImage("");
    handleChangeEditorContent();
    handleChangeEditorDescription();
    setCacheSchemas([]);
    setContent("");
    setDescription("");
    setDescriptionData("");
    editorContentRef.current.setContent("");
    editorDescriptionRef.current.setContent("");
  };

  const propsUpload = {
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
        setPreviewImage(`${api.API_URL_BUNNY}/${file.name}`);
        setPreviewTitle(file.name);
        return false;
      } else {
        message.error("Upload file to Bunny failed!");
        deleteImageBunny(file.name);
        setPreviewImage("");
        setFileList([]);
        return false;
      }
    },
  };

  const handleChangeTitle = (value) => {
    setTitle(value);
    form.setFieldsValue({
      slug: toSlug(value),
    });
    if (cacheSchemas.length !== 0) {
      cacheSchemas.map((item) => {
        if (item?.script?.headline) {
          item.script.headline = value;
          item.script.mainEntityOfPage["@id"] = `${process.env.REACT_APP_URL
            }/${toSlug(value)}`;
        } else {
          item.script.name = `VIDEO: ${value}`;
        }
      });
      setCacheSchemas(cacheSchemas);
    }
  };

  const handleCancel = () => setPreviewVisible(false);

  const handleChangeEditorContent = (value, editor) => {
    const p = document.createElement("p");
    p.innerHTML = value;
    const content = p.innerText;
    setDescriptionData(content);
    form.setFieldsValue({
      content: content,
    });
    if (cacheSchemas.length !== 0) {
      cacheSchemas.map((item) => {
        if (item?.script?.description) {
          item.script.description = content;
        }
      });
      setCacheSchemas(cacheSchemas);
    }
  };

  const handleChangeEditorDescription = (value, editor) => {
    const p = document.createElement("p");
    p.innerHTML = value;
    const description = p.innerText;
    setDescriptionData(description);
    form.setFieldsValue({
      description: description,
    });
    if (cacheSchemas.length !== 0) {
      cacheSchemas.map((item) => {
        if (item?.script?.description) {
          item.script.content = description;
        }
      });
      setCacheSchemas(cacheSchemas);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={props.match.params.id ? "Update Post" : "New Post"}
            history={history}
            pageTitle="Management Posts"
          />
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => history.goBack()}
          />
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
              <Col sm={3}>
                <Form.Item
                  name="title"
                  label="Post Title"
                  rules={[
                    {
                      required: true,
                      message: "Please input post title!",
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
              </Col>
              <Col sm={3}>
                <Form.Item
                  name="slug"
                  label="Post Slug"
                  rules={[
                    {
                      required: false,
                      message: "Please input post slug!",
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
                    placeholder="Enter post slug!"
                    name="slug"
                    allowClear={true}
                  />
                </Form.Item>
              </Col>
              <Col sm={3}>
                <Form.Item
                  name="menu"
                  label="Post Menu"
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
                            {item?.menuName +
                              (item?.parent != null
                                ? " (" + item?.parent?.menuName + ")"
                                : "")}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={3}>
                <Form.Item
                  name="thumb"
                  label="Post Thumb"
                  className=""
                  rules={[
                    {
                      required: true,
                      message: "Please select post thumb!",
                    },
                  ]}
                >
                  <Space align="start">
                    <Upload
                      {...propsUpload}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleChange}
                      onPreview={handlePreview}
                    >
                      {fileList.length >= 1 ? null : (
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
                      )}
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
              </Col>

              <Col sm={3}>
                <Form.Item
                  name="status"
                  label="Post Status"
                  rules={[
                    {
                      required: true,
                      message: "Please select post statu!",
                    },
                  ]}
                >
                  <Select
                    name="status"
                    placeholder="Select a post status!"
                    allowClear
                  >
                    {listStatus.length > 0 &&
                      listStatus.map((item, index) => {
                        return (
                          <Option key={item.value} value={item.value}>
                            {item.label}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={3}>
                <Form.Item name="numberOfReader" label="Post Number Of Reader">
                  <Input
                    placeholder="Enter number of reader"
                    name="numberOfReader"
                    allowClear={true}
                    type="number"
                  // showCount
                  />
                </Form.Item>
              </Col>

              <Col sm={3}>
                <Form.Item name="highlight" label="Post highlight" valuePropName="checked">
                  <Checkbox name="highlight">Bài viết nổi bật</Checkbox>
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please select post description!",
                    },
                  ]}
                >
                  <div className="ant-col ant-form-item-label">
                    <label
                      htmlFor="content"
                      className="ant-form-item-required"
                      title="Post Content"
                    >
                      Post Description
                    </label>
                  </div>
                  <Editor
                    apiKey={"w17lpon88s3owkb87t8wnmyrb7dnvziqf3mrghzfk7ft8cpl"}
                    onInit={(evt, editor) => {
                      editorDescriptionRef.current = editor;
                    }}
                    initialValue={description}
                    onEditorChange={handleChangeEditorDescription}
                    init={{
                      height: 300,
                      menubar: false,
                      file_picker_callback: function (cb, value, meta) {
                        var input = document.createElement("input");
                        input.setAttribute("type", "file");
                        input.setAttribute("accept", "image/*");
                        input.onchange = function () {
                          var file = this.files[0];

                          var reader = new FileReader();
                          reader.onload = function () {
                            var id = "blobid1" + new Date().getTime();
                            var blobCache =
                              editorDescriptionRef.current.editorUpload.blobCache;
                            var base64 = reader.result.split(",")[1];
                            var blobInfo = blobCache.create(id, file, base64);
                            blobCache.add(blobInfo);

                            /* call the callback and populate the Title field with the file name */
                            cb(blobInfo.blobUri(), { title: file.name });
                          };
                          reader.readAsDataURL(file);
                        };
                        input.click();
                      },
                      paste_data_images: true,
                      image_title: true,
                      automatic_uploads: true,
                      file_picker_types: "image",
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                        "image",
                      ],
                      toolbar:
                        "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image | code",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: "Please select post content!",
                    },
                  ]}
                >
                  <div className="ant-col ant-form-item-label">
                    <label
                      htmlFor="content"
                      className="ant-form-item-required"
                      title="Post Content"
                    >
                      Post Content
                    </label>
                  </div>
                  <Editor
                    apiKey={"w17lpon88s3owkb87t8wnmyrb7dnvziqf3mrghzfk7ft8cpl"}
                    onInit={(evt, editor) => {
                      editorContentRef.current = editor;
                    }}
                    initialValue={content}
                    onEditorChange={handleChangeEditorContent}
                    init={{
                      height: 400,
                      menubar: false,
                      file_picker_callback: function (cb, value, meta) {
                        var input = document.createElement("input");
                        input.setAttribute("type", "file");
                        input.setAttribute("accept", "image/*");
                        input.onchange = function () {
                          var file = this.files[0];

                          var reader = new FileReader();
                          reader.onload = function () {
                            var id = "blobid1" + new Date().getTime();
                            var blobCache =
                              editorContentRef.current.editorUpload.blobCache;
                            var base64 = reader.result.split(",")[1];
                            var blobInfo = blobCache.create(id, file, base64);
                            blobCache.add(blobInfo);
                            /* call the callback and populate the Title field with the file name */
                            cb(blobInfo.blobUri(), { title: file.name });
                          };
                          reader.readAsDataURL(file);
                        };
                        input.click();
                      },
                      paste_data_images: true,
                      image_title: true,
                      automatic_uploads: true,
                      file_picker_types: "image",
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                        "image",
                      ],
                      toolbar:
                        "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image | code",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row >
            <Form.Item className="mt-3">
              <Space>
                <Button type="primary" htmlType="submit">
                  Save
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
          </Form >
        </Container >
      </div >
    </React.Fragment >
  );
}