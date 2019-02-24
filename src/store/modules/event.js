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
  event: {}
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
  async fetchEvents({ commit, dispatch }, { perPage, page }) {
    try {
      const response = await EventService.getEvents(perPage, page);
      console.log("Total events are " + response.headers["x-total-count"]);
      commit("SET_EVENTS", response.data);
      commit("SET_EVENTS_TOTAL", parseInt(response.headers["x-total-count"]));
    } catch (err) {
      const notification = {
        type: "error",
        message: "There was a problem fetchin events: " + err.message
      };
      dispatch("notification/add", notification, { root: true });
    }
  },
  async fetchEvent({ commit, getters, dispatch }, id) {
    let event = getters.getEventById(id);

    if (event) {
      commit("SET_EVENT", event);
    } else {
      try {
        const res = await EventService.getEvent(id);
        commit("SET_EVENT", res.data);
      } catch (err) {
        const notification = {
          type: "error",
          message: "There was a problem fetchin event: " + err.message
        };
        dispatch("notification/add", notification, { root: true });
      }
    }
  }
};

export const getters = {
  getEventById: state => id => {
    return state.events.find(event => event.id === id);
  }
};
