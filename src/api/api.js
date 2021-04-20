const baseUrl = 'https://job-it-cnpmp.herokuapp.com';
export const apiUrl = {
  LOGIN_URL: `${baseUrl}/api/v1/auth/login`,
  REGISTER_ITER_URL: `${baseUrl}/api/v1/auth/register-iter`,
  REGISTER_COMPANY_URL: `${baseUrl}/api/v1/auth/register-company`,
  GET_JOBS_URL: `${baseUrl}/api/v1/posts`,
  GET_COMPANY_POST: `${baseUrl}/api/v1/posts/company`,
  CREATE_POST_URL: `${baseUrl}/api/v1/posts`,
  APPLY_JOB_URL: `${baseUrl}/api/v1/posts`,
  FORGOT_PASS_URL: `${baseUrl}/api/v1/auth/reset-password`,
  CONFIRM_CODE_URL: `${baseUrl}/api/v1/auth/confirm-code`,
  UPDATE_PASS_URL: `${baseUrl}/api/v1/auth/change-password`,
  CREATE_CV_URL: `${baseUrl}/api/v1/cv`,
  GET_A_CV: `${baseUrl}/api/v1/cv/user`,
  DELETE_POST_URL: `${baseUrl}/api/v1/posts`,
  // eslint-disable-next-line prettier/prettier
  // LIST_ITER_APPLY_URL: `${baseUrl}/api/v1/posts/{_id}/apply-list`,
};
