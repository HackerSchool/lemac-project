<template>
  <v-row>
    <v-col cols="11" sm="5">
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :close-on-click="false"
        :nudge-right="40"
        :return-value.sync="timeStart"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="timeStart"
            label="Entry Hours"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            required
            :rules="[() => !!timeStart || 'This field is required']"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker v-if="menu" v-model="timeStart" :max="timeEnd" full-width format="24hr">
          <v-spacer />
          <v-btn text color="success" @click="menu = false"> Cancel </v-btn>
          <v-btn text color="secondary" @click="setTimeStart"> OK </v-btn>
        </v-time-picker>
      </v-menu>
    </v-col>
    <v-spacer></v-spacer>
    <!--Exit hours menu-->
    <v-col cols="11" sm="5">
      <v-menu
        ref="menu2"
        v-model="menu2"
        :close-on-content-click="false"
        :close-on-click="false"
        :nudge-right="40"
        :return-value.sync="timeEnd"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="timeEnd"
            label="Exit Hours"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            required
            :rules="[() => !!timeEnd || 'This field is required']"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker v-if="menu2" v-model="timeEnd" :min="timeStart" full-width format="24hr">
          <v-spacer />
          <v-btn text color="success" @click="menu2 = false"> Cancel </v-btn>
          <v-btn text color="secondary" @click="setTimeEnd"> OK </v-btn>
        </v-time-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'LoginTimePicker',
  data() {
    return {
      timeStart: null,
      timeEnd: null,
      menu: false,
      menu2: false,
    };
  },
  methods: {
    setTimeStart() {
      this.$refs.menu.save(this.timeStart);
      this.$emit('setStart', this.timeStart);
    },
    setTimeEnd() {
      this.$refs.menu2.save(this.timeEnd);
      this.$emit('setEnd', this.timeEnd);
    },
  },
};
</script>

<style></style>
