<template>
  <div>
    <h1>Evento list</h1>
    <EventCard v-for="event in events" :key="event.id" :event="event" />
    <BaseIcon />
  </div>
</template>

<script>
import EventCard from "@/components/EventCard.vue";
import EventService from "@/services/EventService";
export default {
  components: {
    EventCard
  },
  data() {
    return {
      events: []
    };
  },
  async created() {
    try {
      const response = await EventService.getEvents();
      this.events = response.data;
    } catch (err) {
      console.log("TCL: }catch -> err", err);
    }
  }
};
</script>
/eventos
