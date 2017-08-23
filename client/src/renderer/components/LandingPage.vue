<template>
  <main class="section">
    <header>
      <h1 class="title">Options</h1>
      <h2 class="subtitle">Soon</h2>
      <hr />
    </header>
    <div>
      <h1 class="title">Elite Dangerous</h1>
      <h2 class="subtitle">Faction States v0.1 [Alpha]</h2>
      <p>Running the app will your log files for system and faction data, {{ Object.keys(systems).length }} systems known</p>
      <hr />
        <div class="columns is-multiline">
          <div v-for="sys in this.sortedSystems" v-bind:key="sys.id" class="column is-one-third-fullhd is-half-desktop ">
            <system :sys="sys" />
          </div>
        </div> 
    </div>
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import db from '../log-reader/db.js'
import System from './System'

export default {
  name: 'landing-page',
  data() {
    return {
      sort: ['LFT 37','Nemet','Qarato','Segovit','Andhrimi','Isis','Nabatean','Kappa Phoenicis','BPM 45047','LTT 9795','Tavgi','Theta','Sugrivik','Pachamama'],
      systems: {
      }
    }
  },
  components: { System },
  methods: {

  },
  computed: {
    sortedSystems: function () {      
      let results = []
      for(var s in this.systems){        
          this.systems[s].expansion = this.sort.indexOf(this.systems[s].name)        
          results.push(this.systems[s])
      }
      return results.sort((a,b) => a.expansion - b.expansion)
    }
  },
  mounted: function() {
    var context = this
    db.watch.systems(function(system, key) {
      Vue.set(context.systems, key, system)    
    })
  }
};
</script>

<style>

</style>
