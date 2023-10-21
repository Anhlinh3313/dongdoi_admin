/* eslint-disable no-debugger */
const AccessKeyBunny = "f840ee21-bb75-4cd3-94ea5a90379b-1155-4a21";
const url = "https://storage.bunnycdn.com/dongdoi/";

const uploadFileToBunny = async (file) => {
  var fileName = file.name;
  const blob = new Blob([file]);
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
      AccessKey: AccessKeyBunny,
    },
    body: blob,
  };

  return await fetch(url + fileName, options)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
};

const getListImageBunny = async () => {
  const options = {
    method: "GET",
    headers: {
      Accept: "*/*",
      AccessKey: AccessKeyBunny,
    },
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));
};

const deleteImageBunny = async (fileName) => {
  const options = {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      AccessKey: AccessKeyBunny,
    },
  };

  return await fetch(url + fileName, options)
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));
};

export { uploadFileToBunny, getListImageBunny, deleteImageBunny };
