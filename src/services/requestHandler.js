import {
  del,
  get,
  patch,
  post,
  put,
} from "./HttpProvider";
import featureConstants from "./features-constants";

const SERVICE_URLS = {
  login: "/auth/login",
};

const login = (data) =>
  post(SERVICE_URLS.login, data, { feature: featureConstants.login });
const logoutUser = (data) =>
  del(SERVICE_URLS.login, data, { feature: featureConstants.login });
const profileStep3 = (data) =>
  put(SERVICE_URLS.login, data, { feature: featureConstants.login });
const updateProfilePicture = (data) =>
  patch(SERVICE_URLS.login, data, {
    featrue: featureConstants.login,
  });
const readUserProfile = (data) =>
  get(SERVICE_URLS.login, {}, { feature: featureConstants.login });

const apiServices = {
  login,
  profileStep3,
  updateProfilePicture,
  readUserProfile,
  logoutUser,
};
export default apiServices;
