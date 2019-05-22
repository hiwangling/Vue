<template>
  <div style="height:600px">
    <template v-for="(item,index) in content">
      <drag :key="index" :child="item" :styles="item.styles" />
    </template>
    <p>大字：{{ fn.big }}</p>
    <p>小字：{{ fn.small }}</p>
  </div>
</template>
<script>
import Drag from './components/Drag'
export default {
  components: { Drag },
  data() {
    return {
      content: [{
        txt: '一九八九',
        size: 'b',
        styles: {
          left: '400px',
          top: '150px',
          width: '180px'
        }
      }, {
        txt: '一九八八',
        size: 'small',
        styles: {
          left: '400px',
          top: '50px',
          width: '180px'
        }
      }, {
        txt: '一九八八',
        size: 's',
        styles: {
          left: '500px',
          top: '50px',
          width: '180px'
        }
      }]
    }
  },
  computed: {
    fn: function() {
      let big = 0; let small = 0
      this.content.filter((v, k) => {
        v.txt = (v.txt.match(/[\u4e00-\u9fa5]/g)).join('')
        v.size === 'b' ? big += v.txt.length : small += v.txt.length
      }
      )
      return { big, small }
    }
  }
}
</script>

