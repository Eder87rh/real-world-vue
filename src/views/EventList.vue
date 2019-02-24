<template>
  <div>
    <h1>Events for {{ user.user.name }}</h1>
    <EventCard v-for="event in event.events" :key="event.id" :event="event" />
    <template v-if="page != 1">
      <router-link
        :to="{ name: 'event-list', query: { page: page - 1 } }"
        rel="prev"
        >Prev Page</router-link
      >
    </template>
    |
    <template v-if="hasNextPage">
      <router-link
        :to="{ name: 'event-list', query: { page: page + 1 } }"
        rel="prev"
        >Next Page</router-link
      >
    </template>
  </div>
</template>
<script>
import EventCard from "@/components/EventCard.vue";
import { mapState } from "vuex";
import store from "@/store/store";

async function getPageEvents(to, next) {
  try {
    const currentPage = parseInt(to.query.page) || 1;
    await store.dispatch("event/fetchEvents", {
      page: currentPage
    });
    to.params.page = currentPage;
    next();
  } catch (error) {
    console.log("TCL: }catch -> error", error);
  }
}

export default {
  props: {
    page: {
      type: Number,
      required: true
    }
  },
  components: {
    EventCard
  },
  async beforeRouteEnter(to, from, next) {
    getPageEvents(to, next);
  },
  async beforeRouteUpdate(to, from, next) {
    getPageEvents(to, next);
  },
  computed: {
    hasNextPage() {
      return this.event.eventsTotal > this.page * this.event.perPage;
    },
    ...mapState(["event", "user"])
  }
};
</script>
