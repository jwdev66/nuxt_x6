<template>
  <div id="app">
    <div class="x6-content">
      <div id="x6-stencil" class="x6-sidebar" />
      <div class="x6-panel">                    
        <div id="x6-container" class="x6-graph" />
      </div>  
      <ul id="node-conext-menu" >
        <li class="menu-item">Action 1</li>
        <li class="menu-item">Action 2</li>
        <li class="menu-item">Action 3</li>
      </ul>
    </div>            
  </div>            
</template>

<script>
import FlowGraph from "../components/graph/index"

if(process.client) {
  window.X6 = require("@antv/x6")
}

const resizeFn = () => {
  const width = document.body.offsetWidth - 291  
  const height = document.body.offsetHeight  
  FlowGraph.graph.resize(width, height)    
}

const handleWindowClick = (e) => {    
  if(!document.getElementById("node-conext-menu").contains(e.target)) {
    document.getElementById("node-conext-menu").style.display="none";
  }
}

export default {
  name: 'GraphView',
  mounted() {        
    FlowGraph.init()                
    resizeFn()
    window.addEventListener('resize', resizeFn)    
    window.addEventListener('mousedown', handleWindowClick)
  },
  unmounted() {    
    window.removeEventListener('resize', resizeFn)    
    window.removeEventListener('mousedown', handleWindowClick)
  }
}
</script>

<style lang="scss">
  #app {
    width: 100vw;
    height: 100vh;        
    .x6-content {
      display: flex;
      height: 100%;       
      .x6-sidebar {
        position: relative;
        width: 240px;
        height: 100%;
        border-right: 1px solid rgba(0, 0, 0, 0.08);    
      }    
      .x6-panel {
        height: 100%;
        width: calc(100% - 240px);
      } 
    }
  }
  ul#node-conext-menu {
    z-index: 100;
    position: absolute;
    left: 200px;
    top: 100px;    
    display: none;    
    padding: 0px;
    list-style: none;
    background: white;
    border-radius: 4px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);

    li.menu-item {
      display: block;
      padding: 10px 30px;
      transition: 0.1s;
      color: #666;

      &:hover {
        background-color: #eee;
        cursor: pointer;
      }
    }
  }
</style>
