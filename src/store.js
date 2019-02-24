import Vue from "vue";
import Vuex from "vuex";
import EventService from "@/services/EventService";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: "abc123",
      name: "Eder Ramirez"
    },
    categories: [
      "sustainability",
      "nature",
      "animal welfare",
      "housing",
      "education",
      "food",
      "community"
    ],
    events: [
      { id: 1, text: "...", done: true },
      { id: 2, text: "...", done: false },
      { id: 3, text: "...", done: true },
      { id: 4, text: "...", done: false }
    ],
    eventsTotal: 0,
    event: {}
  },
  mutations: {
    ADD_EVENT(state, event) {
      state.events.push(event);
    },
    SET_EVENTS(state, events) {
      state.events = events;
    },
    SET_EVENTS_TOTAL(state, eventsTotal) {
      state.eventsTotal = eventsTotal;
    },
    SET_EVENT(state, event) {
      state.event = event;
    }
  },
  actions: {
    async createEvent({ commit }, event) {
      try {
        await EventService.postEvent(event);
        commit("ADD_EVENT", event);
      } catch (error) {
        console.log("TCL: }catch -> error", error);
      }
    },
    async fetchEvents({ commit }, { perPage, page }) {
      try {
        const response = await EventService.getEvents(perPage, page);
        console.log("Total events are " + response.headers["x-total-count"]);
        commit("SET_EVENTS", response.data);
        commit("SET_EVENTS_TOTAL", parseInt(response.headers["x-total-count"]));
      } catch (err) {
        console.log("TCL: }catch -> err", err);
      }
    },
    async fetchEvent({ commit, getters }, id) {
      let event = getters.getEventById(id);

      if (event) {
        commit("SET_EVENT", event);
      } else {
        try {
          const res = await EventService.getEvent(id);
          commit("SET_EVENT", res.data);
        } catch (err) {
          console.log("ERROR: ", err.response);
        }
      }
    }
  },
  getters: {
    getEventById: state => id => {
      return state.events.find(event => event.id === id);
    }
  }
});
