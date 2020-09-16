<template>
  <div>
    <div class="actions">
      <button v-on:click="getAllCarriers">Get All Carriers</button>

      <button v-on:click="getAllServicePoints">Get All Service Points</button>

      <div class="search">
        <SearchFormVue />
      </div>

      <ErrorVue />
    </div>

    <div class="tables">
      <table>
        <tr>
          <th>ID</th>

          <th>ExtId</th>

          <th>Created</th>

          <th>Name</th>

          <th>State</th>
        </tr>

        <tr v-for="item in fetchedCarriersData" :key="item.id">
          <td>{{ item.id }}</td>

          <td>{{ item.extId }}</td>

          <td>{{ item.created.date }}</td>

          <td>{{ item.name }}</td>

          <td>{{ item.state }}</td>
        </tr>
      </table>

      <table>
        <tr>
          <th>ID</th>

          <th>Created</th>

          <th>Name</th>

          <th>State</th>

          <th>Address</th>
        </tr>

        <tr v-for="item in fetchedServicePointsData" :key="item.id">
          <td>{{ item.id }}</td>

          <td>{{ item.created.date }}</td>

          <td>{{ item.name }}</td>

          <td>{{ item.state }}</td>

          <td>{{ item.rawAddress }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import SearchFormVue from "./components/SearchForm.vue";
import ErrorVue from "./components/Error.vue";

import { carrierData, servicePoints, search } from "./services/dataService";

export default {
  name: "App",
  components: {
    SearchFormVue,
    ErrorVue,
  },
  data() {
    return {
      fetchedCarriersData: [],
      fetchedServicePointsData: [],
      carrierSub: null,
      servicePointsSub: null,
    };
  },
  methods: {
    getAllCarriers: function (e) {
      e.preventDefault();
      
      search("carriers");
    },

    getAllServicePoints: function (e) {
      e.preventDefault();

      search("servicePoints");
    }
  },

  created() {
    this.carrierSub = carrierData.subscribe((data) => {
      this.fetchedCarriersData = data;
    });

    this.servicePointsSub = servicePoints.subscribe((data) => {
      this.fetchedServicePointsData = data;
    });
  },

  destroyed() {
    this.carrierSub.unsubscribe();
    this.servicePointsSub.unsubscribe();
  },
};
</script>
	
<style>
.actions {
  margin: 35px;
}

.search {
  margin: 20px 0;
}

.tables {
  display: flex;
}

table {
  margin: 20px;
}

table,
th,
td {
  border: 1px solid #000;
}

th,
td {
  width: 100px;
}

label {
  margin-right: 20px;
}

select,
input {
  min-width: 150px;
}
</style>
