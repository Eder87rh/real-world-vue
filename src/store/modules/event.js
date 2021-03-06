import EventService from "@/services/EventService";

export const namespaced = true;

export const state = {
  events: [
    { id: 1, text: "...", done: true },
    { id: 2, text: "...", done: false },
    { id: 3, text: "...", done: true },
    { id: 4, text: "...", done: false }
  ],
  eventsTotal: 0,
  event: {},
  perPage: 3
};

export const mutations = {
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
};

export const actions = {
  async createEvent({ commit, dispatch }, event) {
    try {
      await EventService.postEvent(event);
      commit("ADD_EVENT", event);
      const notification = {
        type: "success",
        message: "Your event has been created!"
      };
      dispatch("notification/add", notification, { root: true });
    } catch (error) {
      const notification = {
        type: "error",
        message: "There was a problem creating your event: " + error.message
      };
      dispatch("notification/add", notification, { root: true });
      throw error;
    }
  },
  async fetchEvents({ commit, dispatch, state }, { page }) {
    try {
      const response = await EventService.getEvents(state.perPage, page);
      console.log("Total events are " + response.headers["x-total-count"]);
      commit("SET_EVENTS", response.data);
      commit("SET_EVENTS_TOTAL", parseInt(response.headers["x-total-count"]));
      return response.data;
    } catch (err) {
      const notification = {
        type: "error",
        message: "There was a problem fetchin events: " + err.message
      };
      dispatch("notification/add", notification, { root: true });
    }
  },
  async fetchEvent({ commit, getters, state }, id) {
    if (id == state.event.id) {
      return state.event;
    }

    let event = getters.getEventById(id);

    if (event) {
      commit("SET_EVENT", event);
      return event;
    } else {
      const res = await EventService.getEvent(id);
      commit("SET_EVENT", res.data);
      return res.data;
    }
  }
};

export const getters = {
  getEventById: state => id => {
    return state.events.find(event => event.id === id);
  }
};
