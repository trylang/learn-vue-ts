import index from '@/views/Index.vue';
import List from '@/views/List.vue';
import Add from '@/views/Add.vue';
import Detail from '@/views/Detail.vue';
import Statistics from '@/views/Statistics.vue';
import Rule from '@/views/Rule.vue';

const photoRoute = [{
  path: 'index',
  name: '拍照积分',
  component: index,
}, {
  path: 'list',
  name: '拍照列表',
  component: List,
}, {
  path: 'add',
  name: '添加',
  component: Add,
}, {
  path: 'detail',
  name: '详情',
  component: Detail,
}, {
  path: 'statistics',
  name: '数据统计',
  component: Statistics,
}, {
  path: 'rule',
  name: '规则说明',
  component: Rule,
}];

export default photoRoute;
