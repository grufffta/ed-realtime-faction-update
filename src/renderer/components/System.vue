<template>
  <div class="card">
    <header class="card-header-title">{{ sys.faction }}</header>
    <section class="card-content">
      <div class="content">
        <p class="title"> {{ sys.name }} ({{ sys.allegiance }})</p>
        <p class="subtitle">{{ sys.economy }}, {{ sys.government }}</p>
        <table class="table">
          <caption>Faction States</caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Influence</th>
              <th>State</th>
              <th>Pending</th>
              <th>Recovering</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="faction in sys.factions" v-bind:key="faction.Name">
              <td>
                <abbr :title="`${ faction.Allegiance}, ${ faction.Government }`">{{ faction.Name }}</abbr>
              </td>
              <td>{{ Math.round(faction.Influence+'e4') / 100 }}%</td>
              <td>{{ faction.FactionState }}</td>
              <td>
                <div v-if="faction.PendingStates">
                  <span v-for="p in faction.PendingStates" v-bind:key="p.State">
                    {{ p.State }}
                    <br/>
                  </span>
                </div>
              </td>
              <td>
                <div v-if="faction.RecoveringStates">
                  <span v-for="r in faction.RecoveringStates" v-bind:key="r.State">
                    {{ r.State }}
                    <br/>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <footer class="card-footer">
      <div class="card-footer-item is-centered">
      <p>last updated: {{ sys.timestamp }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'system',
  props: ['sys'],
  data () {
    return {}
  }
}
</script>