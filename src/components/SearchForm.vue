<template>
  <div>
    <form v-on:submit="handleSubmit" action="GET">
      <div class="form__head">
        <h2>Filter</h2>
      </div>

      <div class="form__body">
        <div class="controls">
          <label for="search">Search</label>
          <select name="search" id="search" v-model="search">
            <option value="carriers">Carriers</option>

            <option value="servicePoints">Service Points</option>
          </select>
        </div>

        <div class="controls">
          <label for="search-type">Select type of search</label>

          <select id="search-type" v-model="type">
            <option value="eq">Equal</option>

            <option value="neq">Not Equals</option>

            <option value="ls">Less than</option>

            <option value="lte">Less Than or Equals</option>

            <option value="gt">Greater Than</option>

            <option value="gte">Greater Than or Equals</option>

            <option value="isnull">Is Null</option>

            <option value="isnotnull">Is Not Null</option>

            <option value="in">In</option>

            <option value="notin">NotIn</option>

            <option value="between">Between</option>

            <option value="ismemberof">Is Member Of</option>

            <option value="field">Field</option>

            <option value="ilike">I Like</option>

            <option value="innerjoin">Inner join</option>
          </select>
        </div>

        <div v-if="unlockedFields.includes('direction')" class="controls">
          <label for="search-dir">Direction</label>

          <select name="dir" id="search-dir" v-model="direction">
            <option value="desc">Descending order</option>

            <option value="asc">Ascending order</option>
          </select>
        </div>

        <div v-if="unlockedFields.includes('where')" class="controls">
          <label for="search-where">Where</label>

          <select name="where" id="search-where" v-model="where">
            <option value="and">And</option>
          </select>
        </div>

        <div v-if="unlockedFields.includes('alias')" class="controls">
          <label for="search-alias">Alias</label>

          <select name="alias" id="search-alias" v-model="alias">
            <option value="r">Report</option>
          </select>
        </div>

        <div v-if="unlockedFields.includes('from')" class="controls">
          <label for="search-from">From</label>

          <input type="text" id="search-from" v-model="from" />
        </div>

        <div v-if="unlockedFields.includes('to')" class="controls">
          <label for="search-to">To</label>

          <input type="text" id="search-to" v-model="to" />
        </div>

        <div v-if="unlockedFields.includes('field')" class="controls">
          <label for="search-field">Field</label>

          <input type="text" id="search-field" v-model="field" />
        </div>

        <div v-if="unlockedFields.includes('value')" class="controls">
          <label for="search-value">Value</label>

          <input type="text" id="search-value" v-model="value" />
        </div>
      </div>

      <div class="form__actions">
        <button>Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import { search, commitError } from "./../services/dataService";

export default {
  name: "search-form",
  data: function () {
    return {
      search: "carriers",
      type: "eq",
      direction: "desc",
      where: "and",
      alias: "r",
      from: "",
      to: "",
      field: "",
      value: "",
      unlockedFields: ["field", "value"],
    };
  },

  methods: {
    handleSubmit: function (e) {
      e.preventDefault();

      const emptyField = this.unlockedFields.find((key) => this[key] === "");

      if (emptyField) {
        commitError(`${emptyField.toUpperCase()} field is empty!`);
        return;
      }

      const params = this.unlockedFields.reduce((obj, key) => {
        return {
          ...obj,
          [key]: this[key],
        };
      }, { type: this.type });

      search(this.search, [params]).finally(() => {
        this.resetFields();
      });
    },

    resetFields: function () {
      this.from = "";
      this.to = "";
      this.field = "";
      this.value = "";
    },
  },

  watch: {
    type: function (val) {
      const basicFields = ["field", "value"];
      const onlyField = ["field"];

      const fields = {
        eq: basicFields,
        neq: basicFields,
        lt: basicFields,
        lte: basicFields,
        gt: basicFields,
        gte: basicFields,
        isnull: onlyField,
        isnotnull: onlyField,
        in: basicFields,
        notin: basicFields,
        between: ["field", "from", "to"],
        like: basicFields,
        ismemberof: basicFields,
        field: ["field", "direction"],
        ilike: basicFields,
        innerjoin: ["field", "alias", "value"],
      };

      if (fields[val]) {
        this.resetFields();
        this.unlockedFields = fields[val];
      }
    },
  },
};
</script>
	
<style>
label {
  margin-right: 20px;
}

select,
input {
  min-width: 150px;
}

.form__actions {
  margin: 15px;
}

.form__error {
  color: red;
}
</style>
