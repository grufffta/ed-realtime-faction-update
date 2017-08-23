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
      <div class="columns">
        <div v-for="sys in this.systems" v-bind:key="sys.id">
          <div class="column">            
            <system :sys="sys" />
          </div>
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
      systems: {
      }
    }
  },
  components:{ System },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  },
  mounted: function () {
    var context = this
    db.watch.systems(function (system, key) {           
      Vue.set(context.systems, key, system)
      console.log('watch', key, system)
    })
  }
};
</script>

<style>

</style>
