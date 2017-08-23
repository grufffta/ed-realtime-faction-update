<template>
  <div class="card">
    <header class="card-header-title">{{ sys.faction && sys.faction.name }}</header>
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
            <tr v-for="state in sys.states" v-bind:key="state.id" v-if="state.id">
              <td>
                <abbr :title="`${ state.faction.allegiance}, ${ state.faction.government }`">{{ state.name }}</abbr>
              </td>
              <td>{{ Math.round(state.influence+'e4') / 100 }}%</td>
              <td>{{ state.state }}</td>
              <td>
                <div v-if="state.pending">
                  <span v-for="(p, pk) in state.pending" v-bind:key="pk" v-if="pk !== '#'">
                    {{ pk }}
                    <br/>
                  </span>
                </div>
              </td>
              <td>
                <div v-if="state.recovering">
                  <span v-for="(r,rk) in state.recovering" v-bind:key="rk" v-if="rk !== '#'">
                    {{ rk }}
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
      <p>last updated: {{ new Date(sys.timestamp).toString() }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'system',
  props: ['sys']
}
</script>