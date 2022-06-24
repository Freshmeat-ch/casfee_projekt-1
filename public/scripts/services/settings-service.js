export class SettingsService {
  constructor() {
    this.storage = 'tuuduuSettings';
    this.settings = JSON.parse(localStorage.getItem(this.storage)) || {};
  }

  setTheme(theme) {
    this.settings.theme = theme;
    this.store();
  }

  getTheme() {
    return this.settings.theme;
  }

  setSorting(sortBy, sortDirection) {
    this.settings.sorting = {
      sortBy,
      sortDirection,
    };
    this.store();
  }

  getSorting() {
    return this.settings.sorting;
  }

  setFilterDone(filterDone, filterDoneState) {
    this.settings.filterDone = {
      filterDone,
      filterDoneState,
    };
    this.store();
  }

  getFilterDone() {
    return this.settings.filterDone;
  }

  setFilterOverdue(filterOverdue, filterOverdueState) {
    this.settings.filterOverdue = {
      filterOverdue,
      filterOverdueState,
    };
    this.store();
  }

  getFilterOverdue() {
    return this.settings.filterOverdue;
  }

  store() {
    localStorage.setItem(this.storage, JSON.stringify(this.settings));
  }
}
