/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const saveRouter = {
  path: '/save',
  component: Layout,
  redirect: 'save',
  alwaysShow: true,
  meta: { title: '寄存管理', icon: 'tab' },
  children: [
    {
      path: 'save-list',
      name: 'SaveList',
      component: () => import('@/views/save/save-list'),
      meta: {
        title: '寄存管理',
        noCache: true,
        perms: ['GET /api/v1/save/list']
      }
    }
  ]
}
export default saveRouter
