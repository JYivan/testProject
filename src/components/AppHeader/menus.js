/* eslint-disable */
const menus = [
  {
    label: '菜单1',
    roles: null,
    path: '/client/home'
  },
  {
    label: '菜单2',
    roles: null,
    path: '/client/menu2',
    children: [
      {
        label: '菜单21',
        roles: null,
        path: '/client/menu2/1'
      },
      {
        label: '菜单22',
        roles: ['FINANCE', 'SUPER', 'MANAGER'],
        path: '/client/menu2/2'
      }
    ]
  },
  {
    label: '菜单3',
    roles: null,
    path: '/client/menu3'
  },
]

export default menus
