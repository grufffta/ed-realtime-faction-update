<template>
  <main class="section">
    <header>
      <h1 class="title">Options</h1>
      <label class="label">Expansion Order</label>
      <div class="field has-addons">        
        <div class="control is-expanded">
          <input class="input" v-model="sort" placeholder="Sort Expansion Order" />
        </div>
        <div class="control">
          <a class="button is-info" disabled>Save Order</a>
        </div>
      </div>
      <hr />
    </header>
    <div>
      <h1 class="title">Elite Dangerous</h1>
      <h2 class="subtitle">Faction States v0.1 [Alpha]</h2>
      <p>Running the app will scan your latest and subsequent log files for system and faction data. {{ Object.keys(systems).length }} systems are known</p>
      <hr />
      <div class="columns is-multiline">
        <div v-for="sys in this.sortedSystems" v-bind:key="sys.id" class="column is-one-third-fullhd is-half-desktop ">
          <system :sys="sys" />
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
      sort: ['LFT 37', 'Nemet', 'Qarato', 'Segovit', 'Andhrimi', 'Isis', 'Nabatean', 'Kappa Phoenicis', 'BPM 45047', 'LTT 9795', 'Tavgi', 'Theta Sculptoris', 'Sugrivik', 'Pachamama'],
      systems: {
      }
    }
  },
  components: { System },
  methods: {

  },
  computed: {
    sortedSystems: function() {
      let results = []
      let nf = 0
      for (var s in this.systems) {
        this.systems[s].expansion = this.sort.indexOf(this.systems[s].name)             
        
        if (this.systems[s].expansion === -1) {
          this.systems[s].expansion = this.systems[s].timestamp
        }
        console.log(this.systems[s].expansion, this.systems[s].name)        
        results.push(this.systems[s])
      }
      return results.sort((a, b) => {
        if (a.expansion > 100 && b.expansion > 100){
          return b.expansion - a.expansion
        }
        return a.expansion - b.expansion
      })
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
