const domain = process.env.BUILD_ENV === 'test'
  ? process.env.REACT_APP_TEST_DOMAIN
  : process.env.REACT_APP_DOMAIN
const userCenterDomain = process.env.BUILD_ENV === 'test'
  ? process.env.REACT_APP_TEST_USER_CENTER_DOMAIN
  : process.env.REACT_APP_USER_CENTER_DOMAIN

const basicConfig = {
  domain,
  userCenterDomain,
  loginUrl: `${userCenterDomain}/otherSystem/login1`,
  loginCodeUrl: `${userCenterDomain}/otherSystem/login`
}

export default basicConfig
