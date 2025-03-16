<script setup>
import { ref } from "vue";
const kibanaUrl = ref("http://localhost:5601/goto/4717cc20-0270-11f0-b05c-eb347db73f85");
// export default {
//   data() {
//     return {
//       kibanaUrl: this.buildKibanaUrl()
//     };
//   },
//   methods: {
//     buildKibanaUrl() {
//       const kibanaHost = "http://localhost:5601"; // 替换为你的Kibana地址
//       const indexPatternId = "anomaly-logs-rag"; // 替换为你的索引模式ID
//       const timeRange = {
//         // from: "now-15m",
//         from: "2005-01-01T00:00:00.000Z",
//         to: "now"
//       };
//       const query = ""; // 可以指定KQL查询条件
//       return "http://localhost:5601/goto/4717cc20-0270-11f0-b05c-eb347db73f85"
//       // return `${kibanaHost}/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:${timeRange.from},to:${timeRange.to}))&_a=(columns:!(_source),filters:!(),index:'${indexPatternId}',interval:auto,query:(language:kuery,query:'${query}'),sort:!(!('@timestamp',desc)))`;
//     }
    
//   }
// };
</script>

<template>
    <div>
      <div><strong>Kibana</strong></div>
      <br>
      <iframe
        :src="kibanaUrl"
        width="100%"
        height="800px"
        frameborder="0"
      ></iframe>
    </div>
  </template>
  
