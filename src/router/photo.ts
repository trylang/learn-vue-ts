import index from '@/views/Index.vue'
import List from '@/views/List.vue'
import Add from '@/views/Add.vue'
import Detail from '@/views/Detail.vue'
import Statistics from '@/views/Statistics.vue'
import Rule from '@/views/Rule.vue'

const photoRoute = [{
  path: 'index',
  component: index
},{
  path: 'list',
  component: List
}, {
  path: 'add',
  component: Add
}, {
  path: 'detail',
  component: Detail
}, {
  path: 'statistics',
  component: Statistics
}, {
  path: 'rule',
  component: Rule
}]

export default photoRoute