// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.
'use strict';

var Grommet = {
  // Components
  Anchor: require('./components/Anchor'),
  App: require('./components/App'),
  Article: require('./components/Article'),
  Box: require('./components/Box'),
  Button: require('./components/Button'),
  Calendar: require('./components/Calendar'),
  Carousel: require('./components/Carousel'),
  Chart: require('./components/Chart'),
  CheckBox: require('./components/CheckBox'),
  Distribution: require('./components/Distribution'),
  Donut: require('./components/Donut'),
  Footer: require('./components/Footer'),
  Form: require('./components/Form'),
  FormField: require('./components/FormField'),
  FormFields: require('./components/FormFields'),
  Header: require('./components/Header'),
  Headline: require('./components/Headline'),
  Label: require('./components/Label'),
  Layer: require('./components/Layer'),
  Legend: require('./components/Legend'),
  List: require('./components/List'),
  ListItem: require('./components/ListItem'),
  Login: require('./components/Login'),
  LoginForm: require('./components/LoginForm'),
  Map: require('./components/Map'),
  Menu: require('./components/Menu'),
  Meter: require('./components/Meter'),
  RadioButton: require('./components/RadioButton'),
  Search: require('./components/Search'),
  SearchInput: require('./components/SearchInput'),
  Section: require('./components/Section'),
  Sidebar: require('./components/Sidebar'),
  Split: require('./components/Split'),
  Table: require('./components/Table'),
  Tiles: require('./components/Tiles'),
  Tile: require('./components/Tile'),
  Title: require('./components/Title'),
  Topology: require('./components/Topology'),
  Object: require('./components/Object'),
  TBD: require('./components/TBD'),
  Icons: {
    Calendar: require('./components/icons/Calendar'),
    Clear: require('./components/icons/Clear'),
    DragHandle: require('./components/icons/DragHandle'),
    Edit: require('./components/icons/Edit'),
    Facebook: require('./components/icons/Facebook'),
    Filter: require('./components/icons/Filter'),
    Grommet: require('./components/icons/Grommet'),
    Help: require('./components/icons/Help'),
    Left: require('./components/icons/Left'),
    LinkedIn: require('./components/icons/LinkedIn'),
    Mail: require('./components/icons/Mail'),
    More: require('./components/icons/More'),
    Person: require('./components/icons/Person'),
    Right: require('./components/icons/Right'),
    Search: require('./components/icons/Search'),
    SearchPlus: require('./components/icons/SearchPlus'),
    Spinning: require('./components/icons/Spinning'),
    Status: require('./components/icons/Status'),
    Twitter: require('./components/icons/Twitter'),
    World: require('./components/icons/World'),
    Base: require('./index-icons')
  },
  // Mixins
  Mixins: {
    KeyboardAccelerators: require('./mixins/KeyboardAccelerators'),
    ReactLayeredComponent: require('./mixins/ReactLayeredComponent')
  },
  // Actions
  Actions: require('./actions/Actions'),
  // Stores
  SessionStore: require('./stores/SessionStore'),
  // Utils
  Cookies: require('./utils/Cookies'),
  DOM: require('./utils/DOM'),
  Locale: require('./utils/Locale'),
  Rest: require('./utils/Rest'),
  RestWatch: require('./utils/RestWatch'),
  Validator: require('./utils/Validator')
};

module.exports = Grommet;