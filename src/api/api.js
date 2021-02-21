const baseUrl = 'https://job-it-cnpmp.herokuapp.com';
// const baseUrl = 'http://c5e18a06d2a7.ngrok.io';
export const apiUrl = {
  LOGIN_URL: `${baseUrl}/api/v1/auth/login`,
  REGISTER_ITER_URL: `${baseUrl}/api/v1/auth/register-iter`,
  REGISTER_COMPANY_URL: `${baseUrl}/api/v1/auth/register-company`,
  GET_JOBS_URL: `${baseUrl}/api/v1/posts/accept`,
  GET_COMPANY_POST: `${baseUrl}/api/v1/posts/company`,
  CREATE_POST: `${baseUrl}/api/v1/posts`,
};
