<template>
  <div class="error">
    <p>{{message}}</p>
  </div>
</template>

<script>
import { error } from "./../services/dataService";

export default {
  name: "Error",
  data() {
    return {
      message: "",
      subject: null
    };
  },

  created() {
      this.subject = error.subscribe(message => {
          this.message = message;
      })
  },

  destroyed() {
      this.subject.unsubscribe();
  },
};
</script>
	
<style>
.error {
  color: red;
}
</style>
