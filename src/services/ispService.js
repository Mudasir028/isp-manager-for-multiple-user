import http from "./httpService";

function setFormData(data) {
  const formData = new FormData();
  for (let [key, value] of Object.entries(data)) formData.append(key, value);
  return formData;
}

async function createFranchise(admin_id, name, area, details) {
  const formData = new FormData();
  formData.append("admin_id", admin_id);
  formData.append("name", name);
  formData.append("area", area);
  formData.append("details", details);

  const { data } = await http.post("/create_franchise", formData);
  return data;
}

async function getAllFranchises(admin_id) {
  const formData = new FormData();
  formData.append("admin_id", admin_id);
  const { data } = await http.post("/franchises", formData);
  return data;
}

async function getFranchiseDetails(id) {
  const { data } = await http.get(`/franchise/${id}`);
  return data;
}
async function deleteFranchise({ ...params }) {
  const formData = setFormData(params);
  const { data } = await http.post("/delete_franchise", formData);
  return data;
}

async function updateFranchise(admin_id, name, area, details, id) {
  const formData = new FormData();
  formData.append("admin_id", admin_id);
  formData.append("name", name);
  formData.append("area", area);
  formData.append("details", details);
  formData.append("id", id);

  const { data } = await http.post("/update_franchise", formData);
  return data;
}

async function createUser({ ...params }) {
  const formData = setFormData(params);
  const { data } = await http.post(
    // `${config.apiEndpoint}/create_user`,
    "create_user",
    formData
  );
  return data;
}

async function getAllUsers(admin_id) {
  const formData = new FormData();
  formData.append("admin_id", admin_id);
  const { data } = await http.post("/all_users", formData);
  return data;
}

async function getUserDetails(id) {
  const { data } = await http.get(`/user/${id}`);
  return data;
}

async function updateUser({ ...params }) {
  const formData = setFormData(params);
  const { data } = await http.post("/update_user", formData);
  return data;
}

async function deleteUser({ ...params }) {
  const formData = setFormData(params);
  const { data } = await http.post("/delete_user", formData);
  return data;
}

async function updateFrontNic({ ...params }) {
  const formData = setFormData(params);
  const { data } = await http.post("/update_front_nic", formData);
  return data;
}
async function updateBackNic({ ...params }) {
  const formData = setFormData(params);
  const { data } = await http.post("/update_back_nic", formData);
  return data;
}
async function createSubscription({ ...params }) {
  const formData = setFormData(params);
  const { data } = await http.post("/create_subscription", formData);
  return data;
}

async function createPackage({ ...params }) {
  const formData = setFormData(params);
  const { data } = await http.post("/create_package", formData);
  return data;
}

async function getAllPackages(admin_id) {
  const formData = new FormData();
  formData.append("admin_id", admin_id);
  const { data } = await http.post("/packages", formData);
  return data;
}

async function updatePackage({ ...params }) {
  const formData = setFormData(params);
  const { data } = await http.post("/update_package", formData);
  return data;
}
async function deletePackage({ ...params }) {
  const formData = setFormData(params);
  const { data } = await http.post("/delete_package", formData);
  return data;
}

async function getPackageDetails(id) {
  const { data } = await http.get(`/package/${id}`);
  return data;
}
// async function updatePackagePic({ ...params }) {
//   const formData = setFormData(params);
//   const { data } = await http.post(
//     `${config.apiEndpoint}/update_package_pic`,
//     formData
//   );
//   return data;
// }
async function updatePackagePic(admin_id, pic, id) {
  const formData = new FormData();
  formData.append("admin_id", admin_id);
  formData.append("pic", pic);
  formData.append("id", id);

  const { data } = await http.post("/update_package_pic", formData);
  return data;
}

async function getSingleUserBills(user_id) {
  const formData = new FormData();
  formData.append("user_id", user_id);
  const { data } = await http.post("/user_bills", formData);
  return data;
}

async function getSubscriptions(admin_id) {
  const formData = new FormData();
  formData.append("admin_id", admin_id);
  const { data } = await http.post("/subscriptions", formData);
  return data;
}

async function getAllUserbills(admin_id) {
  const formData = new FormData();
  formData.append("admin_id", admin_id);
  const { data } = await http.post("/get_bills", formData);
  return data;
}

async function payUserbill(admin_id, user_id) {
  const formData = new FormData();
  formData.append("admin_id", admin_id);
  formData.append("user_id", user_id);
  const { data } = await http.post("/pay_bill", formData);
  return data;
}

async function getPaidBills(admin_id) {
  const formData = new FormData();
  formData.append("admin_id", admin_id);
  const { data } = await http.post("/paid_bills", formData);
  return data;
}

export default {
  createFranchise,
  getAllFranchises,
  getFranchiseDetails,
  deleteFranchise,
  updateFranchise,
  createUser,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  updateFrontNic,
  updateBackNic,
  createSubscription,
  createPackage,
  getAllPackages,
  getPackageDetails,
  updatePackage,
  deletePackage,
  updatePackagePic,
  getSingleUserBills,
  getSubscriptions,
  getAllUserbills,
  payUserbill,
  getPaidBills,
};
