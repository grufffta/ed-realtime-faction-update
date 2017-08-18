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
      <p>Running the app will your log files for system and faction data</p>
      <hr />
      <div class="columns">
        <div v-for="sys in this.systems" v-bind:key="sys.id">
          <div class="column">
            <system :sys="sys" />
          </div>
        </div>
      </div>
    </div>  
  </main>
</template>

<script>  
import Vue from 'vue'
import db from '@/db'
import System from '@/components/System'

import { watchEliteDangerousLog, stopWatching } from '../elite'
export default {
  name: 'landing-page',
  data() {
    return {}
  },
  gunData: {
    _rootKey: 'erfu',
    systems: {
   
    }
  },
  components: { System },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    }
  },
  mounted: function () {
    if (!process.env.IS_WEB) {
      var context = this
      watchEliteDangerousLog(function (data) {
        var system = {
          id: data.StarSystem.replace(/ /g,'_').replace(/'/g,''),
          name: data.StarSystem,
          faction: data.SystemFaction,
          allegiance: data.SystemAllegiance,
          powerplay: data.PowerplayState,
          economy: data.SystemEconomy_Localised,
          government: data.SystemGovernment_Localised,
          security: data.SystemSecurity_Localised,
          timestamp: data.timestamp,
          powers: {},
          factions: {}
        }
        data.Powers.forEach(power => system.powers[power.replace(/ /g, '_')] = power)
        data.Factions.forEach(faction => system.factions[faction.Name.replace(/ /g,'_').replace(/'/g,'')] = faction)
        if (context.systems[system.id] && Date.parse(context.systems[system.id].timestamp) > Date.parse(system.timestamp)) return        

        context.$set(context.systems, system.id, system)                        
        Vue.$gunData.addWatchers(context.$options.gunData, '', context)
      })
    }
  },
  beforeDestroy: function () {
    if (!process.env.IS_WEB) {
      stopWatching()
    }
  } 
}
</script>

<style scoped>

</style>
